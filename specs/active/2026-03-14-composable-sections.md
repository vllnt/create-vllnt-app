---
title: Composable Sections — Foundations
status: active
created: 2026-03-14
revised: 2026-03-14
estimate: 14h (4 phases)
tier: standard
---

# Composable Sections — Foundations

## Context

CLI currently asks "web/mobile/fullstack" — template-oriented, not goal-oriented. Templates are monolithic.

Redesign CLI around composable sections assembled at `vllnt new` time. `vllnt doctor` validates health and guides agents. The CLI is a **guardrails + speed tool** — agents handle all coding, merging, and extension. CLI just gets them started fast with strict rules they can't break.

## Design Philosophy: Agent-First Guardrails

The CLI is NOT a merge engine. It's a **scaffolding + guardrails tool**.

```
CLI responsibilities:           Agent responsibilities:
────────────────────            ──────────────────────
Fast init (vllnt new)           Coding features
Preset → sections mapping       Extending sections
Health checks (vllnt doctor)    Merging / modifying files
Guardrails (eslint strict, TS)  Adding new pages/routes
CLAUDE.md + AGENTS.md           Reading docs, following rules
Section templates               Composing providers, configs
```

| Principle | Implementation |
|-----------|----------------|
| **Speed** | Presets scaffold a full project in one command. No manual steps. |
| **Machine-readable** | `--json` on every command. Structured errors with `id`, `message`, `fix` fields |
| **Deterministic** | Same inputs = same outputs. No interactive prompts in `--agent` mode |
| **Self-documenting** | CLAUDE.md + AGENTS.md auto-generated per preset. Agents read these first |
| **Guardrails** | @vllnt/eslint-config (strict, errors-only) + TypeScript strict. Zero warnings. |
| **Doctor = guidance** | Reports issues with structured fix instructions. Agent executes fixes. CLI doesn't auto-mutate. |
| **Exit codes** | 0=success, 1=error, 2=issues found. Agents parse exit codes |

Agent workflow:
```
Human picks preset → vllnt new my-saas --preset saas
    → project scaffolded with CLAUDE.md, strict eslint, strict TS
    → agent reads CLAUDE.md → understands stack + rules
    → agent runs vllnt doctor --json → sees project health
    → agent codes within guardrails → eslint catches violations instantly
    → human says "add a blog" → agent creates routes + content manually (guided by AGENTS.md)
    → agent runs vllnt doctor --json → verifies health after changes
```

### Zero-Error Guarantee

Every CLI output must pass `lint + typecheck + build` out of the box:
```
pnpm lint        → 0 errors
pnpm typecheck   → 0 errors
pnpm build       → success
```

If a preset produces errors → CLI bug, not user problem.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| cli/templates/base/web/ | CREATE | Minimal Next.js 16 skeleton (tsconfig, globals.css, lib/, i18n/, proxy.ts) |
| cli/templates/sections/ | CREATE | 6 section dirs: landing, blog, dashboard, docs, auth, admin |
| cli/src/commands/new.ts | MODIFY | Replace template select with preset-oriented prompts |
| cli/src/core/scaffold.ts | MODIFY | Assemble base + N sections at init time (no post-hoc merge) |
| cli/src/core/presets.ts | CREATE | Preset → sections mapping + section metadata |
| cli/src/core/doctor.ts | CREATE | Health checks: structure, deps, config, types. Report only. |
| cli/src/commands/doctor.ts | MODIFY | Implement doctor command with --for, --json flags |
| cli/src/core/detector.ts | MODIFY | Detect project type and active sections via vllnt.json |
| cli/templates/web/ | DELETE | Replaced by base/web + sections |

**Files:** 5 create | 4 modify | 0 affected
**Reuse:** existing scaffold.ts copy/replace, package-manager detection, validate.ts
**Breaking changes:** `--template web` replaced by `--preset` (keep as alias)
**New dependencies:** none

## What's NOT in scope (deferred)

| Feature | Why deferred | Future path |
|---------|--------------|-------------|
| `vllnt add` (post-hoc merge) | Merge is complex, fragile, over-engineered for v1 | Agent handles extension manually guided by AGENTS.md |
| Provider composition | Layout providers are agent's job, not CLI's | Document pattern in AGENTS.md, agent composes |
| next.config.mjs merge | JS module merge has no safe generic solution | Section configs documented, agent applies |
| `--watch` mode | Persistent watcher is scope creep + security risk | Future spec if needed |
| Auto-fix mutations | CLI shouldn't mutate user code. Report only. | Agent reads doctor output and fixes |
| Landing page redesign | Separate deliverable, separate spec | Spec after CLI foundations ship |
| Mobile sections | Web-first, mobile later | Separate spec |

## User Journey (MANDATORY)

### Primary Journey: Scaffold with Preset

ACTOR: Developer starting a new project
GOAL: Get a production-ready scaffolded project in one command
PRECONDITION: Node.js >=22

1. User runs `create-vllnt-app new my-saas`
   → System shows "What are you building?" with preset options
   → User sees: Landing Page, Blog, Marketing Site, SaaS, Full SaaS, Dashboard, Internal Tool, Docs, Custom

2. User selects "SaaS"
   → System assembles: base/web + sections/landing + sections/dashboard + sections/auth + convex backend
   → System writes merged package.json (union of all section deps)
   → System writes CLAUDE.md + AGENTS.md reflecting active sections
   → System writes vllnt.json (section registry)
   → System runs pnpm install + git init

3. User sees scaffolded project
   → All routes work, lint+typecheck+build pass
   → CLAUDE.md has strict rules, agent reads it immediately

POSTCONDITION: Buildable project with guardrails, agent-ready

### Primary Journey: Doctor Health Check

ACTOR: AI coding agent checking project health
GOAL: Get structured health report to validate project state
PRECONDITION: Existing vllnt project (has vllnt.json)

1. Agent runs `vllnt doctor --json`
   → System detects project from vllnt.json
   → System runs checks: structure, deps, config, types
   → Agent receives JSON with checks array

2. Agent reads failed checks
   → Each check has `id`, `status`, `message`, `fix` (structured command object)
   → Agent executes fix commands itself
   → Agent re-runs `vllnt doctor --json` to verify

POSTCONDITION: Agent has fixed all issues, project healthy

### Error Journeys

E1. Invalid preset name
   Trigger: `vllnt new my-app --preset invalid`
   → System shows "Unknown preset 'invalid'. Available: landing, blog, saas, ..."
   Recovery: User picks valid preset

E2. Missing vllnt.json on doctor
   Trigger: `vllnt doctor` outside vllnt project
   → System shows "Not a vllnt project. No vllnt.json found."
   Recovery: User runs `vllnt new` first

### Edge Cases

EC1. `--preset saas --skip-backend` → contradicts (SaaS needs Convex) → warn but allow, strip Convex files
EC2. `--preset custom` in non-interactive mode → error "Custom requires interactive mode or --sections flag"
EC3. Custom mode selects dashboard without auth → auto-add auth with message

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN `vllnt new my-app --preset saas` WHEN scaffold completes THEN project has landing + dashboard + auth sections with Convex backend
- [ ] AC-2: GIVEN Custom mode WHEN user picks sections THEN only selected sections are included with transitive deps auto-added
- [ ] AC-3: GIVEN any preset WHEN `pnpm lint && pnpm typecheck && pnpm build` run THEN all pass with 0 errors
- [ ] AC-4: GIVEN scaffolded project WHEN agent reads CLAUDE.md THEN CLAUDE.md documents active sections, stack, and blocking rules
- [ ] AC-5: GIVEN scaffolded project THEN vllnt.json exists listing active sections, preset used, and backend status

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN `vllnt doctor --json` WHEN issues found THEN JSON output has structured checks with `{id, status, message, fix: {cmd, args[]}}` format
- [ ] AC-E2: GIVEN Custom mode WHEN 0 sections selected THEN validation prevents proceeding
- [ ] AC-E3: GIVEN doctor run outside vllnt project WHEN no vllnt.json found THEN clear error with guidance

### Should Have

- [ ] AC-6: GIVEN `--preset` flag WHEN non-interactive THEN correct sections assembled without prompts
- [ ] AC-7: GIVEN `--template web` (backward compat) THEN maps to preset equivalent and works

## Scope

### Phase 1: Section Templates (4h)

- [ ] 1. Create base/web/ minimal skeleton (tsconfig, globals.css, lib/, i18n/, proxy.ts, root layout with provider slots) → AC-3
- [ ] 2. Extract landing section from current web template → AC-1
- [ ] 3. Extract dashboard section → AC-1
- [ ] 4. Extract auth section (+ Convex auth domain) → AC-1
- [ ] 5. Create blog section (MDX-based) → AC-1
- [ ] 6. Create docs section (basic MDX) → AC-1
- [ ] 7. Each section has: section.json (metadata, deps, providers, i18n keys) → AC-5

### Phase 2: Preset Prompt Flow + Assembly (4h)

- [ ] 8. Create presets.ts — preset → sections mapping with metadata → AC-1
- [ ] 9. Replace template select with preset select in new.ts → AC-1, AC-2
- [ ] 10. Add Custom option with multi-select + transitive dep resolution → AC-2, AC-E2
- [ ] 11. Update scaffold.ts — assemble base + N sections (init-time only, no merge) → AC-3
- [ ] 12. Generate vllnt.json with active sections registry → AC-5
- [ ] 13. Generate CLAUDE.md + AGENTS.md from active sections → AC-4
- [ ] 14. Add --preset flag for non-interactive + backward compat --template → AC-6, AC-7

### Phase 3: `vllnt doctor` (4h)

- [ ] 15. Create doctor.ts — check registry (structure, deps, config, types) → AC-E1
- [ ] 16. Implement `--json` output — structured checks with `{id, status, message, fix: {cmd, args[]}}` → AC-E1
- [ ] 17. Implement `--for <section>` — section-specific checks from section.json → AC-E1
- [ ] 18. Implement human-readable output — PASS/WARN/FAIL with colored output → AC-E1
- [ ] 19. Detect project from vllnt.json → AC-E3
- [ ] 20. Doctor is report-only — no mutations, no auto-fix. Agent reads output and acts. → AC-E1

### Phase 4: Polish + Docs (2h)

- [ ] 21. Update README.md with presets, doctor, agent workflow → AC-4
- [ ] 22. Update llms.txt + llms-full.txt routes → AC-4
- [ ] 23. CI matrix: test all presets pass lint+typecheck+build → AC-3
- [ ] 24. Update www/messages/en.json with new preset names → AC-1

### Out of Scope

- `vllnt add` (post-hoc merge) — agents handle extension
- Landing page redesign — separate spec
- Mobile/fullstack sections — future spec
- `--watch` mode — removed (security risk, scope creep)
- Auto-fix mutations — doctor is read-only, agents fix
- Provider composition system — documented in AGENTS.md, agent implements

## Quality Checklist

### Blocking

- [ ] All Must Have ACs passing
- [ ] All Error Criteria ACs passing
- [ ] Every preset scaffolds a buildable project (CI matrix)
- [ ] No hardcoded secrets
- [ ] vllnt.json generated for every scaffold
- [ ] CLAUDE.md accurately reflects active sections

### Advisory

- [ ] README updated
- [ ] llms.txt updated
- [ ] --template backward compat works

## Test Strategy

Runner: tsup build + node smoke tests | TDD: RED → GREEN per AC
AC-1 → integration: scaffold each preset, verify files exist + structure correct
AC-3 → integration: scaffold each preset, run lint+typecheck+build, assert 0 errors
AC-E1 → integration: run doctor on scaffolded project, parse JSON, verify schema
Mocks: none — real filesystem

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Section templates drift from each other | MED | MED | CI matrix tests all presets every push |
| @vllnt/* latest breaks scaffolded projects | HIGH | MED | Pin versions in section deps, not `latest` |
| vllnt.json becomes stale if user restructures | LOW | MED | Doctor validates vllnt.json vs filesystem |
| Agent ignores CLAUDE.md rules | MED | LOW | eslint strict catches violations at lint time, not just docs |
| Doctor --json fix field isn't actionable enough | HIGH | MED | Every fix is `{cmd, args[]}`. Test by feeding to agent. |

## Section Metadata Format (section.json)

Each section ships a `section.json` that the assembler reads at init time:

```json
{
  "name": "dashboard",
  "routeGroup": "(dashboard)",
  "requires": ["auth"],
  "requiresBackend": true,
  "dependencies": {
    "recharts": "^2.15.0"
  },
  "devDependencies": {},
  "i18nNamespace": "Dashboard",
  "providers": [],
  "claudeMdRules": [
    "Dashboard pages use Server Components for initial data load",
    "Client components for interactive charts and tables"
  ],
  "agentsMdExtensions": "### Dashboard Section\n- Protected routes in (dashboard)/\n- Features in features/dashboard/"
}
```

The assembler:
1. Reads all selected section.json files
2. Resolves transitive deps (dashboard → auth → backend)
3. Unions all `dependencies` and `devDependencies` into base package.json
4. Concatenates `claudeMdRules` into CLAUDE.md
5. Concatenates `agentsMdExtensions` into AGENTS.md
6. Writes `vllnt.json` with active sections list

No runtime merge. No file patching. Just init-time assembly.

## Doctor Check Registry

### Global Checks (always run)

| ID | Category | Check | Fix (structured) |
|----|----------|-------|-------------------|
| `vllnt-json` | structure | vllnt.json exists | `{cmd: "vllnt", args: ["new"]}` |
| `package-json` | structure | package.json valid JSON | `{cmd: "echo", args: ["Fix JSON syntax"]}` (manual) |
| `claude-md` | structure | CLAUDE.md exists and non-empty | `{cmd: "echo", args: ["Regenerate CLAUDE.md"]}` (manual) |
| `deps-installed` | deps | node_modules/ exists | `{cmd: "pnpm", args: ["install"]}` |
| `deps-pinned` | deps | @vllnt/* not on `latest` | `{cmd: "pnpm", args: ["update", "@vllnt/ui", "@vllnt/eslint-config"]}` |
| `typecheck` | types | `tsc --noEmit` passes | `{cmd: "echo", args: ["Fix type errors reported above"]}` (manual) |
| `lint` | types | `eslint .` passes | `{cmd: "eslint", args: [".", "--fix"]}` |
| `build` | build | `next build` succeeds | `{cmd: "echo", args: ["Fix build errors reported above"]}` (manual) |

### Section Checks (run with `--for <section>`)

| ID | Section | Check | Fix |
|----|---------|-------|-----|
| `dash-auth` | dashboard | auth section in vllnt.json | `{cmd: "echo", args: ["Add auth section first"]}` (manual) |
| `dash-backend` | dashboard | backend: true in vllnt.json | `{cmd: "echo", args: ["Backend required for dashboard"]}` (manual) |
| `auth-backend` | auth | backend: true in vllnt.json | `{cmd: "echo", args: ["Backend required for auth"]}` (manual) |
| `blog-mdx` | blog | @next/mdx in deps | `{cmd: "pnpm", args: ["add", "@next/mdx", "@mdx-js/react"]}` |

### JSON Output Schema

```typescript
interface DoctorResult {
  project: {
    name: string
    type: 'web' | 'mobile' | 'unknown'
    sections: string[]
    backend: boolean
    packageManager: string
  }
  target?: string
  checks: DoctorCheck[]
  summary: {
    pass: number
    warn: number
    fail: number
  }
}

interface DoctorCheck {
  id: string
  category: 'structure' | 'deps' | 'config' | 'types' | 'build'
  status: 'pass' | 'warn' | 'fail'
  message: string
  fix?: {
    cmd: string
    args: string[]
    type: 'command' | 'manual'
  }
}
```

## Preset → Sections Mapping

| Preset | Sections | Backend |
|--------|----------|---------|
| landing | landing | No |
| blog | blog | No |
| marketing | landing + blog | No |
| saas | landing + dashboard + auth | Yes |
| saas-blog | landing + dashboard + auth + blog | Yes |
| full-saas | landing + dashboard + auth + blog + docs | Yes |
| dashboard | dashboard + auth | Yes |
| internal | dashboard + admin + auth | Yes |
| docs | docs | No |
| custom | user picks | auto-detect |

## vllnt.json Schema

```json
{
  "version": "1.0",
  "preset": "saas",
  "sections": ["landing", "dashboard", "auth"],
  "backend": true,
  "created": "2026-03-14T14:00:00Z"
}
```

Source of truth for active sections. Doctor reads this. Agents read this. No filesystem inference.

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| Init-time assembly is sufficient (no post-hoc merge needed) | Agents can manually add routes and sections guided by AGENTS.md | Users may want CLI-assisted section addition later | VALID for v1 — agent + AGENTS.md is the extension path |
| Agents will read and follow CLAUDE.md rules | Claude Code, Cursor, Windsurf all read context files | Agents may ignore rules under pressure | VALID — eslint strict + TS strict = guardrails enforced at lint time, not just docs |
| Doctor report-only is sufficient (no auto-fix needed) | Agents are capable of executing fix commands themselves | Extra round-trip: doctor → agent reads → agent executes | VALID — safer, simpler, agents handle it fine |

### Open Items

- [resolved] Merge complexity → deferred. CLI scaffolds, agents extend.
- [resolved] Doctor mutations → removed. Report only. Agent fixes.
- [resolved] `--watch` mode → removed. Security risk, scope creep.
- [resolved] Landing page → separate spec.
- [question] Should section.json include example AGENTS.md instructions for how agents extend the section? → YES, valuable for agent guidance

## Notes

Spec revised after 5-perspective deep review (Skeptic, DevRel, Systems, Strategist, Security).
Key decision: CLI = guardrails + speed. Agents = coding + merging + extending.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-14T14:00:00Z | - | Created |
| spec-review | 2026-03-14T14:30:00Z | 30m | 5-perspective adversarial review |
| revised | 2026-03-14T15:00:00Z | - | Simplified: guardrails + speed, not merge engine |
