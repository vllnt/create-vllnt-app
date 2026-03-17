import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 60_000,
    hookTimeout: 30_000,
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'cli/src/core/presets.ts',
        'cli/src/core/detector.ts',
        'cli/src/utils/validate.ts',
        'cli/src/utils/package-manager.ts',
      ],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 90,
        statements: 85,
      },
      reporter: ['text', 'text-summary', 'json-summary'],
    },
  },
})
