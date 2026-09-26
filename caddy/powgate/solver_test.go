package powgate

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"testing"
	"time"
)

var (
	challengeScript = regexp.MustCompile(`(?s)<script>(.*)</script>`)
	challengeLZ     = regexp.MustCompile(`function lz\(a\)\{.*?return n;\}`)
)

const solverHarness = `
const out = { cookies: [], reloads: 0 };
Object.defineProperty(globalThis, 'document', {
  configurable: true,
  value: Object.defineProperty({}, 'cookie', {
    get() { return ''; },
    set(v) { out.cookies.push(v); },
  }),
});
Object.defineProperty(globalThis, 'location', {
  configurable: true,
  value: { reload() { out.reloads++; process.stdout.write(JSON.stringify(out)); } },
});
`

type solverResult struct {
	Cookies []string `json:"cookies"`
	Reloads int      `json:"reloads"`
}

func requireNode(t *testing.T) string {
	t.Helper()
	path, err := exec.LookPath("node")
	if err != nil {
		t.Skip("node is not installed, the challenge script cannot be executed")
	}
	return path
}

func runNode(t *testing.T, node, src string) []byte {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	cmd := exec.CommandContext(ctx, node, "--input-type=commonjs", "-")
	cmd.Stdin = strings.NewReader(src)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		t.Fatalf("node: %v\n%s", err, stderr.String())
	}
	return stdout.Bytes()
}

func solveChallenge(t *testing.T, node string, page string) solverResult {
	t.Helper()
	m := challengeScript.FindStringSubmatch(page)
	if m == nil {
		t.Fatalf("challenge page has no inline script: %s", page)
	}
	raw := runNode(t, node, solverHarness+m[1])
	var res solverResult
	if err := json.Unmarshal(raw, &res); err != nil {
		t.Fatalf("decode solver output %q: %v", raw, err)
	}
	return res
}

func splitCookie(t *testing.T, raw string) (string, string, map[string]string) {
	t.Helper()
	parts := strings.Split(raw, ";")
	name, value, ok := strings.Cut(parts[0], "=")
	if !ok {
		t.Fatalf("cookie %q has no name=value pair", raw)
	}
	attrs := make(map[string]string, len(parts)-1)
	for _, a := range parts[1:] {
		k, v, _ := strings.Cut(strings.TrimSpace(a), "=")
		attrs[strings.ToLower(k)] = v
	}
	return name, value, attrs
}

func TestChallengeScriptSolutionPassesGate(t *testing.T) {
	node := requireNode(t)
	cases := []struct {
		name       string
		difficulty int
		ttl        time.Duration
		cookie     string
	}{
		{"trivial difficulty", 1, time.Minute, ""},
		{"byte aligned difficulty", 8, 10 * time.Minute, ""},
		{"unaligned difficulty", 11, 30 * time.Minute, ""},
		{"custom cookie name", 6, time.Hour, "gate_token"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			p := newGate(t, tc.difficulty, tc.ttl)
			if tc.cookie != "" {
				p.Cookie = tc.cookie
			}
			calls := 0

			first := httptest.NewRecorder()
			if err := p.ServeHTTP(first, httptest.NewRequest(http.MethodGet, "/", nil), countingNext(&calls)); err != nil {
				t.Fatalf("ServeHTTP: %v", err)
			}
			if calls != 0 {
				t.Fatal("a request without a cookie reached the next handler")
			}

			res := solveChallenge(t, node, first.Body.String())
			if res.Reloads != 1 {
				t.Fatalf("reloads = %d, want 1", res.Reloads)
			}
			if len(res.Cookies) != 1 {
				t.Fatalf("cookies written = %d, want 1", len(res.Cookies))
			}

			name, value, attrs := splitCookie(t, res.Cookies[0])
			if name != p.Cookie {
				t.Fatalf("cookie name = %q, want %q", name, p.Cookie)
			}
			if attrs["path"] != "/" {
				t.Fatalf("path = %q, want /", attrs["path"])
			}
			if attrs["samesite"] != "strict" {
				t.Fatalf("samesite = %q, want strict", attrs["samesite"])
			}
			if got, want := attrs["max-age"], strconv.Itoa(int(tc.ttl.Seconds())); got != want {
				t.Fatalf("max-age = %q, want %q", got, want)
			}
			if !p.valid(value) {
				t.Fatalf("the gate rejected the token the browser solver produced: %q", value)
			}

			req := httptest.NewRequest(http.MethodGet, "/", nil)
			req.AddCookie(&http.Cookie{Name: name, Value: value})
			second := httptest.NewRecorder()
			if err := p.ServeHTTP(second, req, countingNext(&calls)); err != nil {
				t.Fatalf("ServeHTTP: %v", err)
			}
			if calls != 1 {
				t.Fatalf("next called %d times, want 1", calls)
			}
			if second.Code != http.StatusNoContent {
				t.Fatalf("status = %d, want %d", second.Code, http.StatusNoContent)
			}
		})
	}
}

func TestChallengeScriptSolutionIsMinimal(t *testing.T) {
	node := requireNode(t)
	p := newGate(t, 10, time.Minute)
	rec := httptest.NewRecorder()
	if err := p.challenge(rec); err != nil {
		t.Fatalf("challenge: %v", err)
	}
	res := solveChallenge(t, node, rec.Body.String())
	if len(res.Cookies) != 1 {
		t.Fatalf("cookies written = %d, want 1", len(res.Cookies))
	}
	_, value, _ := splitCookie(t, res.Cookies[0])
	parts := strings.Split(value, ".")
	if len(parts) != 4 {
		t.Fatalf("token %q does not have four parts", value)
	}
	if want := mine(t, parts[0], p.Difficulty); parts[3] != want {
		t.Fatalf("nonce = %q, want the first valid nonce %q", parts[3], want)
	}
}

func TestChallengeScriptLeadingZerosMatchGo(t *testing.T) {
	node := requireNode(t)
	rec := httptest.NewRecorder()
	if err := newGate(t, 8, time.Minute).challenge(rec); err != nil {
		t.Fatalf("challenge: %v", err)
	}
	fn := challengeLZ.FindString(rec.Body.String())
	if fn == "" {
		t.Fatal("challenge script has no lz function")
	}

	inputs := make([][]byte, 0, 300)
	for b := range 256 {
		inputs = append(inputs, []byte{byte(b), 0xff})
	}
	inputs = append(inputs,
		[]byte{},
		[]byte{0, 0, 0},
		[]byte{0, 0, 1},
		[]byte{0, 0x80},
		[]byte{0, 0, 0, 0x0f, 0},
	)
	encoded, err := json.Marshal(func() [][]int {
		out := make([][]int, len(inputs))
		for i, in := range inputs {
			out[i] = make([]int, len(in))
			for j, b := range in {
				out[i][j] = int(b)
			}
		}
		return out
	}())
	if err != nil {
		t.Fatalf("encode inputs: %v", err)
	}

	raw := runNode(t, node, fn+"\nprocess.stdout.write(JSON.stringify("+string(encoded)+".map((a)=>lz(Uint8Array.from(a)))));")
	var got []int
	if err := json.Unmarshal(raw, &got); err != nil {
		t.Fatalf("decode lz output %q: %v", raw, err)
	}
	if len(got) != len(inputs) {
		t.Fatalf("lz results = %d, want %d", len(got), len(inputs))
	}
	for i, in := range inputs {
		if want := leadingZeroBits(in); got[i] != want {
			t.Errorf("lz(%x) = %d, want %d", in, got[i], want)
		}
	}
}
