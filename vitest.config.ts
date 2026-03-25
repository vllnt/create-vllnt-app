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
        'cli/src/core/presets.ts': {
          lines: 100,
          branches: 100,
          functions: 100,
          statements: 100,
        },
        'cli/src/core/detector.ts': {
          lines: 100,
          branches: 95,
          functions: 100,
          statements: 100,
        },
        'cli/src/utils/validate.ts': {
          lines: 100,
          branches: 100,
          functions: 100,
          statements: 100,
        },
        'cli/src/utils/package-manager.ts': {
          lines: 80,
          branches: 80,
          functions: 100,
          statements: 80,
        },
        'cli/src/core/scaffold.ts': {
          lines: 10,
          functions: 30,
        },
      },
      reporter: ['text', 'text-summary', 'json-summary'],
    },
  },
})
