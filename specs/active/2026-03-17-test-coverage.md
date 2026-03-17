---
title: Maximum Test Coverage + Coverage Tracking
status: active
created: 2026-03-17
estimate: 6h
tier: standard
---

# Maximum Test Coverage + Coverage Tracking

## Context

The CLI has ~3,220 LOC across 36 files but only 3 E2E scaffold tests (35 assertions). No unit tests exist for core logic (presets, doctor, detector, validation, package-manager). No coverage tracking is configured. This spec adds comprehensive tests for every exported function + integration path, and configures `@vitest/coverage-v8` with enforced thresholds.

## Codebase Impact (MANDATORY)

| Area | Impact | Detail |
|------|--------|--------|
| `vitest.config.ts` | MODIFY | Add coverage config (v8 provider, thresholds, reporters) |
| `cli/package.json` | MODIFY | Add `@vitest/coverage-v8` devDep |
| `package.json` (root) | MODIFY | Add `test:coverage` script |
| `tests/unit/validate.spec.ts` | CREATE | Unit tests for validateProjectName (pure function) |
| `tests/unit/package-manager.spec.ts` | CREATE | Unit tests for detectPackageManager, getInstallCommand, getRunCommand (pure functions) |
| `tests/unit/presets.spec.ts` | CREATE | Unit tests for resolveTransitiveDeps, getPreset, needsBackend (pure functions) |
| `tests/unit/detector.spec.ts` | CREATE | Integration tests for detectProject (reads filesystem) |
| `tests/e2e/doctor.spec.ts` | CREATE | E2E tests for `vllnt doctor` command (runs real CLI) |
| `tests/e2e/scaffold-sections.spec.ts` | CREATE | E2E tests for composable sections scaffold (runs real CLI) |
| `tests/e2e/scaffold-options.spec.ts` | CREATE | E2E tests for CLI flags: --skip-backend, --skip-install, --sections, error paths |
| `tests/helpers/fixtures.ts` | CREATE | Filesystem fixture helpers for doctor/detector tests |
| `.github/workflows/ci.yml` | MODIFY | Add coverage report upload step |

**Files:** 8 create | 4 modify | 0 affected
**Reuse:** Existing `tests/helpers/cli.ts` (runCli, createTmpDir, cleanTmpDir, fileExists, readFile, parseJsonOutput)
**Breaking changes:** None
**New dependencies:** `@vitest/coverage-v8` (standard vitest coverage plugin)

## User Journey (MANDATORY)

### Primary Journey

ACTOR: AI agent (primary consumer) or developer running `pnpm test`
GOAL: Run test suite, get coverage report, know what's tested and what's not
PRECONDITION: Repo cloned, `pnpm install` done

1. Agent runs `pnpm test`
   → Vitest runs all `tests/**/*.spec.ts`
   → Agent sees all tests pass (exit 0)

2. Agent runs `pnpm test:coverage`
   → Vitest runs with `--coverage`
   → Agent sees coverage report with per-file line/branch/function percentages
   → Coverage meets minimum thresholds (no failure)

3. Developer pushes PR
   → CI runs `pnpm test`
   → CI reports pass/fail with test count

POSTCONDITION: All core CLI logic has test coverage. Coverage thresholds prevent regression.

### Error Journeys

E1. Coverage drops below threshold
   Trigger: Developer removes tests or adds untested code
   1. Developer runs `pnpm test:coverage`
      → Vitest detects coverage below threshold
      → Developer sees "Coverage threshold not met" with specific file + metric
   2. Developer adds missing tests
      → Coverage restored
   Recovery: Tests added, coverage passes

E2. Test fails on valid code change
   Trigger: Developer changes CLI behavior intentionally
   1. Developer modifies scaffold logic
      → Test asserting old behavior fails
      → Developer sees specific assertion failure with file:line
   2. Developer updates test to match new behavior
   Recovery: Test updated, suite green

### Edge Cases

EC1. Empty project directory (doctor runs on bare dir) → doctor returns all-fail gracefully
EC2. Invalid section name passed to --sections → CLI exits 1 with error message
EC3. Circular dependency in section deps → resolveTransitiveDeps handles via Set (no infinite loop)
EC4. All presets produce valid scaffold output → no missing files or broken templates
EC5. Package manager detection with no lockfiles → defaults to pnpm
EC6. Project name validation boundary cases → scoped names, max length, reserved words

## Acceptance Criteria (MANDATORY)

### Must Have (BLOCKING — all must pass to ship)

- [ ] AC-1: GIVEN `validateProjectName` WHEN called with empty, spaces, uppercase, reserved, >214 chars THEN returns correct error string for each; valid names return undefined
- [ ] AC-2: GIVEN `resolveTransitiveDeps` WHEN called with `['dashboard']` THEN returns `['auth', 'dashboard']` (auth auto-added); `['admin']` returns `['auth', 'admin']`
- [ ] AC-3: GIVEN `resolveTransitiveDeps` WHEN called with `[]` THEN returns `[]`; unknown section THEN includes it silently (no crash)
- [ ] AC-4: GIVEN `needsBackend` WHEN called with `['landing', 'blog']` THEN returns false; `['dashboard']` returns true; `['admin']` returns true
- [ ] AC-5: GIVEN `getPreset` WHEN called with each of 10 preset names THEN returns correct preset; unknown name returns undefined
- [ ] AC-6: GIVEN `detectPackageManager` WHEN lockfile exists (pnpm-lock.yaml / yarn.lock / bun.lockb / package-lock.json) THEN returns correct PM; no lockfile returns 'pnpm'
- [ ] AC-7: GIVEN `getInstallCommand` and `getRunCommand` WHEN called with each PM THEN returns correct command strings
- [ ] AC-8: GIVEN `detectProject` WHEN dir has next.config.ts THEN returns type='web'; app.json+metro THEN type='mobile'; monorepo layout THEN type='fullstack'; bare dir THEN type=null
- [ ] AC-9: GIVEN `vllnt doctor --json` WHEN run in a freshly scaffolded saas project THEN returns JSON with all global checks passing and summary.fail=0
- [ ] AC-10: GIVEN `vllnt doctor --json` WHEN run in empty directory THEN returns JSON with checks failing (vllnt.json missing, package.json missing, etc.) and exit code 2
- [ ] AC-11: GIVEN `vllnt doctor --json --for dashboard` WHEN run in project without auth section THEN returns fail for missing auth dependency
- [ ] AC-12: GIVEN `vllnt new test-app --preset saas --yes --agent --skip-install` WHEN run THEN scaffold includes landing + dashboard + auth sections, vllnt.json lists correct sections
- [ ] AC-13: GIVEN `vllnt new test-app --sections landing,blog --yes --agent --skip-install` WHEN run THEN scaffold includes exactly landing and blog sections, no auth/backend
- [ ] AC-14: GIVEN `vllnt new test-app --sections dashboard --yes --agent --skip-install` WHEN run THEN scaffold auto-resolves auth as transitive dep, both sections present
- [ ] AC-15: GIVEN `vllnt new test-app --preset saas --yes --agent --skip-install --skip-backend` WHEN run THEN scaffold has no convex/ directory anywhere
- [ ] AC-16: GIVEN `vllnt new` with invalid name (spaces, uppercase) via `--agent --yes` THEN exits 1 with JSON error containing validation message
- [ ] AC-17: GIVEN `vllnt new test-app --preset nonexistent --yes --agent` THEN exits 1 with JSON error about unknown preset
- [ ] AC-18: GIVEN `vllnt new test-app` targeting existing non-empty dir `--yes --agent` THEN exits 1 with error about directory exists
- [ ] AC-19: GIVEN `pnpm test:coverage` WHEN run THEN produces coverage report and all thresholds pass
- [ ] AC-20: GIVEN each of the 10 presets WHEN scaffolded with `--yes --agent --skip-install` THEN all produce valid output (exit 0, vllnt.json present, correct sections)

### Error Criteria (BLOCKING — all must pass)

- [ ] AC-E1: GIVEN any test failure WHEN `pnpm test` runs THEN vitest reports specific file:line with assertion detail (not swallowed)
- [ ] AC-E2: GIVEN coverage below threshold WHEN `pnpm test:coverage` runs THEN exit code non-zero with threshold violation message

### Should Have (ship without, fix soon)

- [ ] AC-S1: GIVEN `detectProject` WHEN dir has both next.config.ts AND app.json THEN returns 'web' (first match priority documented in test)
- [ ] AC-S2: GIVEN `vllnt doctor --for unknownsection --json` WHEN run THEN returns fail check for unknown section

## Scope

- [ ] 1. Configure `@vitest/coverage-v8` with thresholds → AC-19, AC-E2
- [ ] 2. Create `tests/helpers/fixtures.ts` with filesystem fixture helpers → AC-8, AC-9, AC-10, AC-11
- [ ] 3. Create `tests/unit/validate.spec.ts` — validateProjectName tests → AC-1
- [ ] 4. Create `tests/unit/package-manager.spec.ts` — PM detection + commands → AC-6, AC-7
- [ ] 5. Create `tests/unit/presets.spec.ts` — resolveTransitiveDeps, getPreset, needsBackend → AC-2, AC-3, AC-4, AC-5
- [ ] 6. Create `tests/unit/detector.spec.ts` — detectProject with fixture dirs → AC-8
- [ ] 7. Create `tests/e2e/doctor.spec.ts` — doctor command E2E → AC-9, AC-10, AC-11
- [ ] 8. Create `tests/e2e/scaffold-sections.spec.ts` — composable sections E2E → AC-12, AC-13, AC-14, AC-20
- [ ] 9. Create `tests/e2e/scaffold-options.spec.ts` — CLI flag combos + error paths → AC-15, AC-16, AC-17, AC-18
- [ ] 10. Update CI workflow with coverage reporting → AC-19

### Out of Scope

- Interactive mode testing (requires TTY simulation — separate spec)
- www/ marketing site tests (low-value, static content)
- Template E2E tests inside scaffolded projects (Playwright runs inside generated apps)
- Performance/benchmark testing
- `vllnt add` / `vllnt generate` (not implemented yet)

## Quality Checklist

### Blocking (must pass to ship)

- [ ] All Must Have ACs passing
- [ ] All Error Criteria ACs passing
- [ ] All scope items implemented
- [ ] No regressions in existing 35 tests
- [ ] Error states handled (not just happy path)
- [ ] No hardcoded secrets or credentials
- [ ] Coverage thresholds enforced and passing
- [ ] Tests use real filesystem operations, no mocking of own code
- [ ] Each test traces to at least 1 AC

### Advisory (should pass, not blocking)

- [ ] All Should Have ACs passing
- [ ] Test file naming follows existing convention (`*.spec.ts`)
- [ ] Tests run in <60s total (current: 1.35s for 35 tests)

## Test Strategy (MANDATORY)

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | Detected | Vitest 4.0.18 (vitest.config.ts, globals: true) |
| E2E framework | Detected (in templates) | Playwright config in templates, not used for CLI tests |
| Test DB | N/A | CLI operates on filesystem, no DB |
| Mock inventory | 0 existing mocks | All tests use real CLI execution via execaNode |
| Coverage | NOT CONFIGURED | Will add @vitest/coverage-v8 |

### AC → Test Mapping

| AC | Test Type | Test File | Test Intention |
|----|-----------|-----------|----------------|
| AC-1 | Unit | `tests/unit/validate.spec.ts` | All 6 validation rules + edge cases (10+ assertions) |
| AC-2 | Unit | `tests/unit/presets.spec.ts` | Transitive dep resolution for dashboard→auth, admin→auth |
| AC-3 | Unit | `tests/unit/presets.spec.ts` | Empty input + unknown section handling |
| AC-4 | Unit | `tests/unit/presets.spec.ts` | Backend detection for each section combo |
| AC-5 | Unit | `tests/unit/presets.spec.ts` | All 10 presets exist and have correct shape |
| AC-6 | Unit | `tests/unit/package-manager.spec.ts` | Lockfile detection priority + fallback |
| AC-7 | Unit | `tests/unit/package-manager.spec.ts` | Command string correctness per PM |
| AC-8 | Integration | `tests/unit/detector.spec.ts` | Project type detection with real fixture dirs |
| AC-9 | E2E | `tests/e2e/doctor.spec.ts` | Doctor passes on healthy scaffolded project |
| AC-10 | E2E | `tests/e2e/doctor.spec.ts` | Doctor fails correctly on empty dir |
| AC-11 | E2E | `tests/e2e/doctor.spec.ts` | Doctor preflight catches missing deps |
| AC-12 | E2E | `tests/e2e/scaffold-sections.spec.ts` | Saas preset produces landing+dashboard+auth |
| AC-13 | E2E | `tests/e2e/scaffold-sections.spec.ts` | Custom --sections works without backend |
| AC-14 | E2E | `tests/e2e/scaffold-sections.spec.ts` | Transitive auth dep auto-resolved |
| AC-15 | E2E | `tests/e2e/scaffold-options.spec.ts` | --skip-backend strips convex/ |
| AC-16 | E2E | `tests/e2e/scaffold-options.spec.ts` | Invalid name → JSON error |
| AC-17 | E2E | `tests/e2e/scaffold-options.spec.ts` | Unknown preset → JSON error |
| AC-18 | E2E | `tests/e2e/scaffold-options.spec.ts` | Existing dir → error |
| AC-19 | Integration | `vitest.config.ts` + CI | Coverage thresholds pass |
| AC-20 | E2E | `tests/e2e/scaffold-sections.spec.ts` | All 10 presets scaffold successfully |
| AC-E1 | Meta | All tests | Vitest reports file:line on failure |
| AC-E2 | Meta | Coverage config | Non-zero exit on threshold violation |
| AC-S1 | Integration | `tests/unit/detector.spec.ts` | Priority test for mixed signals |
| AC-S2 | E2E | `tests/e2e/doctor.spec.ts` | Unknown section preflight |

### Failure Mode Tests (MANDATORY)

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | E2E: coverage threshold violation produces non-zero exit + message | BLOCKING |
| Error Journey | E2 | E2E: changed CLI behavior causes specific assertion failure (not silent) | BLOCKING |
| Edge Case | EC1 | E2E: doctor on empty dir returns structured failures, no crash | BLOCKING |
| Edge Case | EC2 | E2E: invalid section name → exits 1 with error | BLOCKING |
| Edge Case | EC3 | Unit: circular deps in resolveTransitiveDeps → no hang | Advisory |
| Edge Case | EC4 | E2E: all 10 presets scaffold without error | BLOCKING |
| Edge Case | EC5 | Unit: no lockfile → defaults to pnpm | Advisory |
| Edge Case | EC6 | Unit: scoped names, max length, reserved words all handled | Advisory |
| Failure Hypothesis | FH-1 | E2E: scaffold with --skip-backend doesn't leave stale convex references in generated files | BLOCKING |
| Failure Hypothesis | FH-2 | E2E: transitive dep resolution doesn't duplicate sections in vllnt.json | BLOCKING |
| Failure Hypothesis | FH-3 | Unit: needsBackend returns false for pure-content sections (landing, blog, docs) | BLOCKING |

### Mock Boundary

| Dependency | Strategy | Justification |
|------------|----------|---------------|
| Filesystem | Real (tmpdir) | CLI operates on real filesystem. Use os.tmpdir() + cleanup. Already the pattern. |
| CLI binary | Real (execaNode) | Run actual compiled CLI. Already the pattern. |
| Git | Real (git init) | CLI calls real git. Test verifies .git/ created. |
| Package managers | Skip install | Use --skip-install flag to avoid network I/O. Tests verify file structure, not npm registry. |

**No mocks needed.** Every dependency is either real or skipped via CLI flags.

### TDD Commitment

All tests written BEFORE implementation (RED → GREEN → REFACTOR).
Every Must Have + Error AC tracked in e2e-scenarios registry.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Test suite becomes slow (>60s) | MED | LOW | --skip-install on all scaffold tests, parallel vitest, tmpdir reuse per describe block |
| Coverage thresholds too aggressive | LOW | MED | Start at 70% lines, 60% branches. Raise incrementally. |
| Flaky tests from filesystem race conditions | MED | LOW | Unique tmpdir per test, proper cleanup in afterEach |
| Tests break on template changes | MED | MED | Assert structure (files exist) not content (specific strings) where possible |

**Kill criteria:** If test suite exceeds 120s runtime, split into parallel workers or reduce E2E scope.

## State Machine

**Status**: N/A — Stateless feature

**Rationale**: Tests are pure execution → assertion. No persistent state transitions.

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| All pure functions can be tested without mocking | validateProjectName, resolveTransitiveDeps, getPreset, needsBackend, getInstallCommand, getRunCommand have no I/O | detectPackageManager reads filesystem (fs.existsSync) | RISKY — detectPackageManager needs fixture dirs, not pure. Reclassify as integration test. |
| Existing test helpers are sufficient | runCli, createTmpDir, cleanTmpDir cover CLI execution + cleanup | Doctor tests need pre-built fixture dirs with specific files. No helper for that. | RISKY — need fixtures.ts helper for detector/doctor tests. Added to scope. |
| 70% line coverage is achievable | Core logic files are mostly branches we'll test. Utils are small pure functions. | Interactive mode branches (clack prompts) can't be tested without TTY. Commands/new.ts has ~40% interactive code. | VALID — 70% achievable for non-interactive paths. Interactive paths excluded (out of scope). |
| --skip-install makes tests fast | Already used in 3 existing test files, tests complete in <2s | Some tests might need installed deps (doctor typecheck) | VALID — doctor typecheck test can skip if node_modules missing (mirrors real behavior). |
| All 10 presets produce valid output | Template files exist for all 6 sections | Some presets may reference sections not yet fully implemented | RISKY — test will expose any broken presets. That's the point. |

### Blind Spots

1. **[Integration]** Doctor's `runTypeChecks()` shells out to `npx tsc --noEmit` with 60s timeout. Testing this in CI adds real compilation time. Could be slow/flaky.
   Why it matters: If we test typecheck, tests go from 2s → 60s+. If we skip, we miss a critical doctor feature.

2. **[Data]** Section.json files are pure data but could have schema drift (missing fields, wrong types). No validation exists at load time (`loadSectionMeta` does raw JSON.parse).
   Why it matters: Bad section.json silently produces broken scaffolds.

3. **[Integration]** `scaffold()` registers SIGINT/SIGTERM handlers and cleans up tmpdir. Testing signal handling in vitest is non-trivial.
   Why it matters: If cleanup fails on Ctrl+C, orphaned dirs accumulate.

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| scaffold with --skip-backend runs on saas preset | convex/ files might remain in non-auth sections | stripBackend only removes top-level convex/ but section templates may have convex/ subdirs | HIGH | FH-1 test: scaffold saas --skip-backend, assert zero convex/ files anywhere |
| resolveTransitiveDeps called with dashboard twice | auth might appear twice in resolved array | Set prevents dupes, but verify | MED | FH-2 test: scaffold dashboard, verify vllnt.json sections has no dupes |
| needsBackend returns true for landing-only preset | unnecessary backend scaffolding | hardcoded section names in needsBackend could have typo | MED | FH-3 test: assert needsBackend(['landing']) === false |

### The Real Question

Confirmed — spec solves the right problem. The CLI has complex branching (presets, sections, backend, legacy) with zero unit test coverage on core logic. Integration E2E tests verify end-to-end but miss internal edge cases. Both layers are needed.

### Open Items

- [improvement] `handlebars` is unused in cli/package.json — remove during implementation → update spec scope if user approves
- [improvement] `needsBackend()` uses hardcoded section names instead of section.json `requiresBackend` field — flag for future refactor → no action (out of scope)
- [gap] Interactive mode (clack prompts) untestable without TTY mock → no action (documented in Out of Scope)

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Configure coverage | [x] Complete | 1 |
| 2 | Create fixtures helper | [x] Complete | 1 |
| 3 | validate.spec.ts | [x] Complete | 1 |
| 4 | package-manager.spec.ts | [x] Complete | 1 |
| 5 | presets.spec.ts | [x] Complete | 1 |
| 6 | detector.spec.ts | [x] Complete | 1 |
| 7 | doctor.spec.ts | [x] Complete | 2 |
| 8 | scaffold-sections.spec.ts | [x] Complete | 2 |
| 9 | scaffold-options.spec.ts | [x] Complete | 2 |
| 10 | CI coverage reporting | [x] Complete | 2 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-17T16:15:00Z | - | Created |
