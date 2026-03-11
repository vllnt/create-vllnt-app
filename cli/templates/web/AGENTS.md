# {{projectName}} — Agent Architecture Guide

This document describes the project architecture, extension points, and common tasks.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
│  ┌─────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Pages   │  │ Features │  │  Components   │  │
│  │ (routes) │──│ (slices) │──│ (shared UI)   │  │
│  └────┬─────┘  └────┬─────┘  └───────────────┘  │
│       │              │                            │
│  ┌────▼──────────────▼────┐                      │
│  │   Convex React Hooks   │                      │
│  │  useQuery / useMutation │                      │
│  └────────────┬───────────┘                      │
└───────────────┼──────────────────────────────────┘
                │ WebSocket (real-time)
┌───────────────▼──────────────────────────────────┐
│                Convex Backend                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Queries  │  │ Mutations │  │   Actions    │  │
│  │ (reads)  │  │ (writes)  │  │ (side-fx)   │  │
│  └────┬─────┘  └─────┬─────┘  └──────────────┘  │
│       │               │                           │
│  ┌────▼───────────────▼────┐                     │
│  │      Convex Database     │                     │
│  │   (document store)       │                     │
│  └──────────────────────────┘                     │
└───────────────────────────────────────────────────┘
```

## Extension Points

| What | Where | How |
|------|-------|-----|
| New page | `app/[locale]/(group)/` | Add `page.tsx` + layout if needed |
| New feature | `features/{name}/` | Create components/, hooks/, index.ts |
| New domain | `convex/{domain}/` | Add schemas.ts, queries.ts, mutations.ts |
| Shared component | `components/ui/` | Reusable, no business logic |
| New translation | `messages/{locale}.json` | Add key-value pairs |
| Auth integration | `vllnt add auth` | Configures BetterAuth + Convex |
| Payment integration | `vllnt add payments` | Configures Stripe + Convex |

## Common Tasks

### Add a new page
1. Create `app/[locale]/(group)/route-name/page.tsx`
2. Add translations to `messages/en.json`
3. Export metadata via `generateMetadata`

### Add a new feature
1. Create `features/{name}/` with components/, hooks/, index.ts
2. Create hooks for convex data: `useQuery`, `useMutation`
3. Export public API from index.ts
4. Import in pages as `@/features/{name}`

### Add a new convex domain
1. Create `convex/{domain}/schemas.ts` — define validators + table
2. Create `convex/{domain}/queries.ts` — read functions with `.withIndex()`
3. Create `convex/{domain}/mutations.ts` — write functions
4. Register table in `convex/schema.ts`
5. Add index entries for filtered queries

### Add a shared component
1. Create `components/ui/{name}.tsx`
2. No business logic — props in, JSX out
3. Use Tailwind for styling

## Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Unbounded reads | Always use `.take(n)` or pagination |
| Full table scans | Define indexes, use `.withIndex()` |
| Business logic in UI | Extract to features/ hooks or convex functions |
| Cross-feature imports | Import from `@/features/{name}` barrel only |
| Missing validators | Every convex function needs `args` + `returns` |
| Hardcoded strings | Use next-intl `useTranslations()` |
| Client-side secrets | Use Convex environment variables |
| Untyped convex returns | Declare `returns` validator on every function |

## Code Generators

```bash
vllnt generate page {name}       # New page with layout + metadata
vllnt generate component {name}  # Shared UI component
vllnt generate feature {name}    # Feature slice (components + hooks)
vllnt generate hook {name}       # Custom hook
vllnt generate domain {name}     # Convex domain (schemas + queries + mutations)
```
