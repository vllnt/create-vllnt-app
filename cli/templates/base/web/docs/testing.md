# Testing

## Strategy

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| Unit | Vitest | `*.test.ts` (colocated) | Pure functions, hooks, utilities |
| E2E | Playwright | `tests/e2e/*.spec.ts` | User flows in real browser |

## Running Tests

```bash
pnpm test              # Unit tests (vitest)
pnpm test:watch        # Unit tests in watch mode
pnpm test:e2e          # E2E tests (playwright)
```

## Unit Tests (Vitest)

- Colocate with source: `lib/utils.test.ts` next to `lib/utils.ts`
- Test behavior, not implementation
- Mock only external APIs — use real Convex in tests when possible

## E2E Tests (Playwright)

- Located in `tests/e2e/`
- Config: `playwright.config.ts` (3 viewports: desktop, tablet, mobile)
- Test user flows: navigate, interact, verify outcomes
- No mocking of UI rendering

## Convex Testing

- Use `convex-test` for function-level testing
- Test validators with invalid inputs
- Verify index-backed queries return correct results
- Test mutation idempotency where applicable

## Coverage Goals

- Critical paths (auth, data mutations): 100% E2E coverage
- Utilities and pure functions: unit tests
- UI components: E2E tests in context of user flows
