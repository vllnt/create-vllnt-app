# create-app.vllnt.com — www Next.js standalone (pnpm workspace).
# syntax=docker/dockerfile:1.6

FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS builder
WORKDIR /src

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY www/package.json www/
COPY cli/package.json cli/
RUN pnpm install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://create-app.vllnt.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN pnpm --filter www build

FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS runtime
WORKDIR /app

RUN rm -rf \
  /usr/local/lib/node_modules \
  /opt/yarn-v1.22.22 \
  /usr/local/bin/npm \
  /usr/local/bin/npx \
  /usr/local/bin/corepack \
  /usr/local/bin/yarn \
  /usr/local/bin/yarnpkg

RUN addgroup -S -g 65532 app && adduser -S -u 65532 -G app app

COPY --from=builder --chown=65532:65532 /src/www/.next/standalone ./
COPY --from=builder --chown=65532:65532 /src/www/.next/static ./www/.next/static

USER 65532:65532
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD ["node", "www/server.js"]
