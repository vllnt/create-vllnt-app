# Testing

## Strategy

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| Unit | Jest | `*.test.ts` (colocated) | Pure functions, hooks, utilities |
| E2E | Maestro | `.maestro/*.yaml` | User flows on real device/simulator |

## Running Tests

```bash
pnpm test              # Unit tests (jest)
pnpm test:e2e          # E2E tests (maestro)
```

## Unit Tests (Jest)

- Colocate with source: `lib/utils.test.ts` next to `lib/utils.ts`
- Use `jest-expo` preset for React Native compatibility
- Test behavior, not implementation
- Mock only external APIs

## E2E Tests (Maestro)

- Located in `.maestro/`
- Config: `.maestro/config.yaml`
- Test user flows: launch app, tap, scroll, assert visible text
- Real device/simulator — no mocking

## Convex Testing

- Use `convex-test` for function-level testing
- Test validators with invalid inputs
- Verify index-backed queries return correct results
