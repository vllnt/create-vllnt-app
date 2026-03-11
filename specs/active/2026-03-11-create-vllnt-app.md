---
title: create-vllnt-app
status: active
created: 2026-03-11
estimate: 80h (4 phases) — revised from 48h after spec review
tier: standard
---

# create-vllnt-app

## Intention Note

### The Problem

AI coding agents are now the primary producers of application code. But they operate
in a vacuum — no shared conventions, no structural guardrails, no machine-readable
project contracts. Every project is a blank canvas where agents reinvent patterns,
introduce inconsistencies, and produce code that doesn't scale.

Humans face the inverse: bootstrapping a production-grade app with i18n, theming,
testing, Convex backend, and agent instructions takes days. Most skip it.

### The Vision

**create-vllnt-app** is an opinionated CLI platform that makes AI coding agents and
solo developers produce production-grade software by default. Convention over
configuration for the agent era.

```
┌─────────────────────────────────────────────────────────────┐
│                    create-vllnt-app                          │
│                                                             │
│  "The framework that makes agents build software that       │
│   scales — strict conventions, zero guesswork."             │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ vllnt    │  │ vllnt add    │  │ Agent Contract     │    │
│  │ new      │  │ vllnt gen    │  │ (CLAUDE.md,        │    │
│  │          │  │              │  │  AGENTS.md, docs/) │    │
│  │ 3 modes: │  │ Generators   │  │                    │    │
│  │ web      │  │ features/    │  │ Machine-readable   │    │
│  │ mobile   │  │ components/  │  │ project rules that │    │
│  │ fullstack│  │ screens/     │  │ agents follow      │    │
│  └──────────┘  └──────────────┘  └────────────────────┘    │
│                                                             │
│  Primary consumer: AI coding agents                         │
│  Secondary consumer: Solo developers / small teams          │
│  Output: Scalable, consistent, production-ready software    │
└─────────────────────────────────────────────────────────────┘
```

### Why Agent-First

Agents are the new junior developers. They're fast but need guardrails:

| Human developer | AI coding agent |
|-----------------|-----------------|
| Reads README, learns conventions over weeks | Reads CLAUDE.md/AGENTS.md, follows instantly |
| Internalizes patterns through code review | Needs patterns encoded as rules in markdown |
| Makes judgment calls on architecture | Follows explicit decision trees |
| Remembers context across sessions | Loses context every session — docs = ground truth |
| Knows when to break rules | Follows rules literally — rules must be right |

**Insight:** The quality ceiling of agent-produced code is determined by the quality
of the project's agent contract (CLAUDE.md + AGENTS.md + docs/).

### Design Principles

1. **Convention over configuration** — Every decision made. No "choose your adventure"
   beyond web / mobile / full-stack. Stack is fixed: Next.js, Expo, Convex, Turborepo.
2. **Agent contract is the product** — CLAUDE.md, .cursorrules, .windsurfrules, AGENTS.md, docs/ are the primary
   deliverable. Code is secondary. All generated from single source. BLOCKING rules first in every file (agents weight early rules higher).
3. **Generators enforce patterns** — `vllnt add/generate` produce code following
   conventions. Agents don't freestyle.
4. **Vertical slices in `features/`** — Every feature is self-contained:
   components + hooks + lib + tests + i18n. Feature code lives together.
5. **`components/` = shared only** — Root components/ is strictly for UI used across
   2+ features. Feature-specific UI lives in features/{name}/components/.
6. **Convex-native backend** — Domain-folder structure, dual validators, indexed
   queries, bounded reads. Convex skill rules baked into every scaffold.
7. **Testing is not optional** — 3-tier: unit (Jest/Vitest), E2E web (Playwright),
   E2E mobile (Maestro). Generators produce test stubs.
8. **i18n from day 1** — No hardcoded strings, ever.
9. **Scale by default** — TypeScript strict, Zod at boundaries, proper error handling.
10. **CLI IS the template** — No separate template repos. Templates live inside
    create-vllnt-app. vllnt/expo-template and vllnt/next-template are deprecated
    and deleted after ship. Single source of truth for project scaffolding.
11. **@vllnt/ui = web only** — Used by web scaffold and landing page. Mobile uses
    custom themed primitives (ThemedText, ThemedView). No RN support yet.

### The CLI Command Surface

```
vllnt new [name]                    Scaffold new project
  --template web|mobile|fullstack   Template selection
  --yes                             Non-interactive (defaults)
  --agent                           Machine-readable JSON output

vllnt add <feature>                 Add feature to existing project
  vllnt add auth                    BetterAuth + Convex adapter
  vllnt add analytics               @vllnt/analytics integration
  vllnt add payments                 Polar.sh via @convex-dev/polar
  vllnt add push-notifications       Expo notifications (mobile)
  vllnt add email                   Resend/React Email (web)

vllnt generate <type> <name>        Generate code artifact
  vllnt generate page /dashboard    Next.js page + layout + test + i18n
  vllnt generate screen Settings    Expo screen + nav + test + i18n
  vllnt generate component Button   Component + test + story
  vllnt generate hook useAuth       Hook + test
  vllnt generate api /users         API route + Zod schema + test
  vllnt generate feature auth       Full vertical slice
  vllnt generate domain billing     Convex domain (schemas+queries+mutations+tests)

vllnt doctor                        Health check
```

### 3 Scaffold Modes

```
vllnt new my-app
  │
  ├── "Web"        → Next.js 16 + Convex + Tailwind v4 + next-intl + @vllnt/ui
  │                  Single app with convex/ at project root
  │
  ├── "Mobile"     → Expo 55 + Convex + React Native + i18next
  │                  Single app with convex/ at project root
  │
  └── "Full Stack" → Monorepo: apps/web + apps/mobile + packages/backend
                     Shared Convex backend, universal hooks, shared theme
                     Based on songtrivia architecture (most mature pattern)
```

### Architecture: `features/` + `components/` Rule

```
FILE PLACEMENT DECISION TREE (agents follow this exactly):

Is it routing/navigation?
  YES → app/                           (ROUTING ONLY, no logic)

Is it used by 2+ features?
  YES → Is it UI?    → components/     (shared primitives, layout)
        Is it a hook? → hooks/         (cross-feature hooks)
        Is it a util? → lib/           (shared utilities)

Is it feature-specific?
  YES → features/{feature}/            (self-contained vertical slice)
        ├── components/                (feature UI)
        ├── hooks/                     (feature logic)
        ├── lib/                       (feature utils)
        └── index.ts                   (public API)

Is it a Convex function?
  YES → convex/{domain}/              (domain-folder pattern)
        ├── schemas.ts                (table definitions)
        ├── queries.ts                (reads)
        ├── mutations.ts              (writes)
        ├── actions.ts                (external calls)
        └── tests/                    (co-located tests)

Is it a design token?
  YES → packages/theme/ (monorepo) or lib/constants.ts (standalone)
```

### Convex Rules (Baked Into Every Scaffold)

From the vllnt Convex skill — these are BLOCKING rules in generated CLAUDE.md:

| Rule | Enforcement |
|------|-------------|
| Always use `args` + `returns` validators | Dual validator pattern in blueprints |
| Prefer `.withIndex()` over `.filter()` | Agent rules + convex-guardian |
| Bounded reads with `.take(n)` | Agent rules |
| Identity from `ctx.auth`, never args | Auth wrapper pattern in blueprints |
| `internal.*` for sensitive operations | Blueprint defaults |
| Schedule only `internal.*` functions | Agent rules |
| `v.null()` for void returns | Blueprint defaults |
| Domain folder structure | Generator enforces: `convex/{domain}/schemas+queries+mutations` |
| TSDoc on all exported functions | Agent rules |
| No N+1 queries (`.get()` in loops) | Agent rules + convex-guardian |
| Ecosystem components preferred | docs/extending.md lists: workpool, workflow, rate-limiter, polar |

### BetterAuth + Convex Integration Architecture

`vllnt add auth` wires up the full BetterAuth stack. Required files per scaffold:

```
convex/
├── convex.config.ts          # app.use(betterAuth)  ← component registration
├── auth.config.ts            # BetterAuth config (providers, session, etc.)
├── http.ts                   # httpRouter + auth HTTP routes registered
├── auth/
│   ├── schemas.ts            # User/session/account tables (from @convex-dev/better-auth)
│   ├── queries.ts            # getUser, getSession (ctx.auth wrapper)
│   └── mutations.ts          # Internal mutations for auth state

features/auth/
├── components/               # LoginForm, RegisterForm, AuthGuard
├── hooks/
│   └── use-auth.ts           # useAuth hook wrapping Convex auth
├── lib/
│   └── auth-client.ts        # BetterAuth client instance
└── index.ts

middleware.ts (web)            # Auth session check, redirect unauthenticated
app/(auth)/                    # Login + register routes (already in scaffold)
```

**Key wiring (BLOCKING for `vllnt add auth`):**
1. `convex.config.ts` → `app.use(betterAuth)` registers the component
2. `auth.config.ts` → configures providers (email/password, OAuth)
3. `http.ts` → `auth.addHttpRoutes(http)` exposes auth endpoints
4. `middleware.ts` → session validation on protected routes
5. `features/auth/lib/auth-client.ts` → client-side BetterAuth instance
6. CLAUDE.md updated with auth rules (identity from ctx.auth, never args)

### Next.js Rules (Baked Into Web Scaffold)

From the vllnt Next.js patterns — these are in generated CLAUDE.md:

| Rule | Enforcement |
|------|-------------|
| Server Components by default | Agent rules: only add `"use client"` for state/effects/events |
| Colocate data fetching in the component | Agent rules: no prop-drilling server data |
| Server Actions for mutations from own UI | Agent rules: Route Handlers only for webhooks |
| Streaming with Suspense boundaries | Blueprint includes loading.tsx stubs |
| `generateMetadata()` on every page | Blueprint enforces |
| Always use `Link` from `@/i18n/navigation` | Agent rules: never `next/link` |
| Zod validation at all boundaries | `lib/schemas.ts` pattern in blueprint |
| `import 'server-only'` on server utils | Blueprint enforces |
| `React.cache()` on data loaders | Blueprint pattern |

### Competitive Position

```
                 Scaffold  Generate  Agent     Convex   i18n  Test
                                     Contract  Native         3-tier
create-t3-app      X
create-next-app    X
create-expo-app    X
Angular CLI        X         X
NestJS CLI         X         X
Nx                 X         X

create-vllnt-app   X         X         X         X       X     X
```

No existing tool generates agent contracts + is Convex-native.

---

## Context

AI coding agents are the fastest-growing consumers of dev tooling, but no scaffold
treats them as first-class users. create-vllnt-app is an opinionated CLI platform
that scaffolds production-grade web (Next.js), mobile (Expo), or full-stack monorepo
(both + shared Convex backend) projects with agent contracts, code generators, and
strict workflow rules. Three scaffold modes: standalone web, standalone mobile, or
full-stack monorepo.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `cli/` | CREATE | CLI package — commands, generators, scaffold engine |
| `cli/src/index.ts` | CREATE | Entry point — commander program, command registration |
| `cli/src/commands/new.ts` | CREATE | `vllnt new` — 3-mode scaffold (web/mobile/fullstack) |
| `cli/src/commands/add.ts` | CREATE | `vllnt add` — feature addition |
| `cli/src/commands/generate.ts` | CREATE | `vllnt generate` — code generation |
| `cli/src/commands/doctor.ts` | CREATE | `vllnt doctor` — health check |
| `cli/src/core/scaffold.ts` | CREATE | Template copy, configure, post-process |
| `cli/src/core/generator.ts` | CREATE | Generator engine — read blueprint, render, write |
| `cli/src/core/detector.ts` | CREATE | Project type detection (web/mobile/monorepo) |
| `cli/src/generators/` | CREATE | Generator blueprints per type |
| `cli/src/generators/agent-docs/` | CREATE | CLAUDE.md, AGENTS.md generators |
| `cli/src/prompts/` | CREATE | Interactive prompts per command |
| `cli/src/utils/` | CREATE | Logger, pkg manager, validation, ASCII art |
| `cli/templates/web/` | CREATE | Embedded next-template snapshot |
| `cli/templates/mobile/` | CREATE | Embedded expo-template snapshot |
| `cli/templates/fullstack/` | CREATE | Monorepo scaffold (apps/web, apps/mobile, packages/*) |
| `cli/blueprints/web/` | CREATE | Next.js blueprints (page, component, api, feature) |
| `cli/blueprints/mobile/` | CREATE | Expo blueprints (screen, component, feature) |
| `cli/blueprints/shared/` | CREATE | Shared blueprints (component, hook) |
| `cli/blueprints/convex/` | CREATE | Convex domain blueprint (schemas+queries+mutations+tests) |
| `cli/blueprints/agent-docs/` | CREATE | CLAUDE.md, .cursorrules, .windsurfrules, AGENTS.md, docs/ templates per mode |
| `www/` | CREATE | Landing page |
| `turbo.json` | CREATE | Turborepo config |
| `package.json` | CREATE | Root workspace |
| `pnpm-workspace.yaml` | CREATE | Workspace definition |

**Files:** 26+ create | 0 modify | 0 affected
**Reuse:** vllnt/expo-template (absorbed into CLI), vllnt/next-template (absorbed into CLI), @vllnt/ui (web + landing page only, not RN), @vllnt/eslint-config, @vllnt/typescript, convex skill rules, next.js patterns
**Breaking changes:** vllnt/expo-template and vllnt/next-template repos DEPRECATED — delete after create-vllnt-app ships. CLI becomes the single source of truth for templates.
**New dependencies:**
- `@clack/prompts` — CLI prompts
- `commander` — command routing
- `chalk` — terminal colors
- `fs-extra` — file operations
- `execa` — shell execution
- `gradient-string` — ASCII title
- `tsup` — CLI bundling
- `handlebars` — blueprint rendering
- `glob` — file pattern matching

## Generated Project Trees

### Web Scaffold (Next.js + Convex)

```
my-app/
├── CLAUDE.md                         # Agent rules (<200 lines)
├── AGENTS.md                         # Agent playbook
├── docs/
│   ├── architecture.md
│   ├── conventions.md
│   ├── testing.md
│   ├── i18n.md
│   ├── theming.md
│   └── extending.md
│
├── app/                              # ROUTING ONLY — no business logic
│   ├── globals.css                   # Tailwind v4 CSS-first + theme tokens
│   ├── robots.ts
│   ├── sitemap.ts
│   └── [locale]/
│       ├── layout.tsx                # Providers: Theme + Intl + Convex
│       ├── not-found.tsx
│       ├── (marketing)/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── (auth)/
│       │   ├── layout.tsx
│       │   ├── login/page.tsx
│       │   └── register/page.tsx
│       ├── (dashboard)/
│       │   ├── layout.tsx
│       │   └── dashboard/page.tsx
│       └── (blog)/
│           ├── layout.tsx
│           ├── blog/page.tsx
│           └── blog/[slug]/page.tsx
│
├── components/                       # SHARED UI (used by 2+ features)
│   ├── ui/                           # Design primitives (from @vllnt/ui or local)
│   ├── layout/                       # App shell (Header, Footer, Sidebar, Nav)
│   └── providers/                    # Context providers (Convex, Theme)
│
├── features/                         # VERTICAL SLICES (feature-scoped)
│   ├── auth/
│   │   ├── components/               # Auth-specific UI
│   │   ├── hooks/                    # use-auth.ts
│   │   ├── lib/                      # Auth validators, utils
│   │   └── index.ts                  # Public API
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── blog/
│       ├── components/
│       ├── lib/                      # Blog loaders (server-only, React.cache())
│       └── index.ts
│
├── convex/                           # BACKEND — domain-folder structure
│   ├── schema.ts                     # Imports from domain schemas
│   ├── auth/
│   │   ├── schemas.ts                # Table defs (dual validator pattern)
│   │   ├── queries.ts                # Always: args + returns validators
│   │   ├── mutations.ts              # Identity from ctx.auth
│   │   └── tests/
│   ├── {domain}/
│   │   ├── schemas.ts
│   │   ├── queries.ts                # .withIndex() + .take(n)
│   │   ├── mutations.ts
│   │   ├── actions.ts                # External API calls
│   │   └── tests/
│   ├── lib/                          # Shared helpers (auth wrappers, etc.)
│   ├── crons.ts
│   ├── http.ts                       # Webhooks (validate signatures)
│   └── _generated/
│
├── lib/                              # SHARED UTILITIES (non-feature)
│   ├── schemas.ts                    # Shared Zod schemas (boundaries)
│   ├── utils.ts                      # cn() + helpers
│   └── format.ts                     # Formatters
│
├── hooks/                            # SHARED HOOKS (cross-feature only)
│   └── use-{name}.ts
│
├── i18n/                             # next-intl
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
│
├── messages/{locale}.json
├── content/blog/{locale}/{slug}.mdx
├── content/pages/{slug}/{locale}.mdx
├── public/
├── tests/e2e/{feature}.spec.ts
├── specs/active/ backlog/ shipped/ dropped/
│
├── package.json                      # pnpm, node >=22
├── tsconfig.json                     # @vllnt/typescript/nextjs.json, strict
├── next.config.mjs                   # withNextIntl(withMDX(config))
├── middleware.ts                     # next-intl locale routing
├── convex.json
├── convex.config.ts                  # Component registration (BetterAuth, Polar, etc.)
├── eslint.config.js                  # @vllnt/eslint-config nextjs
├── .cursorrules                      # Cursor agent rules (generated from CLAUDE.md)
├── .windsurfrules                    # Windsurf agent rules (generated from CLAUDE.md)
├── .prettierrc                       # no semi, single quote, 2-space
├── postcss.config.mjs
└── playwright.config.ts              # 3 viewports
```

### Mobile Scaffold (Expo + Convex)

```
my-app/
├── CLAUDE.md
├── AGENTS.md
├── docs/
│   ├── architecture.md
│   ├── conventions.md
│   ├── testing.md
│   ├── i18n.md
│   ├── theming.md
│   └── extending.md
│
├── app/                              # ROUTING ONLY
│   ├── _layout.tsx                   # Root: ErrorBoundary > SafeArea > Theme > Convex > Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Tab bar (icons + i18n labels)
│   │   ├── index.tsx
│   │   └── settings.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (stack)/
│       ├── _layout.tsx
│       └── {feature}/
│           ├── index.tsx
│           └── [id].tsx
│
├── components/                       # SHARED UI
│   ├── ui/                           # ThemedText, ThemedView, Button
│   ├── layout/                       # TabBar, headers
│   └── providers/                    # ConvexProvider, ThemeProvider
│
├── features/                         # VERTICAL SLICES
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── settings/
│   │   ├── components/               # ThemeSelector, LanguageSelector
│   │   ├── hooks/
│   │   └── index.ts
│   └── {feature}/
│       ├── components/
│       ├── hooks/
│       │   ├── use-{name}.ts
│       │   └── use-{name}.web.ts     # Web variant
│       └── index.ts
│
├── convex/                           # BACKEND — same domain-folder pattern
│   ├── schema.ts
│   ├── auth/
│   │   ├── schemas.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── {domain}/
│   │   ├── schemas.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── tests/
│   ├── lib/
│   ├── crons.ts
│   ├── http.ts
│   └── _generated/
│
├── lib/
│   ├── constants.ts                  # Color tokens (light + dark)
│   └── utils.ts
│
├── hooks/                            # SHARED HOOKS
│   ├── use-color-scheme.ts
│   └── use-color-scheme.web.ts
│
├── contexts/                         # CONTEXTS (Expo-specific)
│   └── theme.tsx
│
├── i18n/
│   ├── index.ts                      # i18next init + i18nReady + helpers
│   └── locales/{locale}.json
│
├── assets/images/
├── tests/e2e/{feature}.spec.ts       # Playwright (web)
├── .maestro/                         # Mobile E2E
│   ├── config.yaml
│   ├── app-launch.yaml
│   └── {feature}.yaml
├── specs/active/ backlog/ shipped/ dropped/
│
├── package.json
├── tsconfig.json                     # expo/tsconfig.base, strict
├── app.json
├── convex.json
├── convex.config.ts                  # Component registration
├── babel.config.js
├── metro.config.cjs
├── eslint.config.js
├── .cursorrules                      # Cursor agent rules
├── .windsurfrules                    # Windsurf agent rules
├── .prettierrc
├── jest.config.cjs
├── jest.setup.js
├── playwright.config.ts
└── eas.json
```

### Full-Stack Monorepo (Web + Mobile + Convex)

Based on songtrivia (most mature vllnt monorepo):

```
my-monorepo/
├── CLAUDE.md                         # Root agent rules (monorepo-level)
├── AGENTS.md                         # Root agent playbook
├── docs/
│   ├── architecture.md               # System overview, package graph
│   ├── conventions.md                # Shared conventions
│   └── extending.md                  # Cross-platform feature guide
│
├── apps/
│   ├── web/                          # ─── NEXT.JS ───
│   │   ├── CLAUDE.md                 # Web-specific rules
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx        # Providers from @repo/client
│   │   │       ├── (marketing)/
│   │   │       ├── (auth)/
│   │   │       ├── (dashboard)/
│   │   │       └── (blog)/
│   │   ├── components/               # Web-only shared UI
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   └── providers/
│   │   ├── features/                 # Web-only feature UI
│   │   │   └── {feature}/
│   │   │       ├── components/
│   │   │       └── hooks/            # Wraps @repo/client hooks
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── i18n/                     # next-intl
│   │   ├── messages/
│   │   ├── content/
│   │   ├── tests/e2e/
│   │   ├── package.json              # depends: @repo/client, @repo/theme, @repo/shared
│   │   ├── next.config.mjs
│   │   └── playwright.config.ts
│   │
│   └── mobile/                       # ─── EXPO ───
│       ├── CLAUDE.md                 # Mobile-specific rules
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── (tabs)/
│       │   ├── (auth)/
│       │   └── (stack)/
│       ├── components/               # Mobile-only shared UI
│       │   ├── ui/
│       │   ├── layout/
│       │   └── providers/
│       ├── features/                 # Mobile-only feature UI
│       │   └── {feature}/
│       │       ├── components/
│       │       └── hooks/
│       ├── contexts/
│       ├── hooks/
│       ├── i18n/                     # i18next
│       ├── assets/
│       ├── tests/e2e/
│       ├── .maestro/
│       ├── package.json              # depends: @repo/client, @repo/theme, @repo/shared
│       └── app.json
│
├── packages/
│   ├── backend/                      # ─── CONVEX BACKEND ───
│   │   ├── convex/
│   │   │   ├── schema.ts             # Imports from domain schemas
│   │   │   ├── auth/
│   │   │   │   ├── schemas.ts        # Dual validator pattern
│   │   │   │   ├── queries.ts        # .withIndex() + bounded reads
│   │   │   │   ├── mutations.ts      # ctx.auth for identity
│   │   │   │   └── tests/
│   │   │   ├── {domain}/
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── queries.ts
│   │   │   │   ├── mutations.ts
│   │   │   │   ├── actions.ts
│   │   │   │   └── tests/
│   │   │   ├── lib/                  # Auth wrappers, shared helpers
│   │   │   ├── crons.ts
│   │   │   ├── http.ts
│   │   │   └── _generated/
│   │   ├── src/
│   │   │   └── index.ts             # Re-exports: api, Id, types, validators
│   │   ├── convex.json
│   │   ├── convex.config.ts          # Component registration (BetterAuth, Polar)
│   │   └── package.json              # name: @repo/backend
│   │
│   ├── client/                       # ─── UNIVERSAL HOOKS ───
│   │   ├── src/                      # Shared between web + mobile
│   │   │   ├── provider.tsx          # ConvexProvider (React)
│   │   │   ├── client.ts            # createConvexClient()
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts       # useAuth, useUser, useSession
│   │   │   │   ├── use-{domain}.ts   # Domain-specific hooks
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   └── index.ts             # Barrel: provider + all hooks
│   │   └── package.json              # name: @repo/client, depends: @repo/backend
│   │
│   ├── theme/                        # ─── DESIGN TOKENS ───
│   │   ├── src/
│   │   │   ├── tokens.ts            # Raw token definitions
│   │   │   ├── tailwind.ts          # Tailwind v4 export (web)
│   │   │   └── react-native.ts      # RN StyleSheet export (mobile)
│   │   └── package.json              # name: @repo/theme
│   │
│   └── shared/                       # ─── SHARED TYPES + UTILS (v2 — cut from v1, inline what's needed) ───
│       ├── src/
│       │   ├── types.ts
│       │   ├── validators.ts         # Shared Zod schemas
│       │   └── utils.ts
│       └── package.json              # name: @repo/shared
│       # NOTE: @repo/shared is scaffolded as empty shell. Populate in v2 when concrete shared code exists.
│
├── specs/active/ backlog/ shipped/ dropped/
│
├── turbo.json                        # Build: backend → client → apps (FRESH — not copied from songtrivia)
├── pnpm-workspace.yaml               # ["apps/*", "packages/*"]
├── package.json                      # Root workspace
├── eslint.config.js
├── .cursorrules                      # Cursor agent rules (monorepo-level)
├── .windsurfrules                    # Windsurf agent rules (monorepo-level)
├── .prettierrc
└── tsconfig.json                     # Base config
```

### Monorepo Dependency Graph

```
@repo/shared ──┐
               ├──▶ @repo/backend ──▶ @repo/client ──┐
@repo/theme ───┘                                      │
                                      ┌───────────────┤
                                      ▼               ▼
                                 apps/web        apps/mobile
                              (Next.js 16)       (Expo 55)

Shared: @repo/client (hooks+provider), @repo/theme
Platform-specific: features/, components/, i18n/ (different libs)
Note: @repo/shared scaffolded as empty shell — populate when concrete shared code exists (v2)
```

## Structural Rules

| Rule | Why |
|------|-----|
| `app/` = routing only, no business logic | Thin routes, composable features |
| `components/` = shared UI used by 2+ features | Clear ownership, no orphans |
| `features/{name}/` = self-contained vertical slice | Co-located, easy to delete |
| `features/{name}/components/` = feature-scoped UI | Never leaks outside feature |
| `hooks/` at root = cross-feature only | Single-feature hooks go in `features/` |
| `convex/{domain}/` = schemas + queries + mutations + tests | Convex skill domain pattern |
| `@repo/client` = universal hooks (monorepo) | One import for web AND mobile |
| Routes import from `features/`, never `convex/` | Features wrap Convex calls |
| No business logic in `components/` | Logic in `features/*/hooks/` or `lib/` |
| Every page has `generateMetadata()` (web) | SEO enforcement |
| Every screen has `testID` props (mobile) | E2E testing enforcement |
| Server Components by default (web) | Only add "use client" when needed |

## User Journey (MANDATORY)

### Primary Journey — Scaffold (Human)

ACTOR: Developer starting a new project
GOAL: Scaffold production-ready app with agent contract in <30 seconds
PRECONDITION: Node >=22, npm/pnpm/yarn/bun available

1. User runs `npx create-vllnt-app`
   → System displays ASCII art title + version
   → User sees branded welcome

2. User enters project name
   → System validates (npm naming rules, no directory conflict)
   → User enters "my-app"

3. User selects mode: Web (Next.js) / Mobile (Expo) / Full Stack (Monorepo)
   → System shows what each includes
   → User selects "Full Stack"

4. User selects package manager (auto-detected, overridable)
   → User confirms pnpm

5. System scaffolds project
   → Copies template → configures → generates CLAUDE.md + AGENTS.md + docs/
   → Inits git → installs deps
   → User sees progress per step

6. System displays next steps
   → `cd my-app && pnpm dev`
   → "Add features: vllnt add auth"
   → "Generate code: vllnt generate feature dashboard"
   → "Agent contract ready: CLAUDE.md + AGENTS.md"

POSTCONDITION: Project exists with template, agent docs, Convex setup, deps installed

### Primary Journey — Scaffold (Agent)

ACTOR: AI coding agent creating project for user
GOAL: Scaffold with machine-readable output
PRECONDITION: Node >=22, CLI available

1. Agent runs `vllnt new my-app --template fullstack --yes --agent`
   → No prompts, JSON output: `{ "success": true, "path": "./my-app", "template": "fullstack", "files": [...] }`

2. Agent reads CLAUDE.md → follows rules for all subsequent code
POSTCONDITION: Agent has project + rules

### Primary Journey — Generate Code (Agent)

ACTOR: AI coding agent adding a feature
GOAL: Generate properly structured code following conventions
PRECONDITION: Inside vllnt project

1. Agent runs `vllnt generate feature auth --agent`
   → Detects project type → generates vertical slice
   → Returns JSON: `{ "success": true, "files": { "created": [...], "modified": [...] } }`

2. Agent fills in business logic following generated stubs
POSTCONDITION: Feature skeleton with correct conventions, tests, i18n

### Primary Journey — Generate Convex Domain (Agent)

ACTOR: AI coding agent adding backend domain
GOAL: Generate Convex domain following dual-validator pattern
PRECONDITION: Inside vllnt project with convex/

1. Agent runs `vllnt generate domain billing --agent`
   → Creates convex/billing/{schemas,queries,mutations,tests/}
   → schemas.ts has dual validator pattern (data + document)
   → queries.ts uses .withIndex() + .take(n) + returns validators
   → mutations.ts uses ctx.auth for identity
   → Returns JSON with created files

2. Agent runs `vllnt generate domain billing --with-actions --with-workflows`
   → Also creates actions.ts (Node.js runtime) and workflows.ts (@convex-dev/workflow)
POSTCONDITION: Domain folder with correct Convex patterns

### Primary Journey — Landing Page

ACTOR: Developer discovering create-vllnt-app
GOAL: Understand value, copy install command

1. User visits landing page
   → Hero: "Build software that scales. Agent-first." + CLI command

2. User scrolls to "How it works"
   → Step 1: Scaffold (3 modes) → Step 2: Generate → Step 3: Ship

3. User scrolls to templates
   → Web card | Mobile card | Full Stack card with features

4. User scrolls to "Agent-First"
   → Explains CLAUDE.md, AGENTS.md, how agents use the project

5. User scrolls to generators
   → `vllnt add` features + `vllnt generate` types

POSTCONDITION: User runs CLI

### Error Journeys

E1. Invalid project name
   Trigger: Invalid chars, reserved name, existing non-empty directory
   1. User enters "my app" → System: "Invalid name: lowercase, no spaces. Try: my-app"
   Recovery: Prompt re-appears

E2. Not in vllnt project (add/generate)
   Trigger: Running `vllnt add/generate` outside vllnt project
   1. Agent runs `vllnt add auth` → System: `{ "error": "NOT_VLLNT_PROJECT" }`
   Recovery: Navigate to project or scaffold first

E3. Generator file conflict
   Trigger: Generated file would overwrite existing
   1. Agent runs `vllnt generate page /dashboard` but exists
      → Agent mode: `{ "error": "FILE_EXISTS", "files": [...] }`
      → Interactive: "Overwrite? (y/N)"
   Recovery: Confirm or rename

E4. Wrong generator for project type
   Trigger: Expo-only generator in Next.js project (or vice versa)
   1. `vllnt generate screen Settings` in Next.js → "Use 'vllnt generate page' for Next.js"
   Recovery: Use correct generator

E5. Network failure during install
   Trigger: pnpm install fails
   1. System: "Install failed. Run: cd my-app && pnpm install"
   Recovery: Manual install

### Edge Cases

EC1. Ctrl+C mid-scaffold: Cleanup partial directory
EC2. Git not installed: Skip init, warn
EC3. `vllnt add` twice for same feature: Idempotent
EC4. Monorepo detection in `vllnt add`: Adjust paths for workspace
EC5. --agent implies --yes: No interactive prompts

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

**Phase 1 — Scaffold**
- [ ] AC-1: GIVEN `vllnt new my-app --template web` WHEN completed THEN Next.js + Convex project created, `pnpm dev` works
- [ ] AC-2: GIVEN `vllnt new my-app --template mobile` WHEN completed THEN Expo + Convex project created, `pnpm start` works
- [ ] AC-3: GIVEN `vllnt new my-app --template fullstack` WHEN completed THEN monorepo with apps/web + apps/mobile + packages/backend created
- [ ] AC-4: GIVEN `--yes --agent` flags WHEN running THEN no prompts, JSON output
- [ ] AC-5: GIVEN scaffold completes WHEN checking THEN CLAUDE.md exists with: file conventions, Convex rules, Next.js/Expo rules, testing rules, i18n rules
- [ ] AC-6: GIVEN scaffold completes WHEN checking THEN AGENTS.md exists with: architecture, extension table, common tasks, pitfalls
- [ ] AC-7: GIVEN scaffold completes WHEN checking THEN docs/ has 6 files (architecture, conventions, testing, i18n, theming, extending)
- [ ] AC-8: GIVEN scaffold completes WHEN checking THEN `features/` and `components/` directories exist with correct structure
- [ ] AC-9: GIVEN scaffold completes WHEN checking THEN `convex/` has domain-folder structure with auth/ domain
- [ ] AC-5b: GIVEN scaffold completes WHEN checking THEN .cursorrules and .windsurfrules exist (derived from CLAUDE.md rules)
- [ ] AC-9b: GIVEN scaffold completes WHEN checking THEN `convex.config.ts` exists with component registration pattern

**Phase 2 — Generators**
- [ ] AC-10: GIVEN `vllnt generate page /dashboard` in web WHEN run THEN creates page.tsx + layout + test + i18n keys in correct paths
- [ ] AC-11: GIVEN `vllnt generate screen Settings` in mobile WHEN run THEN creates screen + nav entry + test + i18n keys
- [ ] AC-12: GIVEN `vllnt generate component Button` WHEN run THEN creates in components/ui/ with test + story stub
- [ ] AC-13: GIVEN `vllnt generate feature auth` WHEN run THEN creates features/auth/ with components/ + hooks/ + lib/ + index.ts + tests + i18n
- [ ] AC-14: GIVEN `vllnt generate domain billing` WHEN run THEN creates convex/billing/ with schemas.ts (dual validators) + queries.ts (.withIndex) + mutations.ts (ctx.auth) + tests/
- [ ] AC-15: GIVEN any generator with `--agent` WHEN run THEN returns JSON with file paths

**Phase 3 — Feature Adders**
- [ ] AC-16: GIVEN `vllnt add auth` WHEN run THEN installs deps, generates feature files, updates CLAUDE.md, generates docs/auth.md
- [ ] AC-17: GIVEN `vllnt add` for any feature WHEN complete THEN CLAUDE.md updated with feature rules
- [ ] AC-18: GIVEN `vllnt add` for any feature WHEN complete THEN docs/{feature}.md generated

**Phase 4 — Docs & Landing**
- [ ] AC-19: GIVEN `vllnt doctor` WHEN run THEN checks deps, config, agent docs, Convex setup
- [ ] AC-20: GIVEN landing page WHEN visited THEN shows hero, modes, templates, agent-first, generators

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN invalid project name WHEN entered THEN error + re-prompt
- [ ] AC-E2: GIVEN `vllnt add/generate` outside project WHEN run THEN clear error
- [ ] AC-E3: GIVEN file conflict WHEN generating THEN warns (interactive) or errors (agent)
- [ ] AC-E4: GIVEN wrong generator for platform WHEN run THEN suggests correct one
- [ ] AC-E5: GIVEN install fails WHEN network error THEN files preserved + manual command

### Should Have

- [ ] AC-22: GIVEN any pkg manager (npm/pnpm/yarn/bun) WHEN detected THEN used
- [ ] AC-23: GIVEN `vllnt add` twice WHEN run THEN idempotent
- [ ] AC-24: GIVEN `vllnt generate api /users` in web WHEN run THEN creates route handler + Zod + test

## Scope

### Phase 1 — Scaffold Core + Landing (28h) — revised from 10h (includes landing page)
- [ ] 1. Monorepo setup (turbo.json FRESH — not copied from songtrivia, pnpm-workspace.yaml) → AC-1, AC-2, AC-3
- [ ] 2. CLI entry point + command router (commander) → AC-4
- [ ] 3. `vllnt new` prompts (name, template: web/mobile/fullstack, pkg manager) → AC-1, AC-2, AC-3, AC-E1
- [ ] 4. Scaffold engine (copy template, configure, post-process) → AC-1, AC-2, AC-3, AC-E5
- [ ] 5. Embed web template (next-template snapshot) → AC-1
- [ ] 6. Embed mobile template (expo-template snapshot) → AC-2
- [ ] 7. Fullstack scaffold (monorepo with apps/ + packages/) → AC-3
- [ ] 8. Agent contract generator (CLAUDE.md + .cursorrules + .windsurfrules + AGENTS.md + docs/) → AC-5, AC-5b, AC-6, AC-7
- [ ] 9. Restructure templates to features/ + components/ pattern → AC-8
- [ ] 10. Convex domain scaffold (auth/ with dual validators + convex.config.ts) → AC-9, AC-9b
- [ ] 11. Non-interactive + agent mode (--yes, --agent JSON) → AC-4
- [ ] 12. CLI packaging (tsup, bin, npm config) → AC-1
- [ ] 12b. Template size spike — measure embedded templates, verify <20MB → risk mitigation
- [ ] 12c. Landing page alpha (hero, modes, agent-first, CLI command, generators) → AC-20
- [ ] 12d. Landing page deployment → AC-20

### Phase 2 — Generators (20h) — revised from 12h
- [ ] 13. Generator engine (blueprint → interpolate → write) → AC-10
- [ ] 14. Project type detector (web/mobile/monorepo from config) → AC-E2, AC-E4
- [ ] 15. Blueprint: page (Next.js — page + layout + loading + test + i18n) → AC-10
- [ ] 16. Blueprint: screen (Expo — screen + nav + test + i18n) → AC-11
- [ ] 17. Blueprint: component (shared — component + test + story) → AC-12
- [ ] 18. Blueprint: hook (shared — hook + test) → AC-13
- [ ] 19. Blueprint: api route (Next.js — handler + Zod + test) → AC-24
- [ ] 20. Blueprint: feature (vertical slice in features/) → AC-13
- [ ] 21. Blueprint: domain (Convex — schemas + queries + mutations + tests) → AC-14
- [ ] 22. Agent mode for all generators → AC-15

### Phase 3 — Feature Adders (24h) — revised from 14h (auth alone ~8-10h)
- [ ] 23. Feature adder engine (install deps, generate files, update agent docs) → AC-16
- [ ] 24. `vllnt add auth` — BetterAuth + Convex adapter (convex.config.ts + auth.config.ts + http.ts routes + features/auth/ + middleware + auth-client.ts) → AC-16, AC-17, AC-18
- [ ] 25. `vllnt add analytics` — @vllnt/analytics + provider + hooks → AC-17, AC-18
- [ ] 26. `vllnt add payments` — Polar.sh via @convex-dev/polar + features/payments/ → AC-17, AC-18
- [ ] 27. CLAUDE.md updater (append feature rules) → AC-17
- [ ] 28. Feature idempotency → AC-23

### Phase 4 — Doctor & Polish (8h) — revised from 16h (docs check/sync cut to v2, landing moved to Phase 1)
- [ ] 29. `vllnt doctor` — health check → AC-19

### Out of Scope

- `vllnt docs check/sync` (agent doc validation) — v2
- Plugin system (third-party generators) — v2
- `vllnt upgrade` (migrate existing projects) — v2
- `vllnt init` (add vllnt to existing project) — v2
- GUI / web dashboard
- CI/CD pipeline generation — v2
- Database migration generators — v2
- VSCode extension — v2
- `vllnt eject` — opinionated means no ejection
- Template customization prompts — stack is fixed (Next.js/Expo/Convex/Turborepo)
- Alternative backend support (Supabase, Firebase, etc.) — Convex only
- Alternative framework support (Remix, Nuxt, Flutter, etc.) — Next.js + Expo only
- @vllnt/ui for React Native — web only for now

### Post-Ship Cleanup

- [ ] Delete vllnt/expo-template repo (archived, point README to create-vllnt-app)
- [ ] Delete vllnt/next-template repo (archived, point README to create-vllnt-app)
- [ ] Update vllnt.com and bntvllnt.com references to point to CLI

## Quality Checklist

### Blocking

- [ ] E2E registry 36/36 BLOCKING entries GREEN_CONFIRMED (100%)
- [ ] TDD proof: all GREEN entries have prior RED_CONFIRMED
- [ ] Cross-scaffold: structural tests pass for web + mobile + fullstack
- [ ] CLI exits 0 on success, non-zero on failure
- [ ] Scaffolded projects run dev server without errors (all 3 modes)
- [ ] Generated files follow features/ + components/ structure
- [ ] Convex domain files follow dual-validator + withIndex + ctx.auth patterns
- [ ] CLAUDE.md is <200 lines, BLOCKING rules first, includes Convex + platform rules
- [ ] .cursorrules + .windsurfrules have rule parity with CLAUDE.md
- [ ] --agent mode returns valid JSON for every command
- [ ] No hardcoded secrets

### Advisory

- [ ] All Should Have ACs passing
- [ ] CLI cold start <2s
- [ ] Generator execution <1s per file
- [ ] Landing page Lighthouse >=90

## Test Strategy (MANDATORY — 100% E2E COVERAGE ENFORCED)

**Registry:** `specs/active/2026-03-11-create-vllnt-app-e2e.md`
**Coverage target:** 36/36 BLOCKING entries GREEN_CONFIRMED (100%)
**TDD enforcement:** RED_CONFIRMED required before GREEN_CONFIRMED (BLOCKING)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | not configured | Vitest |
| CLI E2E | not configured | Vitest + execa (real fs, tmp dirs) |
| Browser E2E | not configured | Playwright (landing page only) |
| Test DB | N/A | No database in CLI |
| Mock inventory | 0 | Greenfield |

### Coverage Summary

| Category | Total | BLOCKING | Advisory |
|----------|-------|----------|----------|
| Must Have ACs | 22 | 22 | 0 |
| Error ACs | 5 | 5 | 0 |
| Should Have ACs | 3 | 0 | 3 |
| Failure Hypotheses | 9 | 9 | 0 |
| Edge Cases | 5 | 0 | 5 |
| **Total** | **44** | **36** | **8** |

### Test Files

| File | ACs Covered | Type |
|------|-------------|------|
| `tests/e2e/scaffold-web.spec.ts` | AC-1, AC-5, AC-5b, AC-6, AC-7, AC-8, AC-9, AC-9b | CLI E2E |
| `tests/e2e/scaffold-mobile.spec.ts` | AC-2, AC-5, AC-5b, AC-6, AC-7, AC-8, AC-9, AC-9b | CLI E2E |
| `tests/e2e/scaffold-fullstack.spec.ts` | AC-3, AC-5, AC-5b, AC-6, AC-7, AC-8, AC-9, AC-9b | CLI E2E |
| `tests/e2e/agent-mode.spec.ts` | AC-4, AC-15 | CLI E2E |
| `tests/e2e/generator-page.spec.ts` | AC-10 | CLI E2E |
| `tests/e2e/generator-screen.spec.ts` | AC-11 | CLI E2E |
| `tests/e2e/generator-component.spec.ts` | AC-12 | CLI E2E |
| `tests/e2e/generator-feature.spec.ts` | AC-13 | CLI E2E |
| `tests/e2e/generator-domain.spec.ts` | AC-14 | CLI E2E |
| `tests/e2e/adder-auth.spec.ts` | AC-16, AC-17, AC-18 | CLI E2E |
| `tests/e2e/doctor.spec.ts` | AC-19 | CLI E2E |
| `tests/e2e/landing-page.spec.ts` | AC-20 | Playwright browser |
| `tests/e2e/error-handling.spec.ts` | AC-E1, AC-E2, AC-E3, AC-E4, AC-E5 | CLI E2E |
| `tests/e2e/failure-modes.spec.ts` | FH-1 through FH-9 | CLI E2E |
| `tests/e2e/edge-cases.spec.ts` | EC-1 through EC-5 | CLI E2E (advisory) |
| `tests/e2e/should-have.spec.ts` | AC-22, AC-23, AC-24 | CLI E2E (advisory) |

### Cross-Scaffold Coverage (BLOCKING)

Every scaffold mode (web, mobile, fullstack) independently verifies:
- CLAUDE.md + .cursorrules + .windsurfrules exist
- AGENTS.md + docs/ (6 files) exist
- features/ + components/ structure correct
- convex/ domain-folder + convex.config.ts present
- Dev server starts without errors
- --agent JSON output valid

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| File system | Real (tmp dir) | Accurate testing — NEVER mock fs |
| Git | Real | Test init behavior |
| Package install | Mock | Network-dependent — `// MOCK: no network in CI` |
| Terminal/stdin | Mock | No interactive in tests — `// MOCK: stdin not available` |
| Convex CLI | Mock | Requires Convex account — `// MOCK: no Convex credentials in CI` |

### Enforcement Rules (BLOCKING)

1. **No scope item marked complete** without its AC tests GREEN_CONFIRMED
2. **No phase marked complete** without all phase AC tests GREEN_CONFIRMED
3. **RED before GREEN** — test must fail before implementation, pass after
4. **Cross-scaffold** — structural tests run for ALL 3 modes, not just one
5. **Content verification** — tests verify file content/patterns, not just existence
6. **Ship exit gate** — 36/36 BLOCKING entries GREEN_CONFIRMED required for `done`

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CLI >15MB from embedded templates | MED | MED | Strip non-essential; degit fallback; Phase 1 size spike (item 12b) |
| CLAUDE.md >200 lines | HIGH | MED | Split: CLAUDE.md (rules, BLOCKING first) + AGENTS.md (playbook) + docs/ (detail) |
| features/ restructure breaks template behavior | HIGH | MED | E2E test: scaffold → dev server works |
| Convex rules in CLAUDE.md conflict with template code | HIGH | MED | Test: agent follows rules, code compiles |
| Monorepo scaffold complexity (turbo, workspaces, cross-deps) | HIGH | MED | Base on songtrivia pattern but build turbo.json FRESH with @repo/* names |
| Feature adders assume specific project state | MED | MED | Marker comments for insertion points |
| BetterAuth integration complexity (6 files, component registration) | HIGH | MED | Full architecture defined in spec; E2E test auth flow |
| Template repos deleted → no rollback | MED | LOW | Archive (don't delete), keep git history. Point README to CLI |
| Multi-agent file drift (.cursorrules vs CLAUDE.md) | MED | MED | Generate all agent files from single source template; test parity |
| `vllnt docs check/sync` undefined validation rules | MED | HIGH | Cut to v2 |
| Expo SDK version hardcoded in template | LOW | HIGH | Use latest stable at scaffold time, not hardcoded |

**Kill criteria:**
- Phase 1 >15h → cut fullstack mode to v2 (ship web+mobile standalone only)
- Templates >20MB → pivot to runtime GitHub fetch
- Generator engine >10h → simplify to file copy (no interpolation)

## State Machine

```
vllnt CLI
  │
  ├── "new"  ────▶ PROMPT → SCAFFOLD → POST(git,deps,docs) → DONE
  ├── "add"  ────▶ DETECT → GENERATE → UPDATE(deps,docs) → DONE
  ├── "gen"  ────▶ DETECT → VALIDATE → WRITE → DONE
  └── "doctor" ──▶ DIAGNOSE → DONE
```

Complexity: MEDIUM (multiple linear paths, no concurrent state)
→ Command pattern with sequential functions. No XState needed.

## Analysis

### Assumptions Challenged

| # | Assumption | Evidence For | Evidence Against | Verdict | Action |
|---|------------|-------------|-----------------|---------|--------|
| 1 | features/ pattern works for both templates | songtrivia (web) uses it successfully | expo-template currently uses flat components/ — restructure needed | VALID | → restructure templates to features/ before embedding |
| 2 | 3 scaffold modes at launch | Users need web, mobile, and fullstack | Fullstack monorepo is complex; could ship web+mobile first | RISKY | → have fallback to cut fullstack to v2 if Phase 1 >15h |
| 3 | Convex is always included | All vllnt products use Convex; it's the backend | Some users may want no backend or different backend | VALID | → vllnt is opinionated. No backend option = use create-next-app |
| 4 | Agent contract (CLAUDE.md) is the main value | Expo-template already proves this with AGENTS.md | Competitors don't have it and are still successful | VALID | → this is the differentiator |
| 5 | Handlebars for blueprints | Simple vars + conditionals sufficient | Can't do AST manipulation | VALID | → keep blueprints simple for v1 |
| 6 | **48h estimate is achievable** | 4 phases scoped, existing templates to draw from | Auth adder alone ~8-10h, 33 scope items, template embedding + 7 generators + 5 adders + landing page + agent contracts | **WRONG** | → revised to 80-100h (or cut scope) |
| 7 | **BetterAuth integrates via simple `vllnt add auth`** | BetterAuth docs show Convex adapter exists | Missing convex.config.ts component registration, auth.config.ts, HTTP route registration, session management — none were in spec | **RISKY** | → added BetterAuth architecture section |
| 8 | **`convex.config.ts` is implicit** | Simple Convex apps don't need it | Every Convex component (BetterAuth, Polar, workpool) requires `convex.config.ts` with `app.use()` — was absent from ALL scaffold trees | **WRONG** | → added to all 3 scaffold trees |
| 9 | **turbo.json from songtrivia is reusable** | "Based on songtrivia architecture" | songtrivia uses different package names; turbo.json pipeline refs are repo-specific | **WRONG** | → turbo.json must be built fresh with @repo/* namespace |
| 10 | **CLAUDE.md alone covers agent ecosystem** | Claude is dominant agent | Cursor (.cursorrules), Windsurf (.windsurfrules), Copilot all read different files | **RISKY** | → added multi-agent file generation |
| 11 | **@repo/shared package is needed in v1** | Spec includes it in fullstack tree | No concrete shared code identified; shared packages become junk drawers; YAGNI | **RISKY** | → scaffold as empty shell, populate in v2 |

### Blind Spots

| # | Category | Blind Spot | Impact If Ignored | Suggested Spec Change |
|---|----------|-----------|-------------------|----------------------|
| 1 | [architecture] | `convex.config.ts` missing from all scaffold trees | Auth/payments adders silently fail | **FIXED** — added to all trees |
| 2 | [auth] | BetterAuth requires auth.config.ts, http.ts route, session, middleware | `vllnt add auth` produces non-functional scaffold | **FIXED** — added architecture section |
| 3 | [agent-compat] | Only CLAUDE.md generated — no .cursorrules, .windsurfrules | 60%+ of agent users get no contract | **FIXED** — added to scope + trees |
| 4 | [agent-quality] | Rule ordering in CLAUDE.md not addressed — agents weight early rules higher | Critical rules get ignored | **FIXED** — BLOCKING rules first strategy |
| 5 | [maintenance] | Blueprints need updating when templates update | O(n) per template change | Acknowledged — mitigate with E2E tests |
| 6 | [migration] | No path from existing vllnt template projects | Users with cloned templates can't use generators | v2 (`vllnt init`) |
| 7 | [convex] | Convex `_generated/` handling in monorepo | `npx convex dev` needs correct convex/ path | Explore during Phase 1 item 7 |
| 8 | [dx] | No `vllnt upgrade` command | Users stuck on v1 scaffold | v2 — acknowledged in backlog |
| 9 | [testing] | `vllnt docs check` — no spec for HOW it validates | Ships broken or gets cut | → define validation rules or cut from v1 |
| 10 | [mobile] | Expo SDK version hardcoded | Template outdated within months | Use latest stable at scaffold time |

### Failure Hypotheses

| # | IF | THEN | BECAUSE | Severity | Mitigation Status |
|---|-----|------|---------|----------|-------------------|
| 1 | BetterAuth scaffolded without convex.config.ts + http.ts | Auth doesn't work out-of-box | Component registration is mandatory | **CRITICAL** | **FIXED** — architecture section added |
| 2 | Scope stays at 33 items with original 48h estimate | Phases 3-4 rushed or cut | Actual effort 80-100h | **HIGH** | **FIXED** — estimate revised |
| 3 | Only CLAUDE.md generated, no .cursorrules | Cursor/Windsurf users get zero agent value | Agent ecosystem fragmented | **HIGH** | **FIXED** — multi-agent files added |
| 4 | turbo.json copied from songtrivia without rewrite | Monorepo has broken build pipeline | Package names are repo-specific | **HIGH** | **FIXED** — scope updated: build fresh |
| 5 | CLAUDE.md >500 lines | Agents ignore rules | Context window competition | HIGH | Mitigated: <200 lines target, AGENTS.md + docs/ for detail |
| 6 | features/ restructure breaks template behavior | Scaffolded project doesn't work | Import paths change | HIGH | Mitigated: E2E test scaffold → dev server |
| 7 | Template size >20MB, degit fallback hits rate limits | `vllnt new` fails for unauthenticated users | GitHub API rate-limits degit | MED | Partially: degit fallback exists + spike added |
| 8 | `vllnt docs sync` ships without validation rules | Command does nothing useful | No spec for what "sync" means | MED | Missing — needs definition or cut |
| 9 | Generated Convex code doesn't match skill rules | Agent writes non-compliant code | Blueprint diverges from skill | MED | Mitigated: CI test with convex-guardian |

### The Real Question

Is this a CLI tool or a framework? **It's a framework delivered as a CLI.** The real product is the agent contract + conventions. The CLI is the delivery mechanism. The features/ + components/ + convex/ structure is the opinion. The agent docs are what make it work.

The spec review revealed the agent contract should target ALL major agents (not just Claude) — this is the primary differentiator. Multi-agent file generation (.cursorrules, .windsurfrules alongside CLAUDE.md) makes this the first scaffold tool that treats ALL AI agents as first-class citizens.

**Recommendation:** Phase 1 (scaffold + agent contract + features/ structure) is the MVP. If the agent contract is excellent and the structure is right, even without generators, the tool is valuable. The 3 critical gaps (BetterAuth architecture, convex.config.ts, multi-agent files) are now addressed in the spec.

### Open Items

- ~~[question] Is @vllnt/ui published to npm?~~ → RESOLVED: yes, web only
- ~~[gap] convex.config.ts missing~~ → RESOLVED: added to all scaffold trees
- ~~[gap] BetterAuth integration undefined~~ → RESOLVED: architecture section added
- ~~[gap] No multi-agent file generation~~ → RESOLVED: .cursorrules + .windsurfrules added
- ~~[risk] 48h estimate vs scope~~ → RESOLVED: revised to 80-100h
- ~~[gap] turbo.json not portable~~ → RESOLVED: scope updated to build fresh
- [risk] Template size after embedding → explore in Phase 1 spike (item 12b)
- [risk] CLAUDE.md length → target <200 lines, BLOCKING rules first → explore
- ~~[question] `vllnt docs check/sync`~~ → RESOLVED: cut to v2
- [gap] No `vllnt init` for existing projects → v2 → no action
- [gap] Convex `_generated/` handling in monorepo mode → explore during Phase 1 item 7
- ~~[improvement] Landing page earlier~~ → RESOLVED: moved to Phase 1 (alpha mode)
- [improvement] Auto-run convex-guardian on generated code → Phase 2 enhancement → no action
- [risk] Template repo deletion timing → archive first, delete after CLI stable on npm → no action

## Notes

Decision log:
- Stack is FIXED: Next.js + Expo + Convex + Turborepo. No alternatives. No choices.
- Auth = BetterAuth (with Convex adapter). No other auth providers.
- Payments = Polar.sh via @convex-dev/polar. Convex-native.
- Analytics = @vllnt/analytics. Own package.
- CLI IS the template distribution. vllnt/expo-template and vllnt/next-template repos get archived → deleted after CLI stable on npm.
- @vllnt/ui is on npm but web-only. Web scaffold + landing page use it. Mobile uses custom ThemedText/ThemedView primitives.
- Chose features/ + components/ split over flat components/ (user feedback + songtrivia pattern)
- Chose 3 scaffold modes (web/mobile/fullstack) over 2 (user request for monorepo)
- Convex rules baked from agent-skills/convex skill (dual validators, withIndex, ctx.auth, domain folders)
- Next.js rules baked from advisor/rauch patterns (Server Components default, colocate fetching, Server Actions)
- Monorepo pattern based on songtrivia (packages/backend + client + theme + shared)
- No XState/Effect — command pattern with sequential functions
- Handlebars for blueprint rendering — simple interpolation, complex logic in generator code

**Spec review applied: 2026-03-11** — 5 perspectives (Developer Advocate, Systems Architect, AI Agent Researcher, Convex Domain Expert, Skeptic). 3 critical gaps fixed (BetterAuth architecture, convex.config.ts, multi-agent files). Estimate revised 48h → 80-100h.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1-12d | Phase 1 — Scaffold Core + Landing (28h) | pending | - |
| 13-22 | Phase 2 — Generators (20h) | pending | - |
| 23-28 | Phase 3 — Feature Adders (24h) | pending | - |
| 29 | Phase 4 — Doctor & Polish (8h) | pending | - |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan v1 | 2026-03-11T13:35:00Z | - | Initial scaffold-only spec |
| plan v2 | 2026-03-11T14:00:00Z | - | Agent-first CLI platform |
| plan v3 | 2026-03-11T15:00:00Z | - | features/ + components/ + Convex integration + 3 scaffold modes + convex/next skill rules |
| plan v4 | 2026-03-11T16:00:00Z | - | Fixed stack decisions: BetterAuth, Polar, @vllnt/analytics. CLI replaces template repos. @vllnt/ui web-only confirmed. |
| spec-review | 2026-03-11T17:00:00Z | - | 5-perspective adversarial review. Fixed: BetterAuth arch, convex.config.ts, multi-agent files, estimate 48h→80-100h, turbo.json fresh build, @repo/shared→v2 |
