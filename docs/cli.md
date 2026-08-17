# CLI Reference

## Commands

### `create-vllnt-app [name] [options]`

Scaffold a new project.

| Option | Description |
|--------|-------------|
| `-p, --preset <preset>` | Project preset (saas, landing, blog, marketing, saas-blog, full-saas, dashboard, admin, docs) |
| `--sections <sections>` | Comma-separated sections for custom preset |
| `--skip-backend` | Skip Convex backend setup |
| `--convex <mode>` | Convex backend mode: `cloud` or `self-hosted`. Required when a backend is included (no default — prompts interactively, errors in `--yes`/`--agent` if omitted) |
| `-y, --yes` | Skip prompts, use defaults |
| `--agent` | Machine-readable JSON output (implies --yes) |
| `--package-manager <pm>` | npm, pnpm, yarn, or bun |
| `--skip-install` | Skip dependency installation |

### `vllnt doctor`

Run health checks on a scaffolded project.

| Option | Description |
|--------|-------------|
| `--for <section>` | Section-specific preflight check |
| `--json` | Structured JSON output for AI agents |

## Presets

| Preset | Sections |
|--------|----------|
| landing | landing |
| blog | blog |
| marketing | landing + blog |
| saas | landing + dashboard + auth |
| saas-blog | landing + dashboard + auth + blog |
| full-saas | landing + dashboard + auth + blog + docs |
| dashboard | dashboard + auth |
| admin | dashboard + admin + auth |
| docs | docs |
| custom | interactive selection |

## Sections

| Section | Route Group | Requires |
|---------|-------------|----------|
| landing | (marketing)/ | none |
| blog | (blog)/ | none (MDX) |
| dashboard | (dashboard)/ | auth, backend |
| auth | (auth)/ | backend |
| docs | (docs)/ | none |
| admin | (admin)/ | auth, backend |

## Convex backend modes

When a project includes a Convex backend you must pick a mode via `--convex`
(or the interactive prompt). The client code is identical for both — only the
environment variables and where the backend runs differ.

| Mode | What you get |
|------|--------------|
| `cloud` | `.env.example` with `NEXT_PUBLIC_CONVEX_URL` + commented `CONVEX_DEPLOY_KEY`. Run `npx convex dev` to provision a managed deployment. |
| `self-hosted` | `.env.example` with `CONVEX_SELF_HOSTED_URL` + `CONVEX_SELF_HOSTED_ADMIN_KEY`, a `docker-compose.yml` (backend + dashboard), and `docs/self-hosting.md`. |

Switch modes anytime by editing env vars — see the generated `docs/self-hosting.md`.
