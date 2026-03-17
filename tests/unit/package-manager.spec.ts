import { describe, it, expect, afterEach } from 'vitest'
import fs from 'fs-extra'
import { createFixtureDir, cleanFixture } from '../helpers/fixtures.js'
import { detectPackageManager, getInstallCommand, getRunCommand } from '../../cli/src/utils/package-manager.js'

describe('detectPackageManager', () => {
  let fixture: string

  afterEach(async () => {
    if (fixture) await cleanFixture(fixture)
  })

  it('detects pnpm from lockfile', async () => {
    fixture = await createFixtureDir({ 'pnpm-lock.yaml': '' })
    expect(detectPackageManager(fixture)).toBe('pnpm')
  })

  it('detects yarn from lockfile', async () => {
    fixture = await createFixtureDir({ 'yarn.lock': '' })
    expect(detectPackageManager(fixture)).toBe('yarn')
  })

  it('detects bun from lockfile', async () => {
    fixture = await createFixtureDir({ 'bun.lockb': '' })
    expect(detectPackageManager(fixture)).toBe('bun')
  })

  it('detects npm from lockfile', async () => {
    fixture = await createFixtureDir({ 'package-lock.json': '{}' })
    expect(detectPackageManager(fixture)).toBe('npm')
  })

  it('defaults to pnpm when no lockfile found', async () => {
    fixture = await createFixtureDir({})
    expect(detectPackageManager(fixture)).toBe('pnpm')
  })

  it('pnpm wins when multiple lockfiles exist (first match)', async () => {
    fixture = await createFixtureDir({
      'pnpm-lock.yaml': '',
      'yarn.lock': '',
      'package-lock.json': '{}',
    })
    expect(detectPackageManager(fixture)).toBe('pnpm')
  })
})

describe('getInstallCommand', () => {
  it('returns correct command for each package manager', () => {
    expect(getInstallCommand('pnpm')).toBe('pnpm install')
    expect(getInstallCommand('yarn')).toBe('yarn')
    expect(getInstallCommand('bun')).toBe('bun install')
    expect(getInstallCommand('npm')).toBe('npm install')
  })
})

describe('getRunCommand', () => {
  it('returns correct run command for each package manager', () => {
    expect(getRunCommand('pnpm', 'dev')).toBe('pnpm dev')
    expect(getRunCommand('yarn', 'dev')).toBe('yarn dev')
    expect(getRunCommand('bun', 'dev')).toBe('bun run dev')
    expect(getRunCommand('npm', 'dev')).toBe('npm run dev')
  })
})
