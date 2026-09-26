package sitetest

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math/bits"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig"
	_ "github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	_ "github.com/caddyserver/caddy/v2/modules/standard"
	_ "github.com/mholt/caddy-ratelimit"
	_ "github.com/xsaveopt/fp-web/powgate"
)

const (
	secret      = "site-secret-for-rate-limit-tests"
	events      = 6
	difficulty  = 4
	indexMarker = "fp-web-index-page"
	firefoxUA   = "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
)

type site struct {
	base   string
	client *http.Client
}

type response struct {
	status int
	header http.Header
	body   string
}

func freePort(t *testing.T) int {
	t.Helper()
	l, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port
}

func replaceCounted(t *testing.T, src, old, repl string, want int) string {
	t.Helper()
	if got := strings.Count(src, old); got != want {
		t.Fatalf("Caddyfile has %d occurrences of %q, want %d", got, old, want)
	}
	return strings.ReplaceAll(src, old, repl)
}

func startSite(t *testing.T) *site {
	t.Helper()
	home := t.TempDir()
	t.Setenv("HOME", home)
	t.Setenv("XDG_DATA_HOME", filepath.Join(home, "data"))
	t.Setenv("XDG_CONFIG_HOME", filepath.Join(home, "config"))
	t.Setenv("POW_SECRET", secret)
	t.Setenv("POW_DIFFICULTY", strconv.Itoa(difficulty))
	t.Setenv("POW_TTL", "5m")
	t.Setenv("RL_EVENTS", strconv.Itoa(events))
	t.Setenv("RL_WINDOW", "1h")
	t.Setenv("ALLOWED_DOMAIN", "fp.example.org")

	root := t.TempDir()
	page := "<!doctype html><title>" + indexMarker + "</title>"
	if err := os.WriteFile(filepath.Join(root, "index.html"), []byte(page), 0o644); err != nil {
		t.Fatalf("write index: %v", err)
	}

	raw, err := os.ReadFile(filepath.Join("..", "..", "Caddyfile"))
	if err != nil {
		t.Fatalf("read Caddyfile: %v", err)
	}
	port := freePort(t)
	src := replaceCounted(t, string(raw), ":8080 {", fmt.Sprintf(":%d {", port), 1)
	src = replaceCounted(t, src, " /srv\n", " "+root+"\n", 2)

	adapted, warnings, err := caddyconfig.GetAdapter("caddyfile").Adapt([]byte(src), map[string]any{"filename": "Caddyfile"})
	if err != nil {
		t.Fatalf("adapt Caddyfile: %v", err)
	}
	if len(warnings) > 0 {
		t.Fatalf("adapt Caddyfile warnings: %v", warnings)
	}

	var cfg map[string]any
	if err := json.Unmarshal(adapted, &cfg); err != nil {
		t.Fatalf("decode adapted config: %v", err)
	}
	cfg["admin"] = map[string]any{"disabled": true, "config": map[string]any{"persist": false}}
	discard := map[string]any{"output": "discard"}
	logging, _ := cfg["logging"].(map[string]any)
	if logging == nil {
		t.Fatal("adapted config has no logging section")
	}
	logs, _ := logging["logs"].(map[string]any)
	for _, l := range logs {
		l.(map[string]any)["writer"] = discard
	}
	logs["default"] = map[string]any{"writer": discard}
	out, err := json.Marshal(cfg)
	if err != nil {
		t.Fatalf("encode config: %v", err)
	}

	if err := caddy.Load(out, true); err != nil {
		t.Fatalf("load config: %v", err)
	}
	t.Cleanup(func() {
		if err := caddy.Stop(); err != nil {
			t.Errorf("stop caddy: %v", err)
		}
	})

	return &site{
		base: fmt.Sprintf("http://127.0.0.1:%d", port),
		client: &http.Client{
			Timeout:       10 * time.Second,
			Transport:     &http.Transport{DisableCompression: true},
			CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse },
		},
	}
}

func (s *site) get(t *testing.T, path string, headers map[string]string) response {
	t.Helper()
	req, err := http.NewRequest(http.MethodGet, s.base+path, nil)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	res, err := s.client.Do(req)
	if err != nil {
		t.Fatalf("GET %s: %v", path, err)
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("read body: %v", err)
	}
	return response{status: res.StatusCode, header: res.Header, body: string(body)}
}

func browser(ip string) map[string]string {
	return map[string]string{
		"Sec-Fetch-Mode":  "navigate",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "identity",
		"User-Agent":      firefoxUA,
		"X-Forwarded-For": ip,
	}
}

func withCookie(h map[string]string) map[string]string {
	out := make(map[string]string, len(h)+1)
	for k, v := range h {
		out[k] = v
	}
	out["Cookie"] = "__pow=" + solvedToken()
	return out
}

func solvedToken() string {
	seed := "0123456789abcdef"
	ts := strconv.FormatInt(time.Now().Unix(), 10)
	m := hmac.New(sha256.New, []byte(secret))
	m.Write([]byte(seed + "." + ts))
	sig := hex.EncodeToString(m.Sum(nil))
	for i := 0; ; i++ {
		nonce := strconv.Itoa(i)
		sum := sha256.Sum256([]byte(seed + nonce))
		zeros := 0
		for _, b := range sum {
			if b == 0 {
				zeros += 8
				continue
			}
			zeros += bits.LeadingZeros8(b)
			break
		}
		if zeros >= difficulty {
			return strings.Join([]string{seed, ts, sig, nonce}, ".")
		}
	}
}

func expectLimited(t *testing.T, r response) {
	t.Helper()
	if r.status != http.StatusNotFound {
		t.Fatalf("status = %d, want 404 once the limit is hit (body %q)", r.status, r.body)
	}
	if r.body != "" {
		t.Fatalf("body = %q, want empty", r.body)
	}
	for _, k := range []string{"Retry-After", "Cache-Control", "Server"} {
		if got := r.header.Get(k); got != "" {
			t.Fatalf("%s = %q, want it stripped from the limited response", k, got)
		}
	}
	want := map[string]string{
		"X-Content-Type-Options": "nosniff",
		"X-Robots-Tag":           "noindex",
		"Referrer-Policy":        "no-referrer",
	}
	for k, v := range want {
		if got := r.header.Get(k); got != v {
			t.Fatalf("%s = %q, want %q on the limited response", k, got, v)
		}
	}
}

func TestRealRateLimit(t *testing.T) {
	s := startSite(t)

	t.Run("the index is served until the per client limit", func(t *testing.T) {
		h := withCookie(browser("10.1.0.1"))
		for i := range events {
			r := s.get(t, "/", h)
			if r.status != http.StatusOK || !strings.Contains(r.body, indexMarker) {
				t.Fatalf("request %d: status %d body %q, want the index", i+1, r.status, r.body)
			}
		}
		expectLimited(t, s.get(t, "/", h))
		expectLimited(t, s.get(t, "/", h))
	})

	t.Run("challenge requests count against the limit", func(t *testing.T) {
		h := browser("10.1.0.2")
		for i := range events {
			r := s.get(t, "/", h)
			if r.status != http.StatusOK || !strings.Contains(r.body, "crypto.subtle") {
				t.Fatalf("request %d: status %d, want the challenge", i+1, r.status)
			}
		}
		expectLimited(t, s.get(t, "/", withCookie(h)))
	})

	t.Run("each forwarded client has its own budget", func(t *testing.T) {
		r := s.get(t, "/", withCookie(browser("10.1.0.3")))
		if r.status != http.StatusOK || !strings.Contains(r.body, indexMarker) {
			t.Fatalf("status %d body %q, want the index for a fresh client", r.status, r.body)
		}
	})

	t.Run("only the root is limited", func(t *testing.T) {
		h := browser("10.1.0.1")
		for range events + 2 {
			if r := s.get(t, "/c", h); r.status != http.StatusOK {
				t.Fatalf("/c status = %d, want 200 for a limited client", r.status)
			}
			if r := s.get(t, "/health", nil); r.status != http.StatusOK || r.body != "up" {
				t.Fatalf("/health status = %d body %q, want up", r.status, r.body)
			}
		}
	})
}
