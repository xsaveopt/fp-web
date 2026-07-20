# fp-web

A single static page that shows a visitor their own browser fingerprint and nothing else.

## Contents

- [How it works](#how-it-works)
- [Keeping non-browsers out](#keeping-non-browsers-out)
- [docker-compose](#docker-compose)
- [Configuration](#configuration)
- [Image tags](#image-tags)
- [Development](#development)

## How it works

The page is a small Vue 3 app, written in TypeScript and bundled with Vite.
It loads [CreepJS](https://github.com/abrahamjuliot/creepjs), a browser fingerprinting engine, which lives as a git submodule at `creepjs/`.
CreepJS normally renders a large report of every metric it collects, but here that report is kept hidden.
Once it finishes, it exposes its hardened fingerprint on `window.Creep`, and the app hashes that object with SHA-256 and prints the single resulting hash to the visitor.
The hash is stable, so the same browser tends to see the same value across visits.

The built site is served by Caddy as static files, with no backend and no state.
The app itself is heavily obfuscated at build time, and Caddy in front of it works to keep the code out of the hands of anything that is not a real browser.

## Keeping non-browsers out

The whole point of the page is the fingerprint, so the code that computes it is worth protecting from casual inspection, and a plain static server hands its files to anyone who asks, curl and scrapers included.
Caddy is configured as a stack of layers that a request has to pass through before it ever sees the site, each one catching a different class of client.

The cheapest layer looks at the request headers a real browser always sends and a command line tool almost never does, the Sec-Fetch set, an Accept-Language, an Accept-Encoding, and a believable browser User-Agent, and it drops the connection outright when any of them is missing or when the User-Agent names a known tool or automation framework.
This costs nothing and catches the lazy majority, a plain curl or wget or a scraping library used with its defaults, though a client that bothers to forge all of those headers walks straight through it.

The layer that does the real work is a proof of work gate.
A client with no valid token is handed a tiny page whose only job is to solve a small SHA-256 puzzle in JavaScript, set a signed cookie with the answer, and reload, and only then does Caddy serve the actual site.
Anything that cannot run JavaScript, which is every scraper built on curl, wget, requests, or the like, never gets past that page and never receives a single byte of the application.
The cookie is signed with a server secret and carries its own expiry, so it cannot be forged and does not need any server side storage to check.

Two more layers guard against volume rather than inspection.
A per-address rate limit slows anything that hammers the site, and a set of honeypot paths, the sort of URLs only a scanner would ever request, drop the connection and show up in the logs so they can feed a ban tool such as fail2ban.
None of this is a guarantee, since anything a browser can load a determined person can eventually reproduce, but together the layers turn a one line curl into real work and stop the ordinary scraper cold.

## docker-compose

Caddy serves the site as plain HTTP on port 8080 and does not touch TLS, so put it behind whatever already terminates HTTPS for you, a reverse proxy, a tunnel, or your load balancer.
The rate limit counts the real visitor rather than your proxy, because the container trusts the standard forwarded-for header from private network ranges, which is where a proxy sharing its Docker network sits.

```yaml
services:
  fp-web:
    image: ghcr.io/xsaveopt/fp-web:latest
    container_name: fp-web
    restart: unless-stopped
    environment:
      POW_SECRET: "change-me-to-a-long-random-string"
    ports:
      - "8080:8080"
    read_only: true
    tmpfs:
      - /config
      - /data
```

```bash
docker compose up -d
```

The one thing you have to set is POW_SECRET, and everything else has a working default.

## Configuration

Everything is tuned through environment variables, and POW_SECRET is the only one that really needs your attention, since it signs the proof of work cookies and the security of the gate rests on nobody else knowing it.
The rest shape how aggressive the layers are and can be left alone until you have a reason to change them.

| Variable       | Default           | What it does                                                                                                             |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| POW_SECRET     | none, must be set | Secret that signs the proof of work cookies. Use a long random string that only you know.                                |
| POW_DIFFICULTY | 16                | Leading zero bits the puzzle demands. A browser clears sixteen in about a second; raise it to make the gate bite harder. |
| POW_TTL        | 30m               | How long a solved cookie stays valid before a visitor has to solve another.                                              |
| RL_EVENTS      | 120               | Requests allowed per address within the window before the rate limit kicks in.                                           |
| RL_WINDOW      | 1m                | Length of the rate limit window.                                                                                         |
| ALLOWED_DOMAIN | empty, any host   | Unrelated to the gate. Names the host the page is licensed to run on, left empty to allow any.                           |

## Image tags

`latest` tracks the most recent stable release.
`1`, `1.2`, and `1.2.3` pin to a major, minor, or patch line, and pre-releases such as `1.2.3-rc1` are never tagged `latest`.
`dev` tracks the tip of `main` and is rebuilt on every commit.
Images are published to `ghcr.io/xsaveopt/fp-web` for `linux/amd64`.

## Development

CreepJS lives in a submodule, so clone with it or initialise it after cloning.

```bash
git submodule update --init
```

Tooling is Node 26 and pnpm 11, which [mise](https://mise.jdx.dev) will pin with `mise use node@26 pnpm@11`.
The CreepJS bundle has to be built once; Vite then imports it straight out of `creepjs/`, so there is no copy step.

```bash
pnpm install
pnpm -C creepjs install && pnpm -C creepjs build:js
pnpm dev
```

`pnpm build` type-checks and produces the static site in `dist/`.

The image is more than the static files, because Caddy has to carry the rate limit and proof of work layers, neither of which ships with it by default.
The Dockerfile builds a custom Caddy with xcaddy, pulling in the rate limit module and the small proof of work handler that lives in this repo under caddy/powgate, and only then copies the built site in beside it.
That all happens inside the container build, so bringing the whole thing up still needs nothing beyond the submodule.

```bash
docker compose up --build
```
