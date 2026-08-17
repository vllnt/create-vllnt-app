# create-vllnt-app

> Agent-first CLI scaffolder. One command to production-ready Next.js, Expo, or fullstack monorepo projects with Convex backend.

## Project Overview

- **Tech Stack:** Next.js 16, Expo 55, Convex, TypeScript strict, Tailwind CSS v4, Vitest, Playwright
- **Package Manager:** pnpm
- **License:** MIT
- **Monorepo:** pnpm workspaces (cli/, www/, packages/)

## File Structure

```
create-vllnt-app/
├── cli/                    # CLI package (create-vllnt-app)
│   ├── src/                # CLI source code
│   ├── templates/          # Project templates
│   │   ├── base/web/       # Base web skeleton (no backend)
│   │   ├── web/            # Web with Convex backend
│   │   ├── mobile/         # Expo mobile template
│   │   ├── fullstack/      # Full monorepo template
│   │   └── sections/       # Composable sections (landing, blog, dashboard, auth, docs, admin)
│   └── tests/              # CLI tests (vitest)
├── www/                    # Landing page (create-vllnt-app.vllnt.com)
│   ├── app/                # Next.js App Router
│   └── i18n/               # Internationalization
├── .github/
│   └── workflows/
│       ├── ci.yml          # PR quality gates (audit + lint + typecheck + unit + e2e + www build)
│       └── publish.yml     # Release pipeline (canary on push, release on dispatch)
└── package.json            # Workspace root
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm run lint` | Run linter (eslint + @vllnt/eslint-config) |
| `pnpm run build` | Build all packages |
| `pnpm test` | Run tests (vitest) |
| `pnpm --filter cli dev` | Dev CLI |
| `pnpm --filter www dev` | Dev landing page |

## Code Style

**Naming:**
- Functions/variables: `camelCase`
- Types/interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`

**Conventions:**
- TypeScript strict mode — no `any`, no `@ts-ignore`
- ESM modules (`import`/`export`, no `require`)
- Explicit return types on exported functions
- `const` objects over enums
- Zod schemas at boundaries
- @vllnt/eslint-config: every rule is an error, no warnings

## Architecture

### CLI (cli/)

Init-time assembly — sections are composed at scaffold time, not merged post-hoc.

- `vllnt new` assembles base skeleton + selected sections from `templates/sections/`
- Presets map goals to sections (e.g., `saas` = landing + dashboard + auth)
- `vllnt doctor` runs health checks with `--json` for machine-readable output
- `vllnt.json` is the section registry (source of truth for what's installed)
- Each section has `section.json` with metadata, deps, providers, and rules

### WWW (www/)

Next.js 16 landing page at create-vllnt-app.vllnt.com.

- App Router with next-intl for i18n
- @vllnt/ui component library
- File-based OG images (opengraph-image.tsx, twitter-image.tsx)
- Dynamic sitemap.ts and robots.ts

## Git Workflow

- Branch from `main`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`
- PRs require CI passing before merge
- Squash merge to main

## Boundaries

**Always:**
- Run tests before committing
- Follow existing code patterns
- Update docs for behavior changes

**Ask first:**
- Adding new dependencies
- Changing public API surface
- Modifying CI/CD workflows

**Never:**
- Commit secrets, tokens, or API keys
- Modify `node_modules/` or lock files manually
- Disable TypeScript strict checks
- Push directly to `main`

## Community

- [Website](https://bntvllnt.com) — about the maintainer and projects
- [Discord](https://bntvllnt.com/discord) — questions, discussion, support
- [GitHub](https://bntvllnt.com/github) — issues, PRs, code
- [X / Twitter](https://bntvllnt.com/x) — updates, DMs for security
- [LinkedIn](https://bntvllnt.com/linkedin) — professional inquiries
- [Book a meeting](https://bntvllnt.com/book) — consultation, collaboration, or anything
