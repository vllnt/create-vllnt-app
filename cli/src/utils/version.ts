import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

function getVersion(): string {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const pkgPath = path.resolve(__dirname, '..', 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      return pkg.version ?? '0.0.0'
    }
    const parentPkgPath = path.resolve(__dirname, '..', '..', 'package.json')
    if (fs.existsSync(parentPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(parentPkgPath, 'utf-8'))
      return pkg.version ?? '0.0.0'
    }
  } catch {
    // noop
  }
  return '0.0.0'
}

export const version = getVersion()
