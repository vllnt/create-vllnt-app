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
10. **No secrets in code** — use environment variables via `process.env` or Convex dashboard.

## Stack

- **Framework**: Next.js 16 (App Router, Server Components, Turbopack)
- **Backend**: Convex (reactive, real-time, serverless)
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (locale in `[locale]` route segment)
- **Language**: TypeScript (strict mode)
- **Testing**: Vitest (unit) + Playwright (E2E)

## Project Structure

```
app/[locale]/           App Router pages (grouped by route segment)
  (marketing)/          Public pages (landing, pricing)
  (auth)/               Auth pages (login, register)
  (dashboard)/          Protected pages
components/             Shared UI (no business logic)
  ui/                   Design system primitives
  layout/               Shell components (header, footer, sidebar)
  providers/            Context providers (convex, theme, i18n)
convex/                 Backend functions (Convex)
  {domain}/             Domain folder (auth/, billing/, etc.)
    schemas.ts          Table definitions + validators
    queries.ts          Read functions (.withIndex, .take)
    mutations.ts        Write functions (ctx.db.insert/patch/replace/delete)
  schema.ts             Root schema (imports from domain folders)
  convex.config.ts      Component registration
  http.ts               HTTP routes
features/               Feature slices (vertical: UI + logic + hooks)
  {name}/
    components/         Feature-specific UI
    hooks/              Feature-specific hooks
    index.ts            Public API (barrel export)
lib/                    Shared utilities
  schemas.ts            Zod validation schemas
  utils.ts              Helper functions
i18n/                   Internationalization config
messages/               Translation JSON files
docs/                   Project documentation
```

## Convex Patterns

### Domain Folder Structure
Each domain in `convex/` follows: `schemas.ts` + `queries.ts` + `mutations.ts`.

### Validators (Dual Pattern)
```typescript
import { v, type Validator } from 'convex/values'

export const userDataValidator = {
  email: v.string(),
  name: v.string(),
} satisfies Record<string, Validator<any, 'required', any>>

export const userDocumentValidator = {
  ...userDataValidator,
  _id: v.id('users'),
  _creationTime: v.number(),
}
```

### Query Pattern
```typescript
import { query } from '../_generated/server'
import { v } from 'convex/values'

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

### Mutation Pattern
```typescript
import { internalMutation } from '../_generated/server'
import { v } from 'convex/values'

export const upsertUser = internalMutation({
  args: { email: v.string(), name: v.string() },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
      return existing._id
    }
    return await ctx.db.insert('users', args)
  },
})
```

## features/ Conventions

- Each feature is a self-contained vertical slice
- `index.ts` exports the public API — consumers import from `@/features/{name}`
- Components inside a feature are private unless exported from index.ts
- Hooks live in `hooks/` subfolder, named `use-{name}.ts`
- Never import directly from a feature's internal files — use barrel export

## Next.js Conventions

- Pages use Server Components by default
- Client components marked with `'use client'` directive at top
- Data fetching via convex `useQuery`/`useMutation` hooks in client components
- Layouts handle metadata via `generateMetadata`
- Route groups `(name)` for layout segmentation, no URL impact
- Proxy handles locale routing (next-intl via proxy.ts)

## Testing

- Unit tests: `vitest` — colocate as `{name}.test.ts` or in `__tests__/`
- E2E tests: `playwright` — in `tests/e2e/`
- Run: `pnpm test` (unit), `pnpm test:e2e` (E2E)

## Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm typecheck        # TypeScript check
pnpm lint             # ESLint
npx convex dev        # Start Convex dev server
```
