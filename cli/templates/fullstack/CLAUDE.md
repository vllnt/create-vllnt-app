# {{projectName}} — Agent Rules (Monorepo)

## BLOCKING Rules (Enforce Always)

These rules are NON-NEGOTIABLE. Violating any BLOCKING rule requires immediate fix before proceeding.

1. **No `any` type** — use `unknown` + type guards. No `@ts-ignore` or `@ts-expect-error`.
2. **No direct DB calls from apps** — all data flows through `@repo/client` hooks.
3. **No business logic in components** — extract to hooks or convex functions.
4. **Features use vertical slices** — each feature in `features/{name}/` with components/, hooks/, index.ts.
5. **Shared UI only in components/** — `components/ui/` for primitives, `components/layout/` for shells.
6. **Convex validators required** — every query/mutation must declare `args` and `returns` validators.
7. **Bounded reads** — every `.collect()` must use `.take(n)` or pagination.
8. **Indexes for queries** — use `.withIndex()` for filtered reads.
9. **Package boundaries** — apps import from `@repo/*`, never from other apps.
10. **Tests before merge** — `turbo test` and `turbo typecheck` must pass.

## Stack

- **Web**: Next.js 15+ (App Router, Turbopack)
- **Mobile**: Expo 55+ (Expo Router, React Native)
- **Backend**: Convex (reactive, real-time) at `packages/backend/`
- **Shared hooks**: `@repo/client` — universal React hooks for Convex
- **Design tokens**: `@repo/theme` — shared colors for web (Tailwind) + mobile (RN)
- **Build**: Turborepo (pnpm workspaces)
- **Language**: TypeScript (strict mode)

## Monorepo Structure

```
apps/
  web/                Next.js app (see apps/web/CLAUDE.md)
  mobile/             Expo app (see apps/mobile/CLAUDE.md)
packages/
  backend/            Convex functions + schema (@repo/backend)
    convex/           Domain folders (auth/, etc.)
  client/             Universal React hooks (@repo/client)
    src/hooks/        useAuth, use{Domain}
  theme/              Design tokens (@repo/theme)
    src/              tokens.ts, tailwind.ts, react-native.ts
  shared/             Shared types + utils (@repo/shared)
docs/                 Monorepo-level documentation
turbo.json            Build pipeline config
```

## Package Dependency Graph

```
@repo/shared ──┐
               ├──▶ @repo/backend ──▶ @repo/client ──┐
@repo/theme ───┘                                      │
                                      ┌───────────────┤
                                      v               v
                                 apps/web        apps/mobile
```

## Convex Patterns

Backend lives at `packages/backend/convex/`. Same domain-folder pattern:
- `convex/{domain}/schemas.ts` — validators + table definitions
- `convex/{domain}/queries.ts` — `.withIndex()` + `.take(n)` + `args` + `returns`
- `convex/{domain}/mutations.ts` — write functions

## features/ Conventions

- Each app has its own `features/` — never share feature code across apps
- Shared logic goes in `@repo/client` hooks
- Each feature is a self-contained vertical slice
- Import from `@/features/{name}` barrel only

## Commands

```bash
pnpm dev              # Start all apps (turbo)
pnpm build            # Build all packages + apps
pnpm test             # Run all tests
pnpm typecheck        # TypeScript check all
pnpm lint             # Lint all
npx convex dev        # Start Convex dev (from packages/backend/)
```
