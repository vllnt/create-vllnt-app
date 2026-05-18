# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-03-24

### Added

- CLI scaffolder with composable sections (landing, blog, dashboard, auth, docs, admin)
- 10 presets: landing, blog, marketing, saas, saas-blog, full-saas, dashboard, admin, docs, custom
- `vllnt doctor` health check with `--json` output for AI agents
- Agent-first contracts: CLAUDE.md, AGENTS.md, vllnt.json in every scaffold
- @vllnt/eslint-config strict rules (errors-only, no warnings)
- TypeScript strict mode with zero-error guarantee
- Convex backend support (optional, `--skip-backend` to omit)
- File-based OG images + sitemap + robots.txt for www landing page
- Landing page with @vllnt/ui components and live GitHub stars
- CI pipeline: lint + typecheck + build + test on PRs
- Publish workflow: canary on push, release on dispatch
