import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 60_000,
    hookTimeout: 30_000,
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['tests/setup.ts'],
    globalSetup: ['tests/global-setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'cli/src/**/*.ts',
      ],
      exclude: [
        'cli/src/index.ts',
        'cli/src/utils/banner.ts',
        'cli/src/utils/version.ts',
      ],
      thresholds: {
        lines: 70,
        branches: 60,
        functions: 70,
        statements: 70,
      },
      reporter: ['text', 'text-summary', 'json-summary'],
    },
  },
})
