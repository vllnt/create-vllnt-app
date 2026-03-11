# {{projectName}} — Agent Architecture Guide (Monorepo)

This document describes the monorepo architecture, package boundaries, and common tasks.

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        Turborepo                           │
│                                                            │
│  ┌──────────────────┐    ┌──────────────────┐             │
│  │    apps/web       │    │   apps/mobile     │             │
│  │   (Next.js 15)    │    │   (Expo 55)       │             │
│  │  features/ comps/ │    │  features/ comps/  │             │
│  └────────┬──────────┘    └────────┬──────────┘             │
│           │                        │                        │
│  ┌────────▼────────────────────────▼────────┐              │
│  │            @repo/client                   │              │
│  │     Universal hooks + ConvexProvider      │              │
│  └────────────────────┬─────────────────────┘              │
│                       │                                     │
│  ┌────────────────────▼─────────────────────┐              │
│  │            @repo/backend                  │              │
│  │     Convex functions + schema             │              │
│  └───────────────────────────────────────────┘              │
│                                                            │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │ @repo/theme   │    │ @repo/shared  │                     │
│  │ Design tokens │    │ Types + utils │                     │
│  └──────────────┘    └──────────────┘                     │
└────────────────────────────────────────────────────────────┘
```

## Package Boundaries

| Package | Owns | Consumers | Rule |
|---------|------|-----------|------|
| `@repo/backend` | Convex schema, functions | `@repo/client` | Apps never import directly |
| `@repo/client` | Hooks, ConvexProvider | `apps/web`, `apps/mobile` | Single entry for Convex |
| `@repo/theme` | Color tokens, design vars | Both apps | Web: tailwind.ts, Mobile: react-native.ts |
| `@repo/shared` | Types, validators, utils | All packages + apps | No runtime deps |

## Extension Points

| What | Where | How |
|------|-------|-----|
| New web page | `apps/web/app/[locale]/` | Add page.tsx + translations |
| New mobile screen | `apps/mobile/app/` | Add screen + navigation |
| New feature (web) | `apps/web/features/` | Vertical slice |
| New feature (mobile) | `apps/mobile/features/` | Vertical slice |
| New domain | `packages/backend/convex/` | schemas + queries + mutations |
| New shared hook | `packages/client/src/hooks/` | Universal hook for both apps |
| New design token | `packages/theme/src/tokens.ts` | Update both tailwind + RN exports |

## Common Tasks

### Add a cross-platform feature
1. Create convex domain in `packages/backend/convex/{domain}/`
2. Add hooks in `packages/client/src/hooks/use-{domain}.ts`
3. Create web feature in `apps/web/features/{name}/`
4. Create mobile feature in `apps/mobile/features/{name}/`

### Add a shared hook
1. Create `packages/client/src/hooks/use-{name}.ts`
2. Export from `packages/client/src/index.ts`
3. Import in apps as `import { useX } from '@repo/client'`

## Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Cross-app imports | Apps never import from each other — use @repo/* |
| Direct Convex in apps | Always go through @repo/client hooks |
| Shared feature code | Features are app-specific; shared logic in @repo/client |
| Token mismatch | Single @repo/theme source, platform-specific exports |
| Build order | turbo.json handles dependency graph — don't bypass |
