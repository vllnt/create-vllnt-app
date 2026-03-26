---
title: "P1: Test Coverage & Reliability"
status: shipped
shipped: 2026-03-25
created: 2026-03-25
estimate: 4h
tier: mini
---

# P1: Test Coverage & Reliability

## Context

Coverage metrics are structurally misleading — 85%+ thresholds on 4 trivial utility files while `scaffold.ts` (531 lines, entire product engine) has 0%. No test runs `tsc --noEmit` on scaffold output, invalidating the "Zero-Error Guarantee." `testRoot` singleton races under parallel vitest. Stale binary produces false greens locally.

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| vitest.config.ts | MODIFY | Expand coverage include to `cli/src/**/*.ts`, lower thresholds to honest 70% |
| tests/unit/scaffold-core.spec.ts | CREATE | Unit tests for scaffold.ts pure functions |
| tests/e2e/scaffold-build.spec.ts | CREATE | Smoke test: scaffold → `tsc --noEmit` on output |
| tests/e2e/template-integrity.spec.ts | CREATE | i18n namespace consistency + placeholder completeness |
| tests/helpers/tmp.ts | MODIFY | Per-worker tmpdir via VITEST_WORKER_ID |
| tests/setup.ts | MODIFY | Use globalSetup for build freshness check |
| cli/src/core/scaffold.ts | MODIFY | Export pure functions for unit testability |

**Reuse:** Existing test helpers (cli.ts, fixtures.ts, tmp.ts)
**Breaking changes:** Coverage thresholds will drop from 85% to ~70% initially (honest metric)
**New dependencies:** None

## User Journey

1. Dev modifies `scaffold.ts` → runs `pnpm test` → unit tests catch logic error in <50ms (not 30s E2E)
2. Dev runs `pnpm test` without `pnpm build` → globalSetup auto-builds or throws clear error
3. CI runs → coverage reports actual source coverage (not 4-file illusion) → honest signal
4. Template author adds section → template integrity test catches namespace mismatch before merge

Error: Dev enables vitest parallelism → per-worker tmpdir prevents race condition → no flaky failures

## Acceptance Criteria

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN vitest.config.ts WHEN inspected THEN coverage include is `cli/src/**/*.ts` (not 4 files)
- [ ] AC-2: GIVEN scaffold.ts WHEN unit tests run THEN `replacePlaceholders`, `mergePackageJson`, `generateClaudeMd`, `generateVllntJson` are directly tested
- [ ] AC-3: GIVEN `--preset landing` scaffold output WHEN `tsc --noEmit` runs on it THEN exits 0
- [ ] AC-4: GIVEN every section in templates/sections/ WHEN `useTranslations(X)` calls checked against section.json i18nKeys THEN all namespaces match
- [ ] AC-5: GIVEN scaffolded project WHEN all files scanned THEN zero files contain `{{` placeholder remnants
- [ ] AC-6: GIVEN `pnpm test` without prior build WHEN test starts THEN globalSetup builds or errors clearly

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN vitest runs with pool:forks WHEN multiple workers execute THEN each gets isolated tmpdir (no collision)

### Should Have

- [ ] AC-7: GIVEN `mergeI18nKeys` called with 2 sections sharing a top-level key THEN last-write-wins is documented or collision is detected

## Scope

- [ ] 1. Expand vitest coverage include to `cli/src/**/*.ts` → AC-1
- [ ] 2. Export scaffold.ts pure functions + create unit tests → AC-2
- [ ] 3. Add scaffold+build smoke test (landing preset, `tsc --noEmit`) → AC-3
- [ ] 4. Add template i18n namespace consistency test → AC-4
- [ ] 5. Add placeholder completeness assertion to E2E tests → AC-5
- [ ] 6. Add globalSetup build freshness check → AC-6
- [ ] 7. Fix testRoot singleton for per-worker isolation → AC-E1

### Out of Scope

- Splitting vitest into separate projects (P2)
- E2E parallelization (P2)
- www/ Playwright tests (P2)
- SECTION_DEPS consolidation (P2)

## Quality Checklist

- [ ] All ACs passing
- [ ] No regressions in existing 108 tests
- [ ] Coverage reports honest numbers across all cli/src/
- [ ] scaffold.ts functions exported without breaking existing E2E tests

## Test Strategy
Runner: vitest | E2E: vitest + execaNode | TDD: RED → GREEN per AC
AC-2 → unit (pure functions) | AC-3 → E2E (build smoke) | AC-4,5 → E2E (template integrity)
AC-E1 → E2E (parallel worker isolation) | FH: stale binary → globalSetup guard
Mocks: none

## Analysis

**Assumptions:** scaffold.ts pure functions can be exported without side effects → VALID (they're self-contained) | `tsc --noEmit` on scaffold output needs `pnpm install` first → RISKY (need `--skip-install false` for smoke test, adds ~60s) | Lowering coverage thresholds won't alarm contributors → VALID (honest > inflated)
**Blind Spots:** [ops] Build smoke test needs real npm install — CI time increases ~60s per PR. Consider running only on `cli/templates/**` changes.
**Failure Hypothesis:** IF smoke test requires full install THEN CI time doubles BECAUSE pnpm install + tsc adds 60-90s → mitigate by running smoke test only when template files change (path filter in CI)
**The Real Question:** Confirmed — the test suite needs to validate output correctness, not just process execution. This is the critical missing layer.
**Open Items:** [improvement] Consider `memfs` for scaffold.ts unit tests to avoid tmpdir overhead → explore at ship time

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-25T00:00:00Z | - | Created from deep analysis |
