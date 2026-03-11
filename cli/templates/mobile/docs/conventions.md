# Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Screens | lowercase in route folder | `app/(tabs)/settings.tsx` |
| Components | PascalCase | `components/ui/ThemedText.tsx` |
| Hooks | kebab-case with `use-` prefix | `features/auth/hooks/use-auth.ts` |
| Convex functions | camelCase exports | `convex/auth/queries.ts` -> `getUser` |
| Platform variants | `.ios.ts` / `.android.ts` / `.web.ts` | `use-haptics.ios.ts` |

## Component Rules

- Use React Native primitives (View, Text, Pressable)
- Props interface named `{Component}Props`
- No business logic — delegate to hooks or convex functions
- Use StyleSheet.create for styles, color tokens from constants

## Convex Rules

- Every table in a domain folder: `convex/{domain}/`
- Validators: `args` + `returns` on every public function
- Queries: `.withIndex()` for filtered reads, `.take(n)` for bounded
- Mutations: use `internalMutation` for system operations

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Feature branches: `feature/{name}`, `fix/{name}`
- PR required for merge to main
