package powgate

import (
	"net/http"
	"os"
	"regexp"
	"strings"
	"testing"
)

var healthcheckCmd = regexp.MustCompile(`(?m)^\s*CMD \["curl", "-fsS", "http://127\.0\.0\.1:(\d+)(/[^"]*)"\]\s*$`)

func TestDockerHealthcheckTargetsHealthRoute(t *testing.T) {
	raw, err := os.ReadFile("../../Dockerfile")
	if err != nil {
		t.Fatalf("read Dockerfile: %v", err)
	}
	m := healthcheckCmd.FindStringSubmatch(string(raw))
	if m == nil {
		t.Fatal("Dockerfile has no curl HEALTHCHECK against the loopback address")
	}
	if !strings.Contains(string(raw), "EXPOSE "+m[1]+"\n") {
		t.Fatalf("HEALTHCHECK port %s is not the exposed port", m[1])
	}
	caddyfile, err := os.ReadFile("../../Caddyfile")
	if err != nil {
		t.Fatalf("read Caddyfile: %v", err)
	}
	if !strings.Contains(string(caddyfile), "\n:"+m[1]+" {\n") {
		t.Fatalf("HEALTHCHECK port %s is not the Caddyfile listen port", m[1])
	}
	if m[2] != "/health" {
		t.Fatalf("HEALTHCHECK path = %q, want /health", m[2])
	}
}

func TestCaddyfileHealthAnswersCurl(t *testing.T) {
	s := startSite(t, siteSecret)

	r := s.do(t, http.MethodGet, "/health", map[string]string{
		"User-Agent": "curl/8.14.1",
		"Accept":     "*/*",
	})
	expectStatus(t, r, http.StatusOK)
	if r.body != "up" {
		t.Fatalf("body = %q, want up", r.body)
	}

	for i := range siteEvents + 5 {
		r := s.do(t, http.MethodGet, "/health", map[string]string{"User-Agent": "curl/8.14.1"})
		if r.status != http.StatusOK {
			t.Fatalf("health probe %d got status %d, a busy healthcheck must not be limited", i, r.status)
		}
	}
}
