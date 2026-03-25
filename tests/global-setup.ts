import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

export function setup(): void {
  const dist = resolve('cli/dist/index.js')
  const src = resolve('cli/src/index.ts')

  if (!existsSync(dist)) {
    console.log('[global-setup] cli/dist/index.js not found — building CLI...')
    execSync('pnpm --filter create-vllnt-app build', { stdio: 'inherit' })
    return
  }

  if (existsSync(src) && statSync(src).mtimeMs > statSync(dist).mtimeMs) {
    console.log('[global-setup] CLI source newer than dist — rebuilding...')
    execSync('pnpm --filter create-vllnt-app build', { stdio: 'inherit' })
  }
}
