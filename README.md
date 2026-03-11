# create-vllnt-app

Agent-first CLI that scaffolds production-grade **Next.js**, **Expo**, or **fullstack monorepo** projects with **Convex** backend. AI agent contracts (CLAUDE.md, .cursorrules, .windsurfrules, AGENTS.md, docs/) included out of the box.

## Quick Start

```bash
npx create-vllnt-app
```

## Templates

| Template | Stack | Command |
|----------|-------|---------|
| **Web** | Next.js 15 + Convex + Tailwind v4 + next-intl | `npx create-vllnt-app --template web` |
| **Mobile** | Expo 55 + Convex + React Native + i18next | `npx create-vllnt-app --template mobile` |
| **Fullstack** | Turborepo + Next.js + Expo + Convex | `npx create-vllnt-app --template fullstack` |

## What You Get

Every scaffolded project includes:

- **Feature-sliced architecture** — `features/` for vertical slices, `components/` for shared UI
- **Convex backend** — domain-folder structure with dual validators, indexed queries, bounded reads
- **Agent contracts** — CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules
- **Documentation** — 6 docs files (architecture, conventions, testing, i18n, theming, extending)
- **Testing setup** — Vitest/Jest (unit) + Playwright/Maestro (E2E)
- **i18n** — next-intl (web) or i18next (mobile), pre-configured

## CLI Options

```bash
npx create-vllnt-app [name] [options]

Options:
  -t, --template <template>    web | mobile | fullstack
  -y, --yes                    Skip prompts, use defaults
  --agent                      Machine-readable JSON output
  --package-manager <pm>       npm | pnpm | yarn | bun
  --skip-install               Skip dependency installation
```

## Code Generators (Coming Soon)

```bash
vllnt generate page <name>        # New page with layout + metadata
vllnt generate screen <name>      # New Expo Router screen
vllnt generate feature <name>     # Feature slice
vllnt generate component <name>   # Shared UI component
vllnt generate hook <name>        # Custom hook
vllnt generate domain <name>      # Convex domain (schemas + queries + mutations)
```

## Feature Adders (Coming Soon)

```bash
vllnt add auth        # BetterAuth + Convex
vllnt add payments    # Stripe + Convex
vllnt add analytics   # Analytics integration
```

## Development

```bash
pnpm install
pnpm build            # Build CLI
pnpm test             # Run E2E tests (35 tests)
```

## License

MIT
