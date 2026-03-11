import fs from 'node:fs'
import path from 'node:path'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export function detectPackageManager(cwd = process.cwd()): PackageManager {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn'
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun'
  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm'

  const userAgent = process.env.npm_config_user_agent ?? ''
  if (userAgent.startsWith('pnpm')) return 'pnpm'
  if (userAgent.startsWith('yarn')) return 'yarn'
  if (userAgent.startsWith('bun')) return 'bun'

  return 'pnpm'
}

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn'
    case 'bun':
      return 'bun install'
    case 'npm':
      return 'npm install'
  }
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case 'pnpm':
      return `pnpm ${script}`
    case 'yarn':
      return `yarn ${script}`
    case 'bun':
      return `bun run ${script}`
    case 'npm':
      return `npm run ${script}`
  }
}
