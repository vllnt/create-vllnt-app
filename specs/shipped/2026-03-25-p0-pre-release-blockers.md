---
title: "P0: Pre-Release Security & Bug Fixes"
status: shipped
shipped: 2026-03-25
created: 2026-03-25
estimate: 2h
tier: mini
---

# P0: Pre-Release Security & Bug Fixes

## Context

Deep test analysis found 4 pre-release blockers: a critical path traversal in `--sections`, 2 i18n namespace mismatches that crash scaffolded projects on first `pnpm dev`, no dependency audit in CI, and an unused `handlebars` dep widening attack surface. All must be fixed before public npm release.

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| cli/src/core/scaffold.ts | MODIFY | Add `startsWith` containment check in section path resolution |
| cli/src/commands/new.ts | MODIFY | Validate `--sections` values against `ALL_SECTIONS` allowlist before passing to scaffold |
| cli/templates/sections/landing/section.json | MODIFY | Fix i18n namespace: `Landing` → match `useTranslations()` call in template |
| cli/templates/sections/dashboard/section.json | MODIFY | Fix i18n namespace: `Dashboard` → match `useTranslations()` call in template |
| cli/package.json | MODIFY | Remove unused `handlebars` dependency |
| .github/workflows/ci.yml | MODIFY | Add `pnpm audit --audit-level=high` step |
| tests/e2e/scaffold-options.spec.ts | MODIFY | Add path traversal rejection test |
| tests/unit/validate.spec.ts | MODIFY | Add section name allowlist test |

**Reuse:** `ALL_SECTIONS` from `cli/src/core/presets.ts` as the section allowlist
**Breaking changes:** None — fixes invalid behavior
**New dependencies:** None

## User Journey

1. User runs `vllnt new app --sections ../../../etc` → System rejects with error "Invalid section: ../../../etc" → exits 1
2. User runs `vllnt new app --preset landing --yes` → `pnpm dev` → Landing page renders without i18n crash
3. CI runs on PR → `pnpm audit` catches known vulnerabilities → blocks merge if high/critical found

Error: User passes `--sections ../../private-data` → System validates against allowlist → rejects with clear error listing valid sections

## Acceptance Criteria

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN `--sections ../../../etc` WHEN scaffold runs THEN exits 1 with "Invalid section" error, no files copied outside templates/sections/
- [ ] AC-2: GIVEN `--sections unknownsection` WHEN scaffold runs THEN exits 1 listing valid section names
- [ ] AC-3: GIVEN `--preset landing` scaffold WHEN user runs `pnpm dev` THEN landing page renders without i18n namespace error
- [ ] AC-4: GIVEN `--preset saas` scaffold WHEN user navigates to dashboard THEN dashboard renders without i18n namespace error
- [ ] AC-5: GIVEN CI workflow WHEN PR opened THEN `pnpm audit --audit-level=high` runs and gates merge
- [ ] AC-6: GIVEN `cli/package.json` WHEN inspected THEN `handlebars` is not in dependencies

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN `--sections` with path traversal (`../`, absolute path) WHEN scaffold runs THEN zero files read from outside `templates/sections/` directory
- [ ] AC-E2: GIVEN section name not in `ALL_SECTIONS` WHEN scaffold runs in `--agent` mode THEN JSON error output includes valid section names

## Scope

- [ ] 1. Add section path containment check in scaffold.ts → AC-1, AC-E1
- [ ] 2. Add `--sections` allowlist validation in new.ts → AC-2, AC-E2
- [ ] 3. Fix landing section.json i18n namespace → AC-3
- [ ] 4. Fix dashboard section.json i18n namespace → AC-4
- [ ] 5. Add `pnpm audit` to ci.yml → AC-5
- [ ] 6. Remove `handlebars` from cli/package.json → AC-6
- [ ] 7. Add regression tests for path traversal + invalid section → AC-1, AC-2, AC-E1, AC-E2

### Out of Scope

- Coverage expansion (P1)
- scaffold.ts unit tests (P1)
- Build smoke test (P1)
- Performance improvements (P2)

## Quality Checklist

- [ ] All ACs passing
- [ ] No regressions in existing tests
- [ ] Error states handled with actionable messages
- [ ] Path traversal blocked for all variants (`../`, absolute paths, symlinks)
- [ ] i18n fix verified by checking `useTranslations()` calls match section.json namespace keys

## Test Strategy
Runner: vitest | E2E: vitest + execaNode | TDD: RED → GREEN per AC
AC-1 → E2E (path traversal rejection) | AC-2 → E2E (invalid section rejection) | AC-3,4 → verify section.json namespace matches template
AC-E1 → E2E (no files from outside templates/) | FH-S1 → defensive test (arbitrary FS read blocked)
Mocks: none — real CLI binary, real filesystem

## Analysis

**Assumptions:** Path traversal is reachable via CLI args → VALID (confirmed in new.ts line 162) | i18n namespace mismatch causes runtime crash → RISKY (depends on next-intl strict mode config) | handlebars removal has no side effects → VALID (grep confirms 0 imports)
**Blind Spots:** [security] `vllnt.json` sections field is also user-writable and read by `doctor` without validation — should validate there too
**Failure Hypothesis:** IF containment check uses string comparison without path normalization THEN `--sections ./landing/../../../etc` bypasses it BECAUSE `path.resolve` normalizes before `startsWith` check → use `path.resolve` then `startsWith` on resolved path
**The Real Question:** Confirmed — these are real bugs that block public release. The path traversal is the highest priority.
**Open Items:** [risk] `doctor.ts` also reads section names from `vllnt.json` without validation → update spec to add doctor validation in P1

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-25T00:00:00Z | - | Created from deep analysis |
