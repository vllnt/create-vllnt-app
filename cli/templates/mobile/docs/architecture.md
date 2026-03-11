# Architecture

## Overview

{{projectName}} is an Expo (React Native) application with a Convex reactive backend, following a feature-sliced architecture.

## Layers

```
┌─────────────────────────────────────┐
│        Expo Router (screens)        │  Route handlers, layouts, navigation
├─────────────────────────────────────┤
│         Features (slices)           │  Vertical: UI + hooks + logic per domain
├─────────────────────────────────────┤
│        Components (shared UI)       │  Design primitives, layout shells
├─────────────────────────────────────┤
│     Contexts / Hooks / Lib          │  Theme, shared hooks, utilities
├─────────────────────────────────────┤
│         Convex (backend)            │  Queries, mutations, actions, schema
└─────────────────────────────────────┘
```

## Data Flow

1. Screens render React Native components with Expo Router navigation
2. Components use `useQuery`/`useMutation` from Convex React
3. Convex functions run on the server — queries are reactive (real-time)
4. Schema + validators enforce type safety at the database boundary

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Feature-sliced architecture | Vertical slices = isolated, deletable features |
| Expo Router | File-based routing, typed routes, web support |
| Convex over REST | Real-time by default, no API layer to maintain |
| i18next | Mature i18n with React Native support |
| StyleSheet + tokens | Native performance, theme-aware colors |
