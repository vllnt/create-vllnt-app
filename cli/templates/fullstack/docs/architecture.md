# Architecture

## Overview

{{projectName}} is a fullstack monorepo with a Next.js web app, Expo mobile app, and shared Convex backend managed by Turborepo.

## Package Graph

```
@repo/shared ──┐
               ├──▶ @repo/backend ──▶ @repo/client ──┐
@repo/theme ───┘                                      │
                                      ┌───────────────┤
                                      v               v
                                 apps/web        apps/mobile
                              (Next.js 15)       (Expo 55)
```

## Packages

| Package | Purpose | Exports |
|---------|---------|---------|
| `@repo/backend` | Convex schema + functions | API, types, validators |
| `@repo/client` | Universal React hooks + provider | useAuth, hooks, ConvexProvider |
| `@repo/theme` | Design tokens | tailwind.ts (web), react-native.ts (mobile) |
| `@repo/shared` | Shared types + utils | types, validators, utils |

## Apps

| App | Framework | Routing | Styling |
|-----|-----------|---------|---------|
| `apps/web` | Next.js 15 | App Router | Tailwind CSS v4 |
| `apps/mobile` | Expo 55 | Expo Router | RN StyleSheet + tokens |

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Turborepo | Incremental builds, parallel execution, shared cache |
| pnpm workspaces | Strict hoisting, disk-efficient |
| Single Convex backend | Both apps share one database + API |
| Universal hooks | Write data access once in @repo/client |
| Platform-specific features | UI code stays in apps, shared logic in packages |
