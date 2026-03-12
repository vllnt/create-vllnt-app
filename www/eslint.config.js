import { nextjs } from '@vllnt/eslint-config'

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'eslint.config.js',
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'next-env.d.ts',
    ],
  },
  ...nextjs,
]
