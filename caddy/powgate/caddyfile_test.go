package powgate

import (
	"compress/gzip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
	_ "github.com/caddyserver/caddy/v2/modules/caddyhttp/encode/gzip"
	_ "github.com/caddyserver/caddy/v2/modules/caddyhttp/encode/zstd"
	_ "github.com/caddyserver/caddy/v2/modules/caddyhttp/fileserver"
	_ "github.com/caddyserver/caddy/v2/modules/caddyhttp/headers"
	_ "github.com/caddyserver/caddy/v2/modules/logging"
)

const (
	siteSecret  = "site-secret-for-caddyfile-tests"
	siteDomain  = "fp.example.org"
	siteEvents  = 40
	indexMarker = "fp-web-index-page"
	firefoxUA   = "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
)

type stubRateLimit struct {
	Key    string         `json:"key,omitempty"`
	Events int            `json:"events,omitempty"`
	Window caddy.Duration `json:"window,omitempty"`

	mu   sync.Mutex
	seen map[string]int
}

func init() {
	caddy.RegisterModule(&stubRateLimit{})
	httpcaddyfile.RegisterHandlerDirective("rate_limit", func(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
		s := new(stubRateLimit)
		err := s.UnmarshalCaddyfile(h.Dispenser)
		return s, err
	})
}

func (*stubRateLimit) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.rate_limit",
		New: func() caddy.Module { return new(stubRateLimit) },
	}
}

func (s *stubRateLimit) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	d.Next()
	for zone := d.Nesting(); d.NextBlock(zone); {
		if d.Val() != "zone" || !d.NextArg() {
			return d.Errf("unexpected rate_limit token %q", d.Val())
		}
		for opts := d.Nesting(); d.NextBlock(opts); {
			field := d.Val()
			if !d.NextArg() {
				return d.ArgErr()
			}
			switch field {
			case "key":
				s.Key = d.Val()
			case "events":
				n, err := strconv.Atoi(d.Val())
				if err != nil {
					return d.Errf("invalid events %q: %v", d.Val(), err)
				}
				s.Events = n
			case "window":
				dur, err := caddy.ParseDuration(d.Val())
				if err != nil {
					return d.Errf("invalid window %q: %v", d.Val(), err)
				}
				s.Window = caddy.Duration(dur)
			default:
				return d.Errf("unknown rate_limit option %q", field)
			}
		}
	}
	return nil
}

func (s *stubRateLimit) Provision(caddy.Context) error {
	s.seen = map[string]int{}
	return nil
}

func (s *stubRateLimit) ServeHTTP(w http.ResponseWriter, r *http.Request, next caddyhttp.Handler) error {
	repl := r.Context().Value(caddy.ReplacerCtxKey).(*caddy.Replacer)
	key := repl.ReplaceAll(s.Key, "")
	s.mu.Lock()
	s.seen[key]++
	n := s.seen[key]
	s.mu.Unlock()
	if n > s.Events {
		w.Header().Set("Retry-After", strconv.Itoa(int(time.Duration(s.Window).Seconds())))
		return caddyhttp.Error(http.StatusTooManyRequests, errors.New("rate limit exceeded"))
	}
	return next.ServeHTTP(w, r)
}

type site struct {
	base   string
	root   string
	client *http.Client
	gate   *PowGate
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

func startSite(t *testing.T, secret string) *site {
	t.Helper()
	home := t.TempDir()
	t.Setenv("HOME", home)
	t.Setenv("XDG_DATA_HOME", filepath.Join(home, "data"))
	t.Setenv("XDG_CONFIG_HOME", filepath.Join(home, "config"))
	t.Setenv("POW_SECRET", secret)
	t.Setenv("POW_DIFFICULTY", "4")
	t.Setenv("POW_TTL", "5m")
	t.Setenv("RL_EVENTS", strconv.Itoa(siteEvents))
	t.Setenv("RL_WINDOW", "1h")
	t.Setenv("ALLOWED_DOMAIN", siteDomain)

	root := t.TempDir()
	page := "<!doctype html><title>" + indexMarker + "</title>" + strings.Repeat("<p>padding</p>", 200)
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
		t.Fatal("adapted config has no logging section, the site log block is gone")
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

	gate := &PowGate{Secret: secret, Difficulty: 4, TTL: caddy.Duration(5 * time.Minute)}
	if err := gate.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	return &site{
		base: fmt.Sprintf("http://127.0.0.1:%d", port),
		root: root,
		gate: gate,
		client: &http.Client{
			Timeout:       10 * time.Second,
			Transport:     &http.Transport{DisableCompression: true},
			CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse },
		},
	}
}

type response struct {
	status int
	header http.Header
	body   string
}

func (s *site) do(t *testing.T, method, path string, headers map[string]string) response {
	t.Helper()
	req, err := http.NewRequest(method, s.base+path, nil)
	if err != nil {
		t.Fatalf("new request: %v", err)
	}
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	res, err := s.client.Do(req)
	if err != nil {
		t.Fatalf("%s %s: %v", method, path, err)
	}
	defer res.Body.Close()
	var r io.Reader = res.Body
	if method != http.MethodHead && res.Header.Get("Content-Encoding") == "gzip" {
		gz, err := gzip.NewReader(res.Body)
		if err != nil {
			t.Fatalf("gzip reader: %v", err)
		}
		r = gz
	}
	body, err := io.ReadAll(r)
	if err != nil {
		t.Fatalf("read body: %v", err)
	}
	return response{status: res.StatusCode, header: res.Header, body: string(body)}
}

func browserHeaders(ip string) map[string]string {
	return map[string]string{
		"Sec-Fetch-Mode":  "navigate",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "gzip",
		"User-Agent":      firefoxUA,
		"X-Forwarded-For": ip,
	}
}

func with(h map[string]string, k, v string) map[string]string {
	out := make(map[string]string, len(h)+1)
	for key, val := range h {
		out[key] = val
	}
	if v == "" {
		delete(out, k)
	} else {
		out[k] = v
	}
	return out
}

func (s *site) cookie(t *testing.T) string {
	t.Helper()
	return s.gate.Cookie + "=" + token(t, s.gate, "0123456789abcdef", time.Now())
}

func expectStatus(t *testing.T, r response, want int) {
	t.Helper()
	if r.status != want {
		t.Fatalf("status = %d, want %d (body %q)", r.status, want, r.body)
	}
}

func expectBaseHeaders(t *testing.T, r response) {
	t.Helper()
	want := map[string]string{
		"X-Content-Type-Options":     "nosniff",
		"X-Robots-Tag":               "noindex",
		"Referrer-Policy":            "no-referrer",
		"Cross-Origin-Opener-Policy": "same-origin",
		"Permissions-Policy":         "interest-cohort=()",
	}
	for k, v := range want {
		if got := r.header.Get(k); got != v {
			t.Errorf("%s = %q, want %q", k, got, v)
		}
	}
	for _, k := range []string{"Server", "X-Powered-By", "Last-Modified", "ETag"} {
		if got := r.header.Get(k); got != "" {
			t.Errorf("%s = %q, want it stripped", k, got)
		}
	}
}

func expectChallenge(t *testing.T, r response) {
	t.Helper()
	expectStatus(t, r, http.StatusOK)
	if challengeParams.FindStringSubmatch(r.body) == nil {
		t.Fatalf("expected the proof of work challenge, got %q", r.body)
	}
}

func TestCaddyfile(t *testing.T) {
	s := startSite(t, siteSecret)

	t.Run("health reports up when the site is built", func(t *testing.T) {
		r := s.do(t, http.MethodGet, "/health", nil)
		expectStatus(t, r, http.StatusOK)
		if r.body != "up" {
			t.Fatalf("body = %q, want up", r.body)
		}
		if r.header.Get("Cache-Control") != "no-store" {
			t.Fatalf("Cache-Control = %q, want no-store", r.header.Get("Cache-Control"))
		}
		if !strings.HasPrefix(r.header.Get("Content-Type"), "text/plain") {
			t.Fatalf("Content-Type = %q, want text/plain", r.header.Get("Content-Type"))
		}
		expectBaseHeaders(t, r)
	})

	t.Run("health reports degraded without an index page", func(t *testing.T) {
		index := filepath.Join(s.root, "index.html")
		moved := index + ".bak"
		if err := os.Rename(index, moved); err != nil {
			t.Fatalf("rename: %v", err)
		}
		defer func() {
			if err := os.Rename(moved, index); err != nil {
				t.Fatalf("restore: %v", err)
			}
		}()
		r := s.do(t, http.MethodGet, "/health", nil)
		expectStatus(t, r, http.StatusServiceUnavailable)
		if r.body != "degraded" {
			t.Fatalf("body = %q, want degraded", r.body)
		}
		if r.header.Get("Cache-Control") != "no-store" {
			t.Fatalf("Cache-Control = %q, want no-store", r.header.Get("Cache-Control"))
		}
	})

	t.Run("browser without cookie gets the challenge", func(t *testing.T) {
		r := s.do(t, http.MethodGet, "/", browserHeaders("10.0.0.1"))
		expectChallenge(t, r)
		if strings.Contains(r.body, indexMarker) {
			t.Fatal("the site was served without a solved challenge")
		}
		if r.header.Get("Cache-Control") != "no-store" {
			t.Fatalf("Cache-Control = %q, want no-store", r.header.Get("Cache-Control"))
		}
		expectBaseHeaders(t, r)
	})

	t.Run("real browser user agents pass the filters", func(t *testing.T) {
		agents := []string{
			firefoxUA,
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
			"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
			"Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
		}
		for i, ua := range agents {
			r := s.do(t, http.MethodGet, "/", with(browserHeaders(fmt.Sprintf("10.0.1.%d", i)), "User-Agent", ua))
			expectChallenge(t, r)
		}
	})

	t.Run("valid cookie serves the compressed index", func(t *testing.T) {
		h := with(browserHeaders("10.0.0.2"), "Cookie", s.cookie(t))
		r := s.do(t, http.MethodGet, "/", h)
		expectStatus(t, r, http.StatusOK)
		if !strings.Contains(r.body, indexMarker) {
			t.Fatalf("body is not the index page: %q", r.body)
		}
		if r.header.Get("Content-Encoding") != "gzip" {
			t.Fatalf("Content-Encoding = %q, want gzip", r.header.Get("Content-Encoding"))
		}
		if r.header.Get("Cache-Control") != "no-cache" {
			t.Fatalf("Cache-Control = %q, want no-cache", r.header.Get("Cache-Control"))
		}
		expectBaseHeaders(t, r)
	})

	t.Run("head on the root is allowed", func(t *testing.T) {
		h := with(browserHeaders("10.0.0.3"), "Cookie", s.cookie(t))
		expectStatus(t, s.do(t, http.MethodHead, "/", h), http.StatusOK)
	})

	t.Run("only the root is served", func(t *testing.T) {
		h := with(browserHeaders("10.0.0.4"), "Cookie", s.cookie(t))
		for _, p := range []string{"/index.html", "/.env", "/.git/config", "/wp-login.php", "/health/x", "/c/x", "/m.js"} {
			r := s.do(t, http.MethodGet, p, h)
			expectStatus(t, r, http.StatusNotFound)
			if strings.Contains(r.body, indexMarker) {
				t.Fatalf("%s leaked the index page", p)
			}
			expectBaseHeaders(t, r)
		}
	})

	t.Run("missing browser headers are refused", func(t *testing.T) {
		for _, name := range []string{"Sec-Fetch-Mode", "Accept-Language", "Accept-Encoding", "User-Agent"} {
			t.Run(name, func(t *testing.T) {
				h := with(browserHeaders("10.0.0.5"), name, "")
				for _, p := range []string{"/", "/c", "/favicon.ico"} {
					r := s.do(t, http.MethodGet, p, h)
					expectStatus(t, r, http.StatusNotFound)
					expectBaseHeaders(t, r)
				}
			})
		}
	})

	t.Run("user agents without mozilla are refused", func(t *testing.T) {
		for _, ua := range []string{"Opera/9.80 (Windows NT 6.1) Presto/2.12.388", "Mozilla/4.0 (compatible; MSIE 6.0)", "Lynx/2.9.0"} {
			expectStatus(t, s.do(t, http.MethodGet, "/", with(browserHeaders("10.0.0.6"), "User-Agent", ua)), http.StatusNotFound)
		}
	})

	t.Run("tool and automation user agents are refused", func(t *testing.T) {
		agents := []string{
			"Mozilla/5.0 curl/8.9.1",
			"Mozilla/5.0 Wget/1.24",
			"Mozilla/5.0 python-requests/2.32",
			"Mozilla/5.0 Python-urllib/3.13",
			"Mozilla/5.0 libwww-perl/6.77",
			"Mozilla/5.0 Go-http-client/1.1",
			"Mozilla/5.0 HttpClient/5",
			"Mozilla/5.0 http_client",
			"Mozilla/5.0 okhttp/4.12.0",
			"Mozilla/5.0 Java/21.0.4",
			"Mozilla/5.0 Apache-HttpClient/5.3",
			"Mozilla/5.0 Scrapy/2.11",
			"Mozilla/5.0 python-httpx/0.27",
			"Mozilla/5.0 aiohttp/3.10",
			"Mozilla/5.0 axios/1.7.7",
			"Mozilla/5.0 node-fetch/3.3",
			"Mozilla/5.0 got/14.4",
			"Mozilla/5.0 reqwest/0.12",
			"Mozilla/5.0 GuzzleHttp/7",
			"Mozilla/5.0 PostmanRuntime/7.42",
			"Mozilla/5.0 insomnia/10.0",
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36",
			"Mozilla/5.0 PhantomJS/2.1.1",
			"Mozilla/5.0 Puppeteer",
			"Mozilla/5.0 Playwright/1.47",
			"Mozilla/5.0 Selenium",
			"Mozilla/5.0 (compatible; Baiduspider/2.0)",
			"Mozilla/5.0 (compatible; CCBot crawler)",
			"Mozilla/5.0 (compatible; bot)",
			"Mozilla/5.0 (X11; Linux x86_64) bot/1.0",
			"MOZILLA/5.0 CURL/8.9.1",
		}
		for _, ua := range agents {
			r := s.do(t, http.MethodGet, "/", with(browserHeaders("10.0.0.7"), "User-Agent", ua))
			if r.status != http.StatusNotFound {
				t.Errorf("%q got status %d, want 404", ua, r.status)
			}
		}
	})

	t.Run("conditional requests are refused", func(t *testing.T) {
		conditional := map[string]string{
			"If-Modified-Since":   "Mon, 01 Jan 2024 00:00:00 GMT",
			"If-None-Match":       `"abc"`,
			"If-Match":            "*",
			"If-Unmodified-Since": "Mon, 01 Jan 2024 00:00:00 GMT",
			"If-Range":            `"abc"`,
		}
		for k, v := range conditional {
			h := with(with(browserHeaders("10.0.0.8"), "Cookie", s.cookie(t)), k, v)
			for _, p := range []string{"/", "/c"} {
				r := s.do(t, http.MethodGet, p, h)
				if r.status != http.StatusNotFound {
					t.Errorf("%s on %s got status %d, want 404", k, p, r.status)
				}
			}
		}
	})

	t.Run("methods other than get and head are refused", func(t *testing.T) {
		h := with(browserHeaders("10.0.0.9"), "Cookie", s.cookie(t))
		for _, m := range []string{http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions} {
			for _, p := range []string{"/", "/c"} {
				r := s.do(t, m, p, h)
				if r.status != http.StatusNotFound {
					t.Errorf("%s %s got status %d, want 404", m, p, r.status)
				}
			}
		}
	})

	t.Run("favicon answers with no content", func(t *testing.T) {
		r := s.do(t, http.MethodGet, "/favicon.ico", browserHeaders("10.0.0.10"))
		expectStatus(t, r, http.StatusNoContent)
		if r.body != "" {
			t.Fatalf("body = %q, want empty", r.body)
		}
	})

	t.Run("config endpoint returns the allowed domain", func(t *testing.T) {
		r := s.do(t, http.MethodGet, "/c", browserHeaders("10.0.0.11"))
		expectStatus(t, r, http.StatusOK)
		if r.body != siteDomain {
			t.Fatalf("body = %q, want %q", r.body, siteDomain)
		}
		if !strings.HasPrefix(r.header.Get("Content-Type"), "text/plain") {
			t.Fatalf("Content-Type = %q, want text/plain", r.header.Get("Content-Type"))
		}
		if r.header.Get("Cache-Control") != "no-store" {
			t.Fatalf("Cache-Control = %q, want no-store", r.header.Get("Cache-Control"))
		}
		expectBaseHeaders(t, r)
	})

	t.Run("rate limit turns into a bare 404 on the root only", func(t *testing.T) {
		h := browserHeaders("10.0.9.1")
		for i := range siteEvents {
			r := s.do(t, http.MethodGet, "/", h)
			if r.status != http.StatusOK {
				t.Fatalf("request %d of %d from a fresh client got status %d, the bucket is not per client", i+1, siteEvents, r.status)
			}
			expectChallenge(t, r)
		}
		r := s.do(t, http.MethodGet, "/", h)
		expectStatus(t, r, http.StatusNotFound)
		limited := &r
		if challengeParams.FindStringSubmatch(limited.body) != nil {
			t.Fatal("a limited client still got the challenge")
		}
		for _, k := range []string{"Retry-After", "Cache-Control"} {
			if got := limited.header.Get(k); got != "" {
				t.Errorf("%s = %q, want it stripped", k, got)
			}
		}
		expectBaseHeaders(t, *limited)

		expectStatus(t, s.do(t, http.MethodGet, "/", h), http.StatusNotFound)
		for range 3 {
			r := s.do(t, http.MethodGet, "/c", h)
			expectStatus(t, r, http.StatusOK)
			if r.body != siteDomain {
				t.Fatalf("body = %q, want %q", r.body, siteDomain)
			}
		}
		expectStatus(t, s.do(t, http.MethodGet, "/favicon.ico", h), http.StatusNoContent)
		expectStatus(t, s.do(t, http.MethodGet, "/health", nil), http.StatusOK)

		expectChallenge(t, s.do(t, http.MethodGet, "/", browserHeaders("10.0.9.2")))
	})
}

func TestCaddyfileSecretWithSpaces(t *testing.T) {
	secret := "a secret  with spaces"
	s := startSite(t, secret)

	h := with(browserHeaders("10.0.0.1"), "Cookie", s.cookie(t))
	r := s.do(t, http.MethodGet, "/", h)
	expectStatus(t, r, http.StatusOK)
	if !strings.Contains(r.body, indexMarker) {
		t.Fatalf("a cookie signed with the full secret did not serve the index: %q", r.body)
	}

	partial := &PowGate{Secret: "a", Difficulty: 4, TTL: caddy.Duration(5 * time.Minute)}
	if err := partial.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	h = with(browserHeaders("10.0.0.2"), "Cookie", partial.Cookie+"="+token(t, partial, "0123456789abcdef", time.Now()))
	expectChallenge(t, s.do(t, http.MethodGet, "/", h))
}
