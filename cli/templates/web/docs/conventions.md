# Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` in route folder | `app/[locale]/(dashboard)/page.tsx` |
| Components | PascalCase folder + file | `components/ui/Button/Button.tsx` |
| Hooks | kebab-case with `use-` prefix | `features/auth/hooks/use-auth.ts` |
| Convex functions | camelCase exports | `convex/auth/queries.ts` → `getUser` |
| Utilities | kebab-case | `lib/format-date.ts` |

## Import Order

1. React / Next.js
2. Third-party libraries
3. `@/components/` (shared UI)
4. `@/features/` (feature slices)
5. `@/lib/` (utilities)
6. Relative imports (same feature)

## Component Rules

- Server Components by default — add `'use client'` only when needed
- Props interface named `{Component}Props`
- No business logic — delegate to hooks or convex functions
- Use Tailwind classes, avoid inline styles

## Convex Rules

- Every table in a domain folder: `convex/{domain}/`
- Validators: `args` + `returns` on every public function
- Queries: `.withIndex()` for filtered reads, `.take(n)` for bounded
- Mutations: use `internalMutation` for system operations
- Never expose internal functions to the client

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Feature branches: `feature/{name}`, `fix/{name}`
- PR required for merge to main
