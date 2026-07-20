FROM node:26-alpine AS webbuilder
ENV CI=true
WORKDIR /app
COPY . .
RUN npm install -g "pnpm@$(node -p "require('./package.json').packageManager.split('@')[1].split('+')[0]")"
RUN pnpm -C creepjs install --frozen-lockfile && pnpm -C creepjs build:js
RUN pnpm install --frozen-lockfile && pnpm build

FROM caddy:2-builder-alpine AS caddybuilder
COPY caddy/powgate /src/powgate
RUN xcaddy build \
	--with github.com/mholt/caddy-ratelimit \
	--with github.com/xsaveopt/fp-web/powgate=/src/powgate

FROM caddy:2-alpine
COPY --from=caddybuilder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=webbuilder /app/dist /srv
EXPOSE 8080
