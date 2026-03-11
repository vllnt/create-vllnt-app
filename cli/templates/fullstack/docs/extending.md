# Extending {{projectName}}

## Adding a Cross-Platform Feature

1. **Backend**: Create `packages/backend/convex/{domain}/` (schemas + queries + mutations)
2. **Client hooks**: Add `packages/client/src/hooks/use-{domain}.ts`
3. **Web feature**: Create `apps/web/features/{name}/` (vertical slice)
4. **Mobile feature**: Create `apps/mobile/features/{name}/` (vertical slice)

## Adding a Package

1. Create `packages/{name}/` with `package.json` (`name: "@repo/{name}"`)
2. Add to `pnpm-workspace.yaml` (already covers `packages/*`)
3. Add to consuming package's dependencies: `"@repo/{name}": "workspace:*"`
4. Run `pnpm install` to link

## CLI Commands

```bash
vllnt add auth          # BetterAuth for both apps
vllnt add payments      # Stripe integration

vllnt generate feature {name}    # Feature slice (in current app)
vllnt generate domain {name}     # Convex domain in packages/backend
vllnt generate hook {name}       # Hook in packages/client
```

## Build Pipeline

```bash
turbo build     # Build all (respects dependency graph)
turbo dev       # Dev all apps in parallel
turbo test      # Test all packages + apps
turbo typecheck # Typecheck everything
```

## Environment Variables

- **Web**: `.env.local` in `apps/web/` for `NEXT_PUBLIC_*`
- **Mobile**: `.env` in `apps/mobile/` for `EXPO_PUBLIC_*`
- **Convex**: Set via `npx convex env set KEY value` (from `packages/backend/`)
