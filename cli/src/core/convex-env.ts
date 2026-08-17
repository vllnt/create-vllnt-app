/**
 * Convex backend mode (cloud vs self-hosted) configuration generation.
 *
 * The scaffolded client code is identical for both modes — the only
 * differences are environment variables, an optional Docker stack for the
 * self-hosted backend, and docs. These pure builders produce that content;
 * file writing lives in scaffold.ts.
 */

/** Supported Convex deployment modes. */
export const CONVEX_MODES = ['cloud', 'self-hosted'] as const

/** A Convex deployment mode. */
export type ConvexMode = (typeof CONVEX_MODES)[number]

/** Public (client-exposed) env var that holds the Convex URL. */
export type PublicConvexVar = 'NEXT_PUBLIC_CONVEX_URL' | 'EXPO_PUBLIC_CONVEX_URL'

/** Local self-hosted backend API origin (Convex default sync port). */
const SELF_HOSTED_URL = 'http://127.0.0.1:3210'

/**
 * Type guard narrowing an arbitrary string to a {@link ConvexMode}.
 *
 * @param value - Raw flag value to validate.
 * @returns `true` when `value` is a supported mode.
 */
export function isConvexMode(value: string): value is ConvexMode {
  return (CONVEX_MODES as readonly string[]).includes(value)
}

/** Options describing one `.env.example` Convex block. */
export interface ConvexEnvOptions {
  /** Deployment mode the block targets. */
  mode: ConvexMode
  /** Client URL var to emit, or `null` for a backend-only env file. */
  publicVar: PublicConvexVar | null
  /** Emit deploy credentials (deploy key / self-hosted admin key). */
  includeDeploy: boolean
}

/**
 * Build the Convex section of an `.env.example` file for a given mode.
 *
 * @param options - Mode, client var, and whether to emit deploy credentials.
 * @returns Newline-joined env block (no trailing newline).
 * @example
 * convexEnvBlock({ mode: 'cloud', publicVar: 'NEXT_PUBLIC_CONVEX_URL', includeDeploy: true })
 */
export function convexEnvBlock(options: ConvexEnvOptions): string {
  const { mode, publicVar, includeDeploy } = options
  const lines: string[] = []

  if (mode === 'cloud') {
    lines.push('# Convex — managed cloud (https://convex.dev)')
    lines.push('# Run `npx convex dev` once to provision a deployment; it fills the URL below.')
    if (publicVar) lines.push(`${publicVar}=`)
    if (includeDeploy) {
      lines.push('# CI/CD deploys only — create at dashboard.convex.dev > Settings > Deploy Keys:')
      lines.push('# CONVEX_DEPLOY_KEY=')
    }
  } else {
    lines.push('# Convex — self-hosted (https://github.com/get-convex/convex-backend)')
    lines.push('# See docs/self-hosting.md. Start the backend: `docker compose up -d`,')
    lines.push('# generate a key: `docker compose exec backend ./generate_admin_key.sh`,')
    lines.push('# then push functions: `npx convex deploy` (NOT `convex dev` — see docs).')
    if (publicVar) lines.push(`${publicVar}=${SELF_HOSTED_URL}`)
    if (includeDeploy) {
      lines.push(`CONVEX_SELF_HOSTED_URL=${SELF_HOSTED_URL}`)
      lines.push('CONVEX_SELF_HOSTED_ADMIN_KEY=')
    }
  }

  return lines.join('\n')
}

/**
 * Build a `docker-compose.yml` running a self-hosted Convex backend +
 * dashboard locally (SQLite). Trimmed from the upstream compose for local
 * development; production (S3/Postgres/MySQL) config lives upstream.
 *
 * Source: https://github.com/get-convex/convex-backend/tree/main/self-hosted
 *
 * @returns Full compose file content.
 */
export function convexComposeYml(): string {
  return `# Self-hosted Convex backend + dashboard (local SQLite).
# Trimmed from upstream for local development. For S3/Postgres/MySQL and
# production config, see the upstream compose and docs/self-hosting.md.
# Source: https://github.com/get-convex/convex-backend/tree/main/self-hosted
services:
  backend:
    # Pin a version by setting CONVEX_BACKEND_REV in a .env beside this file.
    image: ghcr.io/get-convex/convex-backend:\${CONVEX_BACKEND_REV:-latest}
    stop_grace_period: 10s
    stop_signal: SIGINT
    ports:
      - "\${CONVEX_PORT:-3210}:3210"
      - "\${CONVEX_SITE_PROXY_PORT:-3211}:3211"
    volumes:
      - convex_data:/convex/data
    environment:
      - CONVEX_CLOUD_ORIGIN=\${CONVEX_CLOUD_ORIGIN:-http://127.0.0.1:\${CONVEX_PORT:-3210}}
      - CONVEX_SITE_ORIGIN=\${CONVEX_SITE_ORIGIN:-http://127.0.0.1:\${CONVEX_SITE_PROXY_PORT:-3211}}
      - DISABLE_BEACON=\${DISABLE_BEACON:-true}
      - RUST_LOG=\${RUST_LOG:-info}
    healthcheck:
      test: curl -f http://localhost:3210/version
      interval: 5s
      start_period: 10s

  dashboard:
    image: ghcr.io/get-convex/convex-dashboard:\${CONVEX_DASHBOARD_REV:-latest}
    stop_grace_period: 10s
    stop_signal: SIGINT
    ports:
      - "\${CONVEX_DASHBOARD_PORT:-6791}:6791"
    environment:
      - NEXT_PUBLIC_DEPLOYMENT_URL=\${NEXT_PUBLIC_DEPLOYMENT_URL:-http://127.0.0.1:\${CONVEX_PORT:-3210}}
    depends_on:
      backend:
        condition: service_healthy

volumes:
  convex_data:
`
}

/** Options for {@link selfHostingDoc}. */
export interface SelfHostingDocOptions {
  /** Client URL var the frontend reads. */
  publicVar: PublicConvexVar
  /** Directory the Convex CLI runs from (`.` or `packages/backend`). */
  backendDir: string
}

/**
 * Build `docs/self-hosting.md` explaining the self-hosted Convex workflow.
 *
 * @param options - Client var and Convex CLI working directory.
 * @returns Markdown document content.
 */
export function selfHostingDoc(options: SelfHostingDocOptions): string {
  const { publicVar, backendDir } = options
  const cd = backendDir === '.' ? '' : `cd ${backendDir}\n`
  const envFile = backendDir === '.' ? '.env.local' : `${backendDir}/.env.local`
  const appEnvNote =
    backendDir === '.'
      ? `Set \`${publicVar}\` in \`.env.local\` to \`${SELF_HOSTED_URL}\`.`
      : `Set \`${publicVar}\` in each app's \`.env.local\` (e.g. \`apps/web/.env.local\`) to \`${SELF_HOSTED_URL}\`.`

  return `# Self-hosting Convex

This project is configured for a **self-hosted** Convex backend. The client code
is identical to cloud Convex — only the environment variables and where the
backend runs differ. You can switch to managed cloud at any time (see the end).

Reference: <https://github.com/get-convex/convex-backend/tree/main/self-hosted>

## Prerequisites

- Docker + Docker Compose

## 1. Start the backend

\`\`\`bash
docker compose up -d
\`\`\`

This runs two services from \`docker-compose.yml\`:

| Service   | URL                     | Purpose                       |
| --------- | ----------------------- | ----------------------------- |
| backend   | ${SELF_HOSTED_URL}      | Sync/API (HTTP actions :3211) |
| dashboard | http://127.0.0.1:6791   | Admin dashboard               |

Pin the image version by setting \`CONVEX_BACKEND_REV\` in a \`.env\` file next to
\`docker-compose.yml\` (defaults to \`latest\`).

## 2. Generate an admin key

\`\`\`bash
docker compose exec backend ./generate_admin_key.sh
\`\`\`

Copy the printed key into \`${envFile}\`:

\`\`\`bash
CONVEX_SELF_HOSTED_URL=${SELF_HOSTED_URL}
CONVEX_SELF_HOSTED_ADMIN_KEY=<paste-key-here>
\`\`\`

The Convex CLI auto-detects self-hosted mode from these two variables.

## 3. Push functions

\`\`\`bash
${cd}npx convex deploy
\`\`\`

This deploys your functions (and schema/indexes) to the self-hosted backend.

> **Important:** use \`convex deploy\`, NOT \`convex dev\`, for self-hosted. Running
> \`convex dev\` provisions a separate **anonymous local** deployment and ignores
> \`CONVEX_SELF_HOSTED_URL\`/\`CONVEX_SELF_HOSTED_ADMIN_KEY\`. Re-run \`convex deploy\`
> after changing functions.

## 4. Point the frontend at the backend

${appEnvNote}

## Switching to managed cloud later

1. Remove \`CONVEX_SELF_HOSTED_URL\` and \`CONVEX_SELF_HOSTED_ADMIN_KEY\`.
2. Run \`npx convex dev\` and log in; it provisions a cloud deployment and writes
   \`${publicVar}\`.
3. \`docker compose down\` to stop the local backend (optional).
`
}
