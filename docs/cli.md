# CLI Reference

## Commands

### `create-vllnt-app [name] [options]`

Scaffold a new project.

| Option | Description |
|--------|-------------|
| `-p, --preset <preset>` | Project preset (saas, landing, blog, marketing, saas-blog, full-saas, dashboard, admin, docs) |
| `--sections <sections>` | Comma-separated sections for custom preset |
| `--skip-backend` | Skip Convex backend setup |
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
