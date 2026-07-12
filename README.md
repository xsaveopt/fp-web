# fp-web

A single static page that shows a visitor their own browser fingerprint and nothing else.

## Contents

- [How it works](#how-it-works)
- [docker-compose](#docker-compose)
- [Image tags](#image-tags)
- [Development](#development)

## How it works

The page is a small Vue 3 app, written in TypeScript and bundled with Vite.
It loads [CreepJS](https://github.com/abrahamjuliot/creepjs), a browser fingerprinting engine, which lives as a git submodule at `creepjs/`.
CreepJS normally renders a large report of every metric it collects, but here that report is kept hidden.
Once it finishes, it exposes its hardened fingerprint on `window.Creep`, and the app hashes that object with SHA-256 and prints the single resulting hash to the visitor.
The hash is stable, so the same browser tends to see the same value across visits.

The built site is served by Caddy as static files, with no backend and no state.

## docker-compose

```yaml
services:
  fp-web:
    image: ghcr.io/xsaveopt/fp-web:latest
    container_name: fp-web
    restart: unless-stopped
    ports:
      - '8080:8080'
```

```bash
docker compose up -d
```

The site is then reachable at `http://localhost:8080`.

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

Tooling is Node 24 and pnpm 10, which [mise](https://mise.jdx.dev) will pin with `mise use node@24 pnpm@10`.
The CreepJS bundle has to be built once; Vite then imports it straight out of `creepjs/`, so there is no copy step.

```bash
pnpm install
pnpm -C creepjs install && pnpm -C creepjs build:js
pnpm dev
```

`pnpm build` type-checks and produces the static site in `dist/`.
The container build does all of this end to end, so a normal image build needs nothing beyond the submodule.

```bash
docker compose up --build
```
