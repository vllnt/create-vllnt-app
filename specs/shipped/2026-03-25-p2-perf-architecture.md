---
title: "P2: Test Performance & Architecture"
status: shipped
shipped: 2026-03-25
created: 2026-03-25
estimate: 4h
tier: mini
---

# P2: Test Performance & Architecture

## Context

E2E tests run sequentially with 60s timeout. The 9-preset loop in scaffold-sections.spec.ts is O(N) — adding presets linearly increases CI time. `SECTION_DEPS` is duplicated across presets.ts and doctor.ts, guaranteeing drift. www/ (production Next.js app) has zero tests. CI has no parallel job split.

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| vitest.config.ts | MODIFY | Split into vitest projects (unit + e2e), enable pool:forks for E2E |
| tests/e2e/scaffold-sections.spec.ts | MODIFY | Parallelize 9-preset loop via Promise.all or test.concurrent |
| cli/src/core/doctor.ts | MODIFY | Import SECTION_DEPS from presets.ts instead of defining locally |
| cli/src/core/presets.ts | MODIFY | Export SECTION_DEPS with requiresBackend info for doctor |
| tests/unit/section-deps-parity.spec.ts | CREATE | Contract test: every ALL_SECTIONS entry in SECTION_DEPS |
| www/tests/e2e/smoke.spec.ts | CREATE | Playwright smoke: page loads, no console errors, OG image renders |
| www/playwright.config.ts | CREATE | Playwright config for www |
| .github/workflows/ci.yml | MODIFY | Split unit + E2E into parallel jobs; add --reporter=verbose |

**Reuse:** Existing vitest config as base; www already has Playwright template configs in cli/templates/
**Breaking changes:** Vitest project split changes `pnpm test` behavior (runs both projects)
**New dependencies:** @playwright/test for www/ (devDependency)

## User Journey

1. Dev runs `pnpm test` → unit tests complete in <2s → E2E runs in parallel across forks → total <45s (vs ~120s today)
2. Dev adds new preset → adds 0s to CI time (parallel) instead of +5-10s (sequential)
3. Dev adds section to presets.ts → parity test catches if SECTION_DEPS not updated in same PR
4. Dev changes www/ landing page → Playwright smoke catches broken render before deploy

Error: Dev adds section to presets.ts but forgets doctor.ts → parity test fails CI with clear message

## Acceptance Criteria

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN vitest config WHEN inspected THEN unit and E2E are separate projects with distinct timeouts
- [ ] AC-2: GIVEN E2E suite WHEN run with pool:forks THEN files execute in parallel workers (wall-clock <60s on CI)
- [ ] AC-3: GIVEN scaffold-sections 9-preset loop WHEN executed THEN presets run concurrently (not sequential)
- [ ] AC-4: GIVEN SECTION_DEPS WHEN inspected THEN single definition in presets.ts, imported by doctor.ts
- [ ] AC-5: GIVEN www/ WHEN Playwright smoke runs THEN landing page loads, zero console errors
- [ ] AC-6: GIVEN CI workflow WHEN PR opened THEN unit and E2E jobs run in parallel

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN new section in ALL_SECTIONS WHEN SECTION_DEPS not updated THEN parity test fails with descriptive message
- [ ] AC-E2: GIVEN www/ build broken WHEN CI runs THEN www job fails (not silently ignored)

### Should Have

- [ ] AC-7: GIVEN `--reporter=verbose` WHEN CI runs THEN per-test timing visible in logs
- [ ] AC-8: GIVEN `cancel-in-progress: true` on publish workflow WHEN checked THEN set to false (prevent mid-publish cancellation)

## Scope

- [ ] 1. Split vitest into unit + E2E projects → AC-1
- [ ] 2. Enable pool:forks for E2E project → AC-2
- [ ] 3. Parallelize 9-preset loop in scaffold-sections.spec.ts → AC-3
- [ ] 4. Consolidate SECTION_DEPS to single source in presets.ts → AC-4
- [ ] 5. Add parity test for SECTION_DEPS ↔ ALL_SECTIONS → AC-E1
- [ ] 6. Set up Playwright + smoke test for www/ → AC-5
- [ ] 7. Split CI into parallel unit + E2E + www jobs → AC-6, AC-E2
- [ ] 8. Add --reporter=verbose to CI test commands → AC-7

### Out of Scope

- Full Playwright test suite for www/ (just smoke for now)
- Mutation testing
- Contract tests for --agent JSON schema (future spec)
- Interactive prompt testing (future spec)

## Quality Checklist

- [ ] All ACs passing
- [ ] No regressions in existing 108 tests
- [ ] CI total time decreased (target: <4 min total)
- [ ] SECTION_DEPS has single source of truth
- [ ] www/ has at least 1 passing Playwright test

## Test Strategy
Runner: vitest (unit + E2E projects) | E2E: vitest + Playwright (www) | TDD: RED → GREEN per AC
AC-1,2 → verify config (unit) | AC-3 → measure timing (E2E) | AC-4 → verify imports (unit)
AC-5 → Playwright smoke | AC-E1 → unit (parity test)
Mocks: none

## Analysis

**Assumptions:** pool:forks works after P1 fixes testRoot → VALID (P1 is prerequisite) | Playwright adds acceptable CI overhead → RISKY (~30s for install + 1 smoke test) | Consolidating SECTION_DEPS doesn't require doctor.ts restructuring → VALID (doctor only reads deps, not writes)
**Blind Spots:** [ops] www Playwright needs `pnpm dev` running — either use `webServer` config in playwright.config.ts or build+serve. Build+serve is more reliable for CI.
**Failure Hypothesis:** IF pool:forks enabled before P1 testRoot fix THEN parallel E2E workers collide → BECAUSE shared singleton tmpdir → P1 is hard dependency
**The Real Question:** Confirmed — the architecture changes here depend on P1 being shipped first. Ship P0 → P1 → P2 in order.
**Open Items:** [dependency] P2 blocked by P1 (testRoot fix required for parallelization) → enforce ordering

## Notes

Dependencies: P0 → P1 → P2 (sequential)

### Ship Retro (2026-03-25)
**Estimate vs Actual:** 4h → ~2h (200% accuracy)
**What worked:** Vitest project split + concurrent presets delivered measurable speedup. SECTION_DEPS consolidation was clean — single import swap.
**What didn't:** www Playwright + CI split were missed in initial implementation — caught during done validation. Blind spot in spec: webServer config for Playwright CI was correctly flagged but not acted on.
**Next time:** When spec has CI changes, implement CI yaml changes in same pass as code changes — don't leave orchestration for later.

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | Split vitest into unit + E2E projects | DONE | 1 |
| 2 | Enable pool:forks for E2E | DONE | 1 |
| 3 | Parallelize 9-preset loop | DONE | 1 |
| 4 | Consolidate SECTION_DEPS | DONE | 1 |
| 5 | Add parity test | DONE | 1 |
| 6 | Set up Playwright + smoke test for www/ | DONE | 2 |
| 7 | Split CI into parallel jobs | DONE | 2 |
| 8 | Add --reporter=verbose to CI | DONE | 1 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-25T00:00:00Z | - | Created from deep analysis |
| done | 2026-03-25T14:00:00Z | ~2h | All 8 ACs passing |
