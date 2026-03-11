import vllntConfig from '@vllnt/eslint-config'

export default [
  ...vllntConfig,
  {
    ignores: ['node_modules/', '.next/', 'out/', 'dist/'],
  },
]
