# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-06-10

First public release.

### Added

- CLI scaffolder with composable sections assembled at init time: landing, blog, dashboard, auth, docs, admin
- 10 presets: landing, blog, marketing, saas, saas-blog, full-saas, dashboard, admin, docs, custom
- Convex backend modes: `--convex cloud` (managed convex.dev) or `--convex self-hosted` (docker-compose + dashboard + `docs/self-hosting.md`); `--skip-backend` to omit entirely
- `vllnt doctor` health check with `--for <section>` preflights and `--json` output for AI agents
- Agent mode: `--agent` flag returns machine-readable JSON for CI/CD pipelines and AI agents
- Agent-first contracts in every scaffold: CLAUDE.md, AGENTS.md, and the vllnt.json section registry
- Strict guardrails: @vllnt/eslint-config (errors-only), TypeScript strict mode, zero-error scaffold guarantee
- Package manager detection and selection: npm, pnpm, yarn, bun
- Landing page (www) with @vllnt/ui, next-intl i18n, file-based OG images, sitemap, robots.txt, and standalone output for self-hosted deployments
- CI pipeline: production-scoped dependency audit, lint, typecheck, unit + E2E tests, and www build on every PR
- Publish pipeline: canary releases on push to main, tagged releases on dispatch with changelog-driven release notes
