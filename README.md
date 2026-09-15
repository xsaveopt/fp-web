# fp-web

A single static page that shows a visitor their own browser fingerprint.
Under the hood it is a small Vue 3 app written in TypeScript and bundled with Vite, which runs [CreepJS](https://github.com/abrahamjuliot/creepjs) from the git submodule at creepjs/ and keeps its usual report hidden.
When CreepJS publishes its fingerprint on window.Creep, the app captures that object, hashes it with SHA-256 and prints the hash.
The build obfuscates the code and inlines everything into one index.html, which Caddy serves as static files.

## Keeping non-browsers out

Caddy puts a few layers in front of the page so the code only reaches clients that behave like a real browser.
The first one reads the request headers and drops the connection when Sec-Fetch-Mode, Accept-Language or Accept-Encoding is missing, when the User-Agent lacks Mozilla/5.0, or when it names a known http library, headless browser or crawler.
Requests that get through meet a per-address rate limit and then a proof of work gate, which answers any client holding no valid cookie with a tiny page that solves a SHA-256 puzzle in JavaScript, stores the answer in a cookie and reloads.
That cookie is signed with POW_SECRET and carries its own timestamp, so Caddy verifies it from the cookie alone.
Paths that only scanners ask for, such as /.env, /.git and /wp-, also drop the connection, and since every request is logged to stdout as JSON a ban tool like fail2ban can act on them.

## Running it

The docker-compose.yml in the repo runs the published image with every variable listed, and POW_SECRET is the value to replace.
Caddy serves plain HTTP on port 8080 and trusts forwarded-for headers from private network ranges, so behind a reverse proxy on the same Docker network the rate limit counts the real visitor.

```sh
docker compose up -d
```

Images for linux/amd64 are published to ghcr.io/xsaveopt/fp-web.
The latest tag follows the newest stable release, tags like 1, 1.2 and 1.2.3 pin a version line, pre-releases such as 1.2.3-rc1 leave latest alone, and dev is rebuilt from every commit on main.

| Variable       | What it does                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POW_SECRET     | Signs the proof of work cookies. Caddy refuses to start while it is empty.                                                                                        |
| POW_DIFFICULTY | Leading zero bits the puzzle hash has to reach. Each extra bit doubles the work a visitor does.                                                                   |
| POW_TTL        | How long a solved cookie stays valid before the visitor solves another puzzle.                                                                                    |
| RL_EVENTS      | Requests one address may make within the rate limit window.                                                                                                       |
| RL_WINDOW      | Length of the rate limit window.                                                                                                                                  |
| ALLOWED_DOMAIN | Host the page is meant to run on. When set, the page blanks itself on any other host apart from its subdomains, localhost and 127.0.0.1. Empty allows every host. |

## Development

CreepJS lives in a submodule, and mise.toml pins Node 26, pnpm 11 and hadolint.
The CreepJS bundle gets built once inside the submodule, and Vite reads it from creepjs/docs/creep.js from then on.

```sh
git submodule update --init
pnpm install
pnpm -C creepjs install --ignore-workspace
pnpm -C creepjs build:js
pnpm dev
```

Running pnpm build type-checks and writes the site to dist/, while pnpm lint and pnpm format:check cover the rest of what CI checks.
The Dockerfile builds the site too, then compiles Caddy with xcaddy to add caddy-ratelimit and the proof of work handler from caddy/powgate, so a local image comes straight from a checkout with the submodule in place.

```sh
docker build -t fp-web .
```

## License

fp-web is released under the GPL-2.0 license in LICENSE, and the bundled CreepJS keeps its MIT license as described in NOTICE.
