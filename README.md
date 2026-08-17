# create-vllnt-app

Ship production apps 10x faster with AI agents. One command. Strict guardrails. Your agent codes from line one.

## Quick Start

```bash
npx create-vllnt-app
```

## Presets

Pick what you're building. Get a production-ready project in seconds.

| Preset | What you get | Command |
|--------|-------------|---------|
| **SaaS** | Landing + dashboard + auth + Convex | `npx create-vllnt-app --preset saas` |
| **Landing Page** | Marketing page, no backend | `npx create-vllnt-app --preset landing` |
| **Blog** | MDX-powered content site | `npx create-vllnt-app --preset blog` |
| **Marketing Site** | Landing + blog | `npx create-vllnt-app --preset marketing` |
| **Full SaaS** | Landing + dashboard + auth + blog + docs | `npx create-vllnt-app --preset full-saas` |
| **Dashboard** | Dashboard + auth + Convex | `npx create-vllnt-app --preset dashboard` |
| **Internal Tool** | Dashboard + admin + auth + Convex | `npx create-vllnt-app --preset internal` |
| **Docs Site** | Documentation, no backend | `npx create-vllnt-app --preset docs` |
| **Custom** | Pick sections manually | Interactive prompt |

## Convex: Cloud or Self-Hosted

Backend projects pick a Convex mode (`--convex cloud` or `--convex self-hosted`, or via prompt):

- **Cloud** — managed [convex.dev](https://convex.dev), zero infra. Run `npx convex dev`.
- **Self-hosted** — ships a `docker-compose.yml` (backend + dashboard) and `docs/self-hosting.md`. Run `docker compose up -d`.

The app code is identical; only env vars and where the backend runs differ. See [docs/cli.md](docs/cli.md#convex-backend-modes).

## Your Agent is Productive From Line One

Every project ships with machine-readable contracts your AI agent reads immediately:

- **CLAUDE.md** — strict blocking rules, stack info, conventions
- **AGENTS.md** — architecture, extension points, common tasks
- **vllnt.json** — active sections, preset, backend status

```
You run one command → project scaffolded in seconds
Your agent reads CLAUDE.md → understands every rule
Your agent codes → guardrails catch mistakes instantly
You ship → lint, types, and build all pass
```

## Your Agent Can't Break Things

Strict rules baked into every project:

- **@vllnt/eslint-config** — every rule is an error, no warnings to ignore
- **TypeScript strict** — no `any`, no `@ts-ignore`, type guards at boundaries
- **Convex validators** — bounded reads, indexed queries, dual validators
- **Zero-Error Guarantee** — every scaffold passes `lint + typecheck + build` out of the box

## Health Check

```bash
vllnt doctor              # Full project health check
vllnt doctor --for blog   # Section-specific preflight
vllnt doctor --json       # Structured output for agents
```

Your agent reads the structured output and fixes issues automatically. Every check includes a machine-readable fix command.

## CLI Options

```bash
npx create-vllnt-app [name] [options]

Options:
  -p, --preset <preset>      saas | landing | blog | marketing | full-saas |
                              dashboard | internal | docs
  --sections <sections>      Comma-separated sections for custom preset
  --skip-backend             Skip Convex backend setup
  --convex <mode>            Convex backend mode: cloud | self-hosted
  -y, --yes                  Skip prompts, use defaults
  --agent                    Machine-readable JSON output (implies --yes)
  --package-manager <pm>     npm | pnpm | yarn | bun
  --skip-install             Skip dependency installation
```

## Stack

- **Next.js 16** — App Router, Server Components, Turbopack
- **Convex** — real-time backend (optional)
- **Tailwind CSS v4** — utility-first styling
- **@vllnt/ui** — 93 components built on Radix + Tailwind
- **TypeScript** — strict mode
- **Vitest + Playwright** — unit + E2E testing

## Works With Every AI Coding Agent

Claude Code, Codex, Cursor, Windsurf, Gemini CLI — your agent reads the same contracts and follows the same rules.

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
