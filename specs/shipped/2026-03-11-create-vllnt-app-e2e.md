# E2E Scenario Registry — create-vllnt-app

100% E2E coverage enforced. Every Must Have + Error AC + HIGH/MED Failure Hypothesis mapped.
TDD BLOCKING: RED_CONFIRMED required before GREEN_CONFIRMED.

---

## Registry

### Phase 1 — Scaffold Core + Landing

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-1 | `vllnt new --template web` → Next.js + Convex project, `pnpm dev` works | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify full tree + dev server |
| AC-2 | `vllnt new --template mobile` → Expo + Convex project, `pnpm start` works | `tests/e2e/scaffold-mobile.spec.ts` | PENDING | Verify full tree + start |
| AC-3 | `vllnt new --template fullstack` → monorepo apps/ + packages/ | `tests/e2e/scaffold-fullstack.spec.ts` | PENDING | Verify monorepo structure |
| AC-4 | `--yes --agent` → no prompts, JSON output | `tests/e2e/agent-mode.spec.ts` | PENDING | Parse JSON, verify schema |
| AC-5 | CLAUDE.md exists with Convex+platform rules | `tests/e2e/scaffold-web.spec.ts` | PENDING | BLOCKING rules first, <200 lines |
| AC-5b | .cursorrules + .windsurfrules exist (derived from CLAUDE.md) | `tests/e2e/scaffold-web.spec.ts` | PENDING | Parity check with CLAUDE.md |
| AC-6 | AGENTS.md exists with architecture, extension table, tasks, pitfalls | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify required sections |
| AC-7 | docs/ has 6 files (architecture, conventions, testing, i18n, theming, extending) | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify all 6 exist + non-empty |
| AC-8 | features/ + components/ directories exist with correct structure | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify decision tree pattern |
| AC-9 | convex/ has domain-folder with auth/ | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify schemas+queries+mutations |
| AC-9b | convex.config.ts exists with component registration | `tests/e2e/scaffold-web.spec.ts` | PENDING | Verify app.use() pattern |
| AC-20 | Landing page shows hero, modes, agent-first, generators | `tests/e2e/landing-page.spec.ts` | PENDING | Playwright browser test |

### Phase 2 — Generators

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-10 | `vllnt generate page /dashboard` → page.tsx + layout + test + i18n | `tests/e2e/generator-page.spec.ts` | PENDING | Verify all files + conventions |
| AC-11 | `vllnt generate screen Settings` → screen + nav + test + i18n | `tests/e2e/generator-screen.spec.ts` | PENDING | Verify Expo conventions |
| AC-12 | `vllnt generate component Button` → component + test + story | `tests/e2e/generator-component.spec.ts` | PENDING | Verify naming + test stub |
| AC-13 | `vllnt generate feature auth` → features/auth/ vertical slice | `tests/e2e/generator-feature.spec.ts` | PENDING | Verify components/hooks/lib/index/tests/i18n |
| AC-14 | `vllnt generate domain billing` → convex/billing/ dual validators + withIndex | `tests/e2e/generator-domain.spec.ts` | PENDING | Verify Convex patterns in generated code |
| AC-15 | Any generator with `--agent` → JSON output | `tests/e2e/agent-mode.spec.ts` | PENDING | Verify JSON schema for generators |

### Phase 3 — Feature Adders

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-16 | `vllnt add auth` → deps, feature files, CLAUDE.md update, docs/auth.md | `tests/e2e/adder-auth.spec.ts` | PENDING | Full BetterAuth wiring verified |
| AC-17 | `vllnt add` any feature → CLAUDE.md updated with feature rules | `tests/e2e/adder-auth.spec.ts` | PENDING | Verify rule appended |
| AC-18 | `vllnt add` any feature → docs/{feature}.md generated | `tests/e2e/adder-auth.spec.ts` | PENDING | Verify doc file created |

### Phase 4 — Doctor & Polish

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-19 | `vllnt doctor` → checks deps, config, agent docs, Convex setup | `tests/e2e/doctor.spec.ts` | PENDING | Verify health report output |

### Error Criteria (BLOCKING)

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-E1 | Invalid project name → error + re-prompt | `tests/e2e/error-handling.spec.ts` | PENDING | "my app", reserved names, existing dir |
| AC-E2 | `vllnt add/generate` outside project → clear error | `tests/e2e/error-handling.spec.ts` | PENDING | JSON error for --agent |
| AC-E3 | Generator file conflict → warns (interactive) or errors (agent) | `tests/e2e/error-handling.spec.ts` | PENDING | No silent overwrite |
| AC-E4 | Wrong generator for platform → suggests correct one | `tests/e2e/error-handling.spec.ts` | PENDING | screen in web → "use page" |
| AC-E5 | Install fails → files preserved + manual command | `tests/e2e/error-handling.spec.ts` | PENDING | Mock network failure |

### Should Have (Advisory)

| AC | Description | Test File | TDD Status | Notes |
|----|-------------|-----------|------------|-------|
| AC-22 | Any pkg manager detected + used | `tests/e2e/should-have.spec.ts` | PENDING | npm/pnpm/yarn/bun |
| AC-23 | `vllnt add` twice → idempotent | `tests/e2e/should-have.spec.ts` | PENDING | No duplicate files/deps |
| AC-24 | `vllnt generate api /users` → route handler + Zod + test | `tests/e2e/should-have.spec.ts` | PENDING | Web-only generator |

### Failure Hypothesis Tests (BLOCKING — HIGH/MED severity)

| ID | IF | THEN | Test File | TDD Status | Notes |
|----|-----|------|-----------|------------|-------|
| FH-1 | Templates embedded in CLI | All scaffold files present + correct | `tests/e2e/failure-modes.spec.ts` | PENDING | Verify tree completeness |
| FH-2 | Generated Convex code | Follows skill rules (dual validators, withIndex, ctx.auth) | `tests/e2e/failure-modes.spec.ts` | PENDING | Parse generated code for patterns |
| FH-3 | CLAUDE.md generated | Rules match template patterns (no conflict) | `tests/e2e/failure-modes.spec.ts` | PENDING | Cross-reference rules vs code |
| FH-4 | features/ structure | Correct in all 3 scaffold modes | `tests/e2e/failure-modes.spec.ts` | PENDING | Verify web+mobile+fullstack |
| FH-5 | turbo.json in fullstack mode | `turbo build` succeeds (correct @repo/* pipeline) | `tests/e2e/failure-modes.spec.ts` | PENDING | Run actual turbo build |
| FH-6 | CLAUDE.md generated | < 200 lines, BLOCKING rules first | `tests/e2e/failure-modes.spec.ts` | PENDING | Line count + rule order check |
| FH-7 | CLI package size | < 20MB embedded templates | `tests/e2e/failure-modes.spec.ts` | PENDING | `du -sh` on built CLI |
| FH-8 | .cursorrules + .windsurfrules | Rule parity with CLAUDE.md (derived from same source) | `tests/e2e/failure-modes.spec.ts` | PENDING | Compare critical rules across files |
| FH-9 | Generated Convex domain code | Matches dual-validator + bounded reads + internal.* | `tests/e2e/failure-modes.spec.ts` | PENDING | Parse schemas.ts + queries.ts + mutations.ts |

### Edge Case Tests (Advisory)

| ID | Scenario | Test File | TDD Status | Notes |
|----|----------|-----------|------------|-------|
| EC-1 | Ctrl+C mid-scaffold → cleanup partial directory | `tests/e2e/edge-cases.spec.ts` | PENDING | Signal handling |
| EC-2 | Git not installed → skip init, warn | `tests/e2e/edge-cases.spec.ts` | PENDING | PATH manipulation |
| EC-3 | `vllnt add` twice same feature → idempotent | `tests/e2e/edge-cases.spec.ts` | PENDING | Same as AC-23 |
| EC-4 | Monorepo detection in `vllnt add` → adjust paths | `tests/e2e/edge-cases.spec.ts` | PENDING | Workspace-aware paths |
| EC-5 | `--agent` implies `--yes` → no prompts | `tests/e2e/edge-cases.spec.ts` | PENDING | Verify stdin never read |

---

## Cross-Scaffold Coverage Matrix

Every scaffold mode must pass the same structural tests:

| Test | Web | Mobile | Fullstack | Test File |
|------|-----|--------|-----------|-----------|
| CLAUDE.md exists + < 200 lines | X | X | X | scaffold-{mode}.spec.ts |
| .cursorrules exists | X | X | X | scaffold-{mode}.spec.ts |
| .windsurfrules exists | X | X | X | scaffold-{mode}.spec.ts |
| AGENTS.md exists + sections | X | X | X | scaffold-{mode}.spec.ts |
| docs/ has 6 files | X | X | X | scaffold-{mode}.spec.ts |
| features/ structure | X | X | X | scaffold-{mode}.spec.ts |
| components/ structure | X | X | X | scaffold-{mode}.spec.ts |
| convex/ domain-folder | X | X | X (in packages/backend/) | scaffold-{mode}.spec.ts |
| convex.config.ts exists | X | X | X (in packages/backend/) | scaffold-{mode}.spec.ts |
| convex/auth/ domain | X | X | X | scaffold-{mode}.spec.ts |
| Dev server starts | X | X | X (turbo dev) | scaffold-{mode}.spec.ts |
| --agent JSON output | X | X | X | agent-mode.spec.ts |

---

## Summary

| Category | Total | BLOCKING | Advisory |
|----------|-------|----------|----------|
| Must Have ACs | 22 | 22 | 0 |
| Error ACs | 5 | 5 | 0 |
| Should Have ACs | 3 | 0 | 3 |
| Failure Hypotheses | 9 | 9 | 0 |
| Edge Cases | 5 | 0 | 5 |
| **Total** | **44** | **36** | **8** |

**Coverage target:** 36/36 BLOCKING entries GREEN_CONFIRMED (100%)
**TDD proof:** All GREEN entries must have prior RED_CONFIRMED

## Test Infrastructure

| Component | Tool | Config |
|-----------|------|--------|
| Test runner | Vitest | `vitest.config.ts` |
| CLI E2E | Vitest + execa (run CLI in subprocess) | Real fs (tmp dirs) |
| Browser E2E | Playwright | `playwright.config.ts` (landing page only) |
| Mock boundary | Package install (network), Terminal stdin | See spec mock boundary table |
| Test timeout | 60s per scaffold test, 10s per generator test | Vitest config |

## Anti-Patterns (NEVER)

- NEVER mark GREEN_CONFIRMED without prior RED_CONFIRMED
- NEVER skip BLOCKING entries without documented escape hatch
- NEVER test file existence only — test content/structure matches conventions
- NEVER mock the file system — use real tmp dirs
- NEVER mock Convex code generation — parse and validate generated source
- NEVER leave registry entries PENDING at ship exit
