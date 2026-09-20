package powgate

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

const testSecret = "correct horse battery staple"

func newGate(t *testing.T, difficulty int, ttl time.Duration) *PowGate {
	t.Helper()
	p := &PowGate{Secret: testSecret, Difficulty: difficulty, TTL: caddy.Duration(ttl)}
	if err := p.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	return p
}

func countLeadingZeros(b []byte) int {
	n := 0
	for _, c := range b {
		for mask := byte(0x80); mask > 0; mask >>= 1 {
			if c&mask != 0 {
				return n
			}
			n++
		}
	}
	return n
}

func mine(t *testing.T, seed string, difficulty int) string {
	t.Helper()
	for i := range 1 << 24 {
		nonce := strconv.Itoa(i)
		sum := sha256.Sum256([]byte(seed + nonce))
		if countLeadingZeros(sum[:]) >= difficulty {
			return nonce
		}
	}
	t.Fatalf("no nonce found for seed %q at difficulty %d", seed, difficulty)
	return ""
}

func token(t *testing.T, p *PowGate, seed string, issued time.Time) string {
	t.Helper()
	ts := strconv.FormatInt(issued.Unix(), 10)
	return strings.Join([]string{seed, ts, p.sign(seed, ts), mine(t, seed, p.Difficulty)}, ".")
}

func TestSignMatchesHMAC(t *testing.T) {
	p := newGate(t, 8, time.Minute)

	m := hmac.New(sha256.New, []byte(testSecret))
	m.Write([]byte("abc.123"))
	want := hex.EncodeToString(m.Sum(nil))

	if got := p.sign("abc", "123"); got != want {
		t.Fatalf("sign = %q, want %q", got, want)
	}
	if got := p.sign("abc", "123"); got != want {
		t.Fatal("sign is not deterministic")
	}
	if len(want) != sha256.Size*2 {
		t.Fatalf("signature length = %d, want %d", len(want), sha256.Size*2)
	}
}

func TestSignDependsOnSecretAndInputs(t *testing.T) {
	p := newGate(t, 8, time.Minute)
	other := &PowGate{Secret: testSecret + "!", Difficulty: 8}
	if err := other.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}

	base := p.sign("abc", "123")
	if other.sign("abc", "123") == base {
		t.Fatal("signature did not change with the secret")
	}
	if p.sign("abd", "123") == base {
		t.Fatal("signature did not change with the seed")
	}
	if p.sign("abc", "124") == base {
		t.Fatal("signature did not change with the timestamp")
	}
	if p.sign("abc.1", "23") == base {
		t.Fatal("seed and timestamp are not separated in the signed message")
	}
}

func TestLeadingZeroBits(t *testing.T) {
	cases := []struct {
		name  string
		input []byte
		want  int
	}{
		{"empty", nil, 0},
		{"all ones", []byte{0xff}, 0},
		{"high bit set", []byte{0x80}, 0},
		{"one zero bit", []byte{0x7f}, 1},
		{"seven zero bits", []byte{0x01}, 7},
		{"one zero byte", []byte{0x00}, 8},
		{"zero byte then ones", []byte{0x00, 0xff}, 8},
		{"zero byte then nibble", []byte{0x00, 0x0f}, 12},
		{"two zero bytes", []byte{0x00, 0x00}, 16},
		{"zero bytes then high bit", []byte{0x00, 0x00, 0x40, 0xff}, 17},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := leadingZeroBits(c.input); got != c.want {
				t.Fatalf("leadingZeroBits(%x) = %d, want %d", c.input, got, c.want)
			}
		})
	}
}

func TestLeadingZeroBitsMatchesReference(t *testing.T) {
	for i := range 512 {
		sum := sha256.Sum256([]byte(strconv.Itoa(i)))
		if got, want := leadingZeroBits(sum[:]), countLeadingZeros(sum[:]); got != want {
			t.Fatalf("digest %d: leadingZeroBits = %d, want %d", i, got, want)
		}
	}
}

func TestValidAcceptsFreshToken(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	v := token(t, p, "deadbeef", time.Now())
	if !p.valid(v) {
		t.Fatalf("valid(%q) = false, want true", v)
	}
	if !p.valid(v) {
		t.Fatal("a token inside its TTL is not replayable, which the module does not intend")
	}
}

func TestValidRejectsMalformedTokens(t *testing.T) {
	p := newGate(t, 8, time.Minute)
	good := token(t, p, "deadbeef", time.Now())
	parts := strings.Split(good, ".")

	cases := map[string]string{
		"empty":          "",
		"single field":   "deadbeef",
		"three fields":   strings.Join(parts[:3], "."),
		"five fields":    good + ".0",
		"trailing dot":   good + ".",
		"only separator": "...",
	}
	for name, v := range cases {
		t.Run(name, func(t *testing.T) {
			if p.valid(v) {
				t.Fatalf("valid(%q) = true, want false", v)
			}
		})
	}
}

func TestValidRejectsTamperedFields(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	now := time.Now()
	good := token(t, p, "deadbeef", now)
	parts := strings.Split(good, ".")
	seed, ts, sig, nonce := parts[0], parts[1], parts[2], parts[3]

	forged := &PowGate{Secret: "another secret", Difficulty: 10, TTL: caddy.Duration(time.Minute)}
	if err := forged.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}

	cases := map[string]string{
		"swapped seed":         strings.Join([]string{"deadbeee", ts, sig, nonce}, "."),
		"moved timestamp":      strings.Join([]string{seed, strconv.FormatInt(now.Add(time.Hour).Unix(), 10), sig, nonce}, "."),
		"flipped signature":    strings.Join([]string{seed, ts, strings.Repeat("0", len(sig)), nonce}, "."),
		"truncated signature":  strings.Join([]string{seed, ts, sig[:len(sig)-1], nonce}, "."),
		"signature from other": strings.Join([]string{seed, ts, forged.sign(seed, ts), nonce}, "."),
		"non numeric ts":       strings.Join([]string{seed, "not-a-number", p.sign(seed, "not-a-number"), nonce}, "."),
		"empty ts":             strings.Join([]string{seed, "", p.sign(seed, ""), nonce}, "."),
	}
	for name, v := range cases {
		t.Run(name, func(t *testing.T) {
			if p.valid(v) {
				t.Fatalf("valid(%q) = true, want false", v)
			}
		})
	}
}

func TestValidRejectsExpiredToken(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	stale := token(t, p, "deadbeef", time.Now().Add(-2*time.Minute))
	if p.valid(stale) {
		t.Fatal("an expired token was accepted")
	}

	edge := token(t, p, "deadbeef", time.Now().Add(-59*time.Second))
	if !p.valid(edge) {
		t.Fatal("a token inside the TTL window was rejected")
	}
}

func TestValidRejectsInsufficientWork(t *testing.T) {
	p := newGate(t, 12, time.Minute)
	seed := "deadbeef"
	ts := strconv.FormatInt(time.Now().Unix(), 10)
	sig := p.sign(seed, ts)

	weak := ""
	for i := range 1 << 20 {
		nonce := strconv.Itoa(i)
		sum := sha256.Sum256([]byte(seed + nonce))
		if countLeadingZeros(sum[:]) < p.Difficulty {
			weak = nonce
			break
		}
	}
	if weak == "" {
		t.Fatal("could not find a nonce below the difficulty")
	}

	if p.valid(strings.Join([]string{seed, ts, sig, weak}, ".")) {
		t.Fatal("a token below the difficulty was accepted")
	}
	if p.valid(strings.Join([]string{seed, ts, sig, ""}, ".")) {
		t.Fatal("a token with an empty nonce was accepted")
	}
}

func TestValidHonoursDifficulty(t *testing.T) {
	seed := "deadbeef"
	easy := newGate(t, 4, time.Minute)
	hard := newGate(t, 20, time.Minute)

	ts := strconv.FormatInt(time.Now().Unix(), 10)
	v := strings.Join([]string{seed, ts, easy.sign(seed, ts), mine(t, seed, easy.Difficulty)}, ".")

	if !easy.valid(v) {
		t.Fatal("token mined at the easy difficulty was rejected by the easy gate")
	}
	if hard.valid(v) {
		t.Fatal("token mined at the easy difficulty was accepted by the hard gate")
	}
}

var challengeParams = regexp.MustCompile(
	`const seed="([0-9a-f]+)",ts="(\d+)",sig="([0-9a-f]+)",diff=(\d+),ck="([^"]*)",age=(\d+);`,
)

func TestChallengeResponse(t *testing.T) {
	p := newGate(t, 14, 10*time.Minute)
	rec := httptest.NewRecorder()
	if err := p.challenge(rec); err != nil {
		t.Fatalf("challenge: %v", err)
	}

	res := rec.Result()
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want %d", res.StatusCode, http.StatusOK)
	}
	headers := map[string]string{
		"Content-Type":           "text/html; charset=utf-8",
		"Cache-Control":          "no-store",
		"X-Content-Type-Options": "nosniff",
	}
	for k, want := range headers {
		if got := res.Header.Get(k); got != want {
			t.Fatalf("header %s = %q, want %q", k, got, want)
		}
	}

	m := challengeParams.FindStringSubmatch(rec.Body.String())
	if m == nil {
		t.Fatalf("challenge page did not carry the expected parameters: %s", rec.Body.String())
	}
	seed, ts, sig := m[1], m[2], m[3]

	if len(seed) != 32 {
		t.Fatalf("seed length = %d, want 32", len(seed))
	}
	if sig != p.sign(seed, ts) {
		t.Fatal("the challenge page carries a signature the gate does not accept")
	}
	if got, _ := strconv.Atoi(m[4]); got != p.Difficulty {
		t.Fatalf("difficulty = %d, want %d", got, p.Difficulty)
	}
	if m[5] != p.Cookie {
		t.Fatalf("cookie name = %q, want %q", m[5], p.Cookie)
	}
	if got, _ := strconv.Atoi(m[6]); got != 600 {
		t.Fatalf("max-age = %d, want 600", got)
	}

	issued, err := strconv.ParseInt(ts, 10, 64)
	if err != nil {
		t.Fatalf("timestamp is not an integer: %v", err)
	}
	if delta := time.Since(time.Unix(issued, 0)); delta < 0 || delta > time.Minute {
		t.Fatalf("timestamp is %v away from now", delta)
	}
}

func TestChallengeSeedIsFresh(t *testing.T) {
	p := newGate(t, 8, time.Minute)
	seen := make(map[string]bool, 16)
	for range 16 {
		rec := httptest.NewRecorder()
		if err := p.challenge(rec); err != nil {
			t.Fatalf("challenge: %v", err)
		}
		m := challengeParams.FindStringSubmatch(rec.Body.String())
		if m == nil {
			t.Fatal("challenge page did not carry the expected parameters")
		}
		if seen[m[1]] {
			t.Fatalf("seed %q was issued twice", m[1])
		}
		seen[m[1]] = true
	}
}

func countingNext(calls *int) caddyhttp.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) error {
		*calls++
		w.WriteHeader(http.StatusNoContent)
		return nil
	}
}

func TestServeHTTPPassesValidCookie(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	calls := 0

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: p.Cookie, Value: token(t, p, "deadbeef", time.Now())})
	rec := httptest.NewRecorder()

	if err := p.ServeHTTP(rec, req, countingNext(&calls)); err != nil {
		t.Fatalf("ServeHTTP: %v", err)
	}
	if calls != 1 {
		t.Fatalf("next called %d times, want 1", calls)
	}
	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}
}

func TestServeHTTPChallengesWithoutValidCookie(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	good := token(t, p, "deadbeef", time.Now())
	stale := token(t, p, "deadbeef", time.Now().Add(-time.Hour))
	tampered := strings.Join(append(strings.Split(good, ".")[:2], "0000", "1"), ".")

	cases := []struct {
		name   string
		cookie *http.Cookie
	}{
		{"no cookie", nil},
		{"empty value", &http.Cookie{Name: p.Cookie, Value: ""}},
		{"garbage value", &http.Cookie{Name: p.Cookie, Value: "not-a-token"}},
		{"tampered signature", &http.Cookie{Name: p.Cookie, Value: tampered}},
		{"expired token", &http.Cookie{Name: p.Cookie, Value: stale}},
		{"right value wrong name", &http.Cookie{Name: "other", Value: good}},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			calls := 0
			req := httptest.NewRequest(http.MethodGet, "/", nil)
			if c.cookie != nil {
				req.AddCookie(c.cookie)
			}
			rec := httptest.NewRecorder()

			if err := p.ServeHTTP(rec, req, countingNext(&calls)); err != nil {
				t.Fatalf("ServeHTTP: %v", err)
			}
			if calls != 0 {
				t.Fatalf("next called %d times, want 0", calls)
			}
			if rec.Code != http.StatusOK {
				t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
			}
			if rec.Header().Get("Content-Type") != "text/html; charset=utf-8" {
				t.Fatal("a challenge page was not served")
			}
			if challengeParams.FindStringSubmatch(rec.Body.String()) == nil {
				t.Fatal("challenge page did not carry the expected parameters")
			}
		})
	}
}

func TestServeHTTPRoundTrip(t *testing.T) {
	p := newGate(t, 12, time.Minute)
	calls := 0

	first := httptest.NewRecorder()
	if err := p.ServeHTTP(first, httptest.NewRequest(http.MethodGet, "/", nil), countingNext(&calls)); err != nil {
		t.Fatalf("ServeHTTP: %v", err)
	}
	m := challengeParams.FindStringSubmatch(first.Body.String())
	if m == nil {
		t.Fatal("challenge page did not carry the expected parameters")
	}
	seed, ts, sig := m[1], m[2], m[3]

	solved := strings.Join([]string{seed, ts, sig, mine(t, seed, p.Difficulty)}, ".")
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: p.Cookie, Value: solved})
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
}

func TestServeHTTPRejectsSolutionForAnotherSeed(t *testing.T) {
	p := newGate(t, 10, time.Minute)
	calls := 0

	rec := httptest.NewRecorder()
	if err := p.challenge(rec); err != nil {
		t.Fatalf("challenge: %v", err)
	}
	m := challengeParams.FindStringSubmatch(rec.Body.String())
	if m == nil {
		t.Fatal("challenge page did not carry the expected parameters")
	}

	other := "deadbeef"
	mixed := strings.Join([]string{m[1], m[2], m[3], mine(t, other, p.Difficulty)}, ".")
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: p.Cookie, Value: mixed})
	out := httptest.NewRecorder()

	if err := p.ServeHTTP(out, req, countingNext(&calls)); err != nil {
		t.Fatalf("ServeHTTP: %v", err)
	}
	if calls != 0 {
		t.Fatal("a nonce mined for a different seed was accepted")
	}
}

func TestProvisionDefaults(t *testing.T) {
	p := &PowGate{Secret: testSecret}
	if err := p.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	if p.Difficulty != 16 {
		t.Fatalf("difficulty = %d, want 16", p.Difficulty)
	}
	if time.Duration(p.TTL) != 30*time.Minute {
		t.Fatalf("ttl = %v, want 30m", time.Duration(p.TTL))
	}
	if p.Cookie != "__pow" {
		t.Fatalf("cookie = %q, want %q", p.Cookie, "__pow")
	}
	if string(p.secret) != testSecret {
		t.Fatal("the secret was not carried into the signing key")
	}
}

func TestProvisionRequiresSecret(t *testing.T) {
	p := &PowGate{}
	if err := p.Provision(caddy.Context{}); err == nil {
		t.Fatal("provision accepted an empty secret")
	}

	negative := &PowGate{Secret: testSecret, Difficulty: -1}
	if err := negative.Provision(caddy.Context{}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	if negative.Difficulty != 16 {
		t.Fatalf("difficulty = %d, want 16", negative.Difficulty)
	}
}

func TestUnmarshalCaddyfile(t *testing.T) {
	var p PowGate
	input := "powgate {\n\tsecret s3cret\n\tdifficulty 20\n\tttl 90s\n\tcookie __gate\n}\n"
	if err := p.UnmarshalCaddyfile(caddyfile.NewTestDispenser(input)); err != nil {
		t.Fatalf("UnmarshalCaddyfile: %v", err)
	}
	if p.Secret != "s3cret" {
		t.Fatalf("secret = %q, want %q", p.Secret, "s3cret")
	}
	if p.Difficulty != 20 {
		t.Fatalf("difficulty = %d, want 20", p.Difficulty)
	}
	if time.Duration(p.TTL) != 90*time.Second {
		t.Fatalf("ttl = %v, want 90s", time.Duration(p.TTL))
	}
	if p.Cookie != "__gate" {
		t.Fatalf("cookie = %q, want %q", p.Cookie, "__gate")
	}
}

func TestUnmarshalCaddyfileEmptyBlock(t *testing.T) {
	var p PowGate
	if err := p.UnmarshalCaddyfile(caddyfile.NewTestDispenser("powgate {\n}\n")); err != nil {
		t.Fatalf("UnmarshalCaddyfile: %v", err)
	}
	if p.Secret != "" || p.Difficulty != 0 || p.TTL != 0 || p.Cookie != "" {
		t.Fatalf("an empty block set fields: %+v", p)
	}
}

func TestUnmarshalCaddyfileErrors(t *testing.T) {
	cases := map[string]string{
		"unknown option":     "powgate {\n\tnonsense 1\n}\n",
		"secret missing arg": "powgate {\n\tsecret\n}\n",
		"difficulty missing": "powgate {\n\tdifficulty\n}\n",
		"ttl missing":        "powgate {\n\tttl\n}\n",
		"cookie missing":     "powgate {\n\tcookie\n}\n",
		"difficulty not int": "powgate {\n\tdifficulty hard\n}\n",
		"ttl not duration":   "powgate {\n\tttl soon\n}\n",
	}
	for name, input := range cases {
		t.Run(name, func(t *testing.T) {
			var p PowGate
			if err := p.UnmarshalCaddyfile(caddyfile.NewTestDispenser(input)); err == nil {
				t.Fatalf("UnmarshalCaddyfile(%q) = nil, want an error", input)
			}
		})
	}
}

func TestParseCaddyfile(t *testing.T) {
	h := httpcaddyfile.Helper{Dispenser: caddyfile.NewTestDispenser("powgate {\n\tsecret s3cret\n}\n")}
	handler, err := parseCaddyfile(h)
	if err != nil {
		t.Fatalf("parseCaddyfile: %v", err)
	}
	p, ok := handler.(*PowGate)
	if !ok {
		t.Fatalf("handler type = %T, want *PowGate", handler)
	}
	if p.Secret != "s3cret" {
		t.Fatalf("secret = %q, want %q", p.Secret, "s3cret")
	}

	bad := httpcaddyfile.Helper{Dispenser: caddyfile.NewTestDispenser("powgate {\n\tnonsense\n}\n")}
	if _, err := parseCaddyfile(bad); err == nil {
		t.Fatal("parseCaddyfile accepted an unknown option")
	}
}

func TestCaddyModule(t *testing.T) {
	info := PowGate{}.CaddyModule()
	if info.ID != "http.handlers.powgate" {
		t.Fatalf("module id = %q, want %q", info.ID, "http.handlers.powgate")
	}
	if _, ok := info.New().(*PowGate); !ok {
		t.Fatal("module constructor did not return a *PowGate")
	}
}
