import fs from 'node:fs'
import path from 'node:path'
import type { Template } from '../commands/new.js'

interface ProjectInfo {
  type: Template | null
  root: string
  hasConvex: boolean
  isMonorepo: boolean
}

export function detectProject(cwd = process.cwd()): ProjectInfo {
  const info: ProjectInfo = {
    type: null,
    root: cwd,
    hasConvex: false,
    isMonorepo: false,
  }

  if (fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml')) ||
      fs.existsSync(path.join(cwd, 'turbo.json'))) {
    info.isMonorepo = true
  }

  if (fs.existsSync(path.join(cwd, 'convex')) ||
      fs.existsSync(path.join(cwd, 'convex.json'))) {
    info.hasConvex = true
  }

  if (info.isMonorepo &&
      fs.existsSync(path.join(cwd, 'apps', 'web')) &&
      fs.existsSync(path.join(cwd, 'apps', 'mobile'))) {
    info.type = 'fullstack'
    return info
  }

  if (fs.existsSync(path.join(cwd, 'next.config.mjs')) ||
      fs.existsSync(path.join(cwd, 'next.config.ts')) ||
      fs.existsSync(path.join(cwd, 'next.config.js'))) {
    info.type = 'web'
    return info
  }

  if (fs.existsSync(path.join(cwd, 'app.json')) &&
      fs.existsSync(path.join(cwd, 'metro.config.cjs'))) {
    info.type = 'mobile'
    return info
  }

  const pkgPath = path.join(cwd, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      if (deps.next) {
        info.type = 'web'
      } else if (deps.expo) {
        info.type = 'mobile'
      }
    } catch {
      // noop
    }
  }

  return info
}
