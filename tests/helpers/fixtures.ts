import fs from 'fs-extra'
import path from 'node:path'
import { getTestRoot } from './tmp.js'

export async function createFixtureDir(
  files: Record<string, string | object> = {},
  prefix = 'vllnt-fixture-',
): Promise<string> {
  const root = await getTestRoot()
  const dir = await fs.mkdtemp(path.join(root, prefix))

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    await fs.ensureDir(path.dirname(fullPath))
    if (typeof content === 'object') {
      await fs.writeJson(fullPath, content, { spaces: 2 })
    } else {
      await fs.writeFile(fullPath, content, 'utf-8')
    }
  }

  return dir
}

export async function createWebFixture(name = 'test-web'): Promise<string> {
  return createFixtureDir({
    'package.json': { name, dependencies: { next: '^16.0.0' } },
    'next.config.mjs': 'export default {}',
    'vllnt.json': { version: '1', preset: 'saas', sections: ['landing', 'dashboard', 'auth'], backend: true },
    'CLAUDE.md': '# Project Rules\n\nBLOCKING: follow these rules',
    'node_modules/.package-lock.json': '{}',
  })
}

export async function createMobileFixture(name = 'test-mobile'): Promise<string> {
  return createFixtureDir({
    'package.json': { name, dependencies: { expo: '^55.0.0' } },
    'app.json': { expo: { name } },
    'metro.config.cjs': 'module.exports = {}',
  })
}

export async function createMonorepoFixture(name = 'test-mono'): Promise<string> {
  return createFixtureDir({
    'package.json': { name },
    'pnpm-workspace.yaml': 'packages:\n  - apps/*\n  - packages/*',
    'turbo.json': { tasks: {} },
    'apps/web/.gitkeep': '',
    'apps/mobile/.gitkeep': '',
  })
}

export async function cleanFixture(dir: string): Promise<void> {
  await fs.remove(dir)
}
