# Conventions

## Package Naming

All internal packages use `@repo/` scope:
- `@repo/backend` — Convex functions
- `@repo/client` — Universal hooks
- `@repo/theme` — Design tokens
- `@repo/shared` — Shared utilities

## Import Rules

| From | Can Import |
|------|-----------|
| `apps/web` | `@repo/client`, `@repo/theme`, `@repo/shared` |
| `apps/mobile` | `@repo/client`, `@repo/theme`, `@repo/shared` |
| `@repo/client` | `@repo/backend`, `@repo/shared` |
| `@repo/backend` | `@repo/shared` |
| `@repo/theme` | `@repo/shared` |
| Any app | NEVER another app |

## File Conventions

- App features: `apps/{web,mobile}/features/{name}/`
- Shared hooks: `packages/client/src/hooks/use-{name}.ts`
- Convex domains: `packages/backend/convex/{domain}/`
- Design tokens: `packages/theme/src/tokens.ts`

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Scope by package: `feat(backend): add billing domain`
- Feature branches: `feature/{name}`, `fix/{name}`
