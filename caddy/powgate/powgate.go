package powgate

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"math/bits"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

func init() {
	caddy.RegisterModule(PowGate{})
	httpcaddyfile.RegisterHandlerDirective("powgate", parseCaddyfile)
}

type PowGate struct {
	Secret     string         `json:"secret,omitempty"`
	Difficulty int            `json:"difficulty,omitempty"`
	TTL        caddy.Duration `json:"ttl,omitempty"`
	Cookie     string         `json:"cookie,omitempty"`

	secret []byte
}

func (PowGate) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.powgate",
		New: func() caddy.Module { return new(PowGate) },
	}
}

func (p *PowGate) Provision(caddy.Context) error {
	if p.Secret == "" {
		return fmt.Errorf("powgate: secret is required")
	}
	if p.Difficulty <= 0 {
		p.Difficulty = 16
	}
	if p.TTL == 0 {
		p.TTL = caddy.Duration(30 * time.Minute)
	}
	if p.Cookie == "" {
		p.Cookie = "__pow"
	}
	p.secret = []byte(p.Secret)
	return nil
}

func (p *PowGate) sign(seed, ts string) string {
	m := hmac.New(sha256.New, p.secret)
	m.Write([]byte(seed + "." + ts))
	return hex.EncodeToString(m.Sum(nil))
}

func leadingZeroBits(b []byte) int {
	n := 0
	for _, c := range b {
		if c == 0 {
			n += 8
			continue
		}
		n += bits.LeadingZeros8(c)
		break
	}
	return n
}

func (p *PowGate) valid(v string) bool {
	parts := strings.Split(v, ".")
	if len(parts) != 4 {
		return false
	}
	seed, ts, sig, nonce := parts[0], parts[1], parts[2], parts[3]
	want := p.sign(seed, ts)
	if subtle.ConstantTimeCompare([]byte(sig), []byte(want)) != 1 {
		return false
	}
	sec, err := strconv.ParseInt(ts, 10, 64)
	if err != nil {
		return false
	}
	if time.Since(time.Unix(sec, 0)) > time.Duration(p.TTL) {
		return false
	}
	h := sha256.Sum256([]byte(seed + nonce))
	return leadingZeroBits(h[:]) >= p.Difficulty
}

func (p *PowGate) challenge(w http.ResponseWriter) error {
	raw := make([]byte, 16)
	if _, err := rand.Read(raw); err != nil {
		return err
	}
	seed := hex.EncodeToString(raw)
	ts := strconv.FormatInt(time.Now().Unix(), 10)
	sig := p.sign(seed, ts)
	maxAge := int(time.Duration(p.TTL).Seconds())

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(http.StatusOK)
	_, err := fmt.Fprintf(w, challengeTmpl, seed, ts, sig, p.Difficulty, p.Cookie, maxAge)
	return err
}

func (p *PowGate) ServeHTTP(w http.ResponseWriter, r *http.Request, next caddyhttp.Handler) error {
	if c, err := r.Cookie(p.Cookie); err == nil && p.valid(c.Value) {
		return next.ServeHTTP(w, r)
	}
	return p.challenge(w)
}

func (p *PowGate) UnmarshalCaddyfile(d *caddyfile.Dispenser) error {
	for d.Next() {
		for d.NextBlock(0) {
			switch d.Val() {
			case "secret":
				if !d.NextArg() {
					return d.ArgErr()
				}
				p.Secret = d.Val()
			case "difficulty":
				if !d.NextArg() {
					return d.ArgErr()
				}
				n, err := strconv.Atoi(d.Val())
				if err != nil {
					return d.Errf("invalid difficulty %q: %v", d.Val(), err)
				}
				p.Difficulty = n
			case "ttl":
				if !d.NextArg() {
					return d.ArgErr()
				}
				dur, err := caddy.ParseDuration(d.Val())
				if err != nil {
					return d.Errf("invalid ttl %q: %v", d.Val(), err)
				}
				p.TTL = caddy.Duration(dur)
			case "cookie":
				if !d.NextArg() {
					return d.ArgErr()
				}
				p.Cookie = d.Val()
			default:
				return d.Errf("unknown powgate option %q", d.Val())
			}
		}
	}
	return nil
}

func parseCaddyfile(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
	var p PowGate
	err := p.UnmarshalCaddyfile(h.Dispenser)
	return &p, err
}

const challengeTmpl = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>·</title></head><body><script>
(async()=>{
const seed=%q,ts=%q,sig=%q,diff=%d,ck=%q,age=%d;
const enc=new TextEncoder();
async function h(s){return new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)));}
function lz(a){let n=0;for(let i=0;i<a.length;i++){let b=a[i];if(b===0){n+=8;continue;}let c=0;while((b&0x80)===0){c++;b=(b<<1)&0xff;}n+=c;break;}return n;}
let x=0;for(;;){if(lz(await h(seed+x))>=diff)break;x++;}
document.cookie=ck+'='+seed+'.'+ts+'.'+sig+'.'+x+';path=/;max-age='+age+';samesite=strict';
location.reload();
})();
</script></body></html>`

var (
	_ caddy.Provisioner           = (*PowGate)(nil)
	_ caddyhttp.MiddlewareHandler = (*PowGate)(nil)
	_ caddyfile.Unmarshaler       = (*PowGate)(nil)
)
