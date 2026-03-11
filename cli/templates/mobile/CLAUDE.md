# {{projectName}} — Agent Rules

## BLOCKING Rules (Enforce Always)

These rules are NON-NEGOTIABLE. Violating any BLOCKING rule requires immediate fix before proceeding.

1. **No `any` type** — use `unknown` + type guards. No `@ts-ignore` or `@ts-expect-error`.
2. **No direct DB calls from UI** — all data flows through convex queries/mutations.
3. **No business logic in components** — extract to hooks or convex functions.
4. **Features use vertical slices** — each feature in `features/{name}/` with components/, hooks/, index.ts.
5. **Shared UI only in components/** — `components/ui/` for primitives, `components/layout/` for shells.
6. **Convex validators required** — every query/mutation must declare `args` and `returns` validators.
7. **Bounded reads** — every `.collect()` must use `.take(n)` or pagination. No unbounded reads.
8. **Indexes for queries** — use `.withIndex()` for filtered reads. No `.filter()` on full table scans.
9. **Tests before merge** — `pnpm test` and `pnpm typecheck` must pass.
10. **No secrets in code** — use environment variables via Expo constants or Convex dashboard.

## Stack

- **Framework**: Expo 55+ (Expo Router, React Native)
- **Backend**: Convex (reactive, real-time, serverless)
- **Styling**: React Native StyleSheet + color tokens
- **i18n**: i18next + react-i18next
- **Language**: TypeScript (strict mode)
- **Testing**: Jest (unit) + Maestro (E2E)

## Project Structure

```
app/                    Expo Router screens (file-based routing)
  _layout.tsx           Root layout (providers, splash screen)
  (tabs)/               Tab navigation (home, settings)
  (auth)/               Auth screens (login, register)
  (stack)/              Stack navigation for deep screens
components/             Shared UI (no business logic)
  ui/                   Design system primitives (ThemedText, Button)
  layout/               Shell components (TabBar, headers)
  providers/            Context providers (ConvexProvider)
convex/                 Backend functions (Convex)
  {domain}/             Domain folder (auth/, etc.)
    schemas.ts          Table definitions + validators
    queries.ts          Read functions (.withIndex, .take)
    mutations.ts        Write functions
  schema.ts             Root schema
  convex.config.ts      Component registration
features/               Feature slices (vertical: UI + logic + hooks)
  {name}/
    components/         Feature-specific UI
    hooks/              Feature-specific hooks
    index.ts            Public API (barrel export)
contexts/               React contexts (theme)
hooks/                  Shared hooks
lib/                    Shared utilities
  constants.ts          Color tokens (light + dark)
  utils.ts              Platform helpers
i18n/                   Internationalization
  locales/              Translation JSON files
.maestro/               Maestro E2E test flows
docs/                   Project documentation
```

## Expo Patterns

### File-Based Routing (Expo Router)
- `app/` directory = routes. `_layout.tsx` = layout wrapper.
- Route groups: `(tabs)`, `(auth)`, `(stack)` — no URL impact.
- Typed routes enabled via `experiments.typedRoutes` in app.json.

### Platform-Specific Code
- Use `.ios.ts`, `.android.ts`, `.web.ts` suffixes for platform variants.
- Shared hook + platform variant: `use-{name}.ts` + `use-{name}.web.ts`.

### Providers (Root Layout)
```
ThemeProvider > ConvexProvider > Stack (Expo Router)
```

## Convex Patterns

### Domain Folder Structure
Each domain in `convex/` follows: `schemas.ts` + `queries.ts` + `mutations.ts`.

### Query Pattern
```typescript
export const getUser = query({
  args: { email: v.string() },
  returns: v.union(v.object({ ... }), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()
  },
})
```

## features/ Conventions

- Each feature is a self-contained vertical slice
- `index.ts` exports the public API — consumers import from `@/features/{name}`
- Components inside a feature are private unless exported from index.ts
- Hooks live in `hooks/` subfolder, named `use-{name}.ts`
- Never import directly from a feature's internal files

## Testing

- Unit tests: `jest` — colocate as `{name}.test.ts`
- E2E tests: `maestro` — in `.maestro/`
- Run: `pnpm test` (unit), `pnpm test:e2e` (E2E)

## Commands

```bash
pnpm start            # Start Expo dev server
pnpm dev              # Start with dev client
pnpm ios              # Run on iOS simulator
pnpm android          # Run on Android emulator
pnpm web              # Run Expo Web
pnpm test             # Run unit tests
pnpm test:e2e         # Run Maestro E2E tests
pnpm typecheck        # TypeScript check
npx convex dev        # Start Convex dev server
```
