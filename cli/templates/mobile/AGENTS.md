# {{projectName}} — Agent Architecture Guide

This document describes the project architecture, extension points, and common tasks.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│              Expo App (React Native)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Screens  │  │ Features │  │  Components  │  │
│  │  (routes) │──│ (slices) │──│ (shared UI)  │  │
│  └────┬──────┘  └────┬─────┘  └──────────────┘  │
│       │               │                          │
│  ┌────▼───────────────▼────┐                     │
│  │   Convex React Hooks    │                     │
│  │  useQuery / useMutation  │                     │
│  └────────────┬────────────┘                     │
└───────────────┼──────────────────────────────────┘
                │ WebSocket (real-time)
┌───────────────▼──────────────────────────────────┐
│                Convex Backend                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Queries  │  │ Mutations │  │   Actions    │  │
│  └────┬─────┘  └─────┬─────┘  └──────────────┘  │
│  ┌────▼───────────────▼────┐                     │
│  │      Convex Database     │                     │
│  └──────────────────────────┘                     │
└───────────────────────────────────────────────────┘
```

## Extension Points

| What | Where | How |
|------|-------|-----|
| New screen | `app/(group)/` | Add screen file, update layout if needed |
| New feature | `features/{name}/` | Create components/, hooks/, index.ts |
| New domain | `convex/{domain}/` | Add schemas.ts, queries.ts, mutations.ts |
| Shared component | `components/ui/` | Reusable, no business logic |
| New translation | `i18n/locales/{locale}.json` | Add key-value pairs |
| Auth integration | `vllnt add auth` | Configures BetterAuth + Convex |
| Tab screen | `app/(tabs)/{name}.tsx` | Add to tab layout |

## Common Tasks

### Add a new screen
1. Create `app/(group)/{name}.tsx`
2. Add translations to `i18n/locales/en.json`
3. Update navigation layout if needed

### Add a new feature
1. Create `features/{name}/` with components/, hooks/, index.ts
2. Create hooks for convex data: `useQuery`, `useMutation`
3. Export public API from index.ts
4. Import in screens as `@/features/{name}`

### Add a new convex domain
1. Create `convex/{domain}/schemas.ts` — define validators + table
2. Create `convex/{domain}/queries.ts` — read functions with `.withIndex()`
3. Create `convex/{domain}/mutations.ts` — write functions
4. Register table in `convex/schema.ts`

## Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Unbounded reads | Always use `.take(n)` or pagination |
| Full table scans | Define indexes, use `.withIndex()` |
| Business logic in UI | Extract to features/ hooks or convex functions |
| Cross-feature imports | Import from `@/features/{name}` barrel only |
| Missing validators | Every convex function needs `args` + `returns` |
| Hardcoded strings | Use i18next `useTranslation()` |
| Platform-specific bugs | Use `.ios.ts`/`.android.ts`/`.web.ts` suffixes |

## Code Generators

```bash
vllnt generate screen {name}     # New Expo Router screen
vllnt generate component {name}  # Shared UI component
vllnt generate feature {name}    # Feature slice (components + hooks)
vllnt generate hook {name}       # Custom hook
vllnt generate domain {name}     # Convex domain (schemas + queries + mutations)
```
