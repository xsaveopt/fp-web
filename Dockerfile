FROM node:26-alpine AS builder
ENV CI=true
RUN npm install -g pnpm@10
WORKDIR /app
COPY . .
RUN pnpm -C creepjs install --frozen-lockfile && pnpm -C creepjs build:js
RUN pnpm install --frozen-lockfile && pnpm build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv
EXPOSE 8080
