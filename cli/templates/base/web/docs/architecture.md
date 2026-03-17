# Architecture

## Overview

{{projectName}} is a Next.js application with a Convex reactive backend, following a feature-sliced architecture.

## Layers

```
┌─────────────────────────────────────┐
│           App Router (pages)        │  Route handlers, layouts, metadata
├─────────────────────────────────────┤
│         Features (slices)           │  Vertical: UI + hooks + logic per domain
├─────────────────────────────────────┤
│        Components (shared UI)       │  Design system, layout shells, providers
├─────────────────────────────────────┤
│           Lib (utilities)           │  Schemas, helpers, constants
├─────────────────────────────────────┤
│         Convex (backend)            │  Queries, mutations, actions, schema
└─────────────────────────────────────┘
```

## Data Flow

1. Pages render Server Components (static) + Client Components (interactive)
2. Client Components use `useQuery`/`useMutation` from Convex React
3. Convex functions run on the server — queries are reactive (real-time)
4. Schema + validators enforce type safety at the database boundary

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Feature-sliced architecture | Vertical slices = isolated, deletable features |
| Convex over REST/GraphQL | Real-time by default, no API layer to maintain |
| next-intl | Type-safe i18n with server component support |
| Tailwind v4 | Utility-first, zero runtime CSS |
| Domain folders in convex/ | Colocates schema + queries + mutations per domain |
