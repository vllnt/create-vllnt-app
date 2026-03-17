import { describe, it, expect, afterEach } from 'vitest'
import {
  createFixtureDir,
  createWebFixture,
  createMobileFixture,
  createMonorepoFixture,
  cleanFixture,
} from '../helpers/fixtures.js'
import { detectProject } from '../../cli/src/core/detector.js'

describe('detectProject', () => {
  let fixture: string

  afterEach(async () => {
    if (fixture) await cleanFixture(fixture)
  })

  it('detects web project from next.config.mjs', async () => {
    fixture = await createWebFixture()
    const info = detectProject(fixture)
    expect(info.type).toBe('web')
    expect(info.root).toBe(fixture)
  })

  it('detects web project from next.config.ts', async () => {
    fixture = await createFixtureDir({ 'next.config.ts': 'export default {}' })
    const info = detectProject(fixture)
    expect(info.type).toBe('web')
  })

  it('detects web project from next.config.js', async () => {
    fixture = await createFixtureDir({ 'next.config.js': 'module.exports = {}' })
    const info = detectProject(fixture)
    expect(info.type).toBe('web')
  })

  it('detects mobile project from app.json + metro.config.cjs', async () => {
    fixture = await createMobileFixture()
    const info = detectProject(fixture)
    expect(info.type).toBe('mobile')
  })

  it('detects fullstack monorepo from workspace + apps/', async () => {
    fixture = await createMonorepoFixture()
    const info = detectProject(fixture)
    expect(info.type).toBe('fullstack')
    expect(info.isMonorepo).toBe(true)
  })

  it('detects monorepo flag from pnpm-workspace.yaml', async () => {
    fixture = await createFixtureDir({ 'pnpm-workspace.yaml': 'packages:\n  - packages/*' })
    const info = detectProject(fixture)
    expect(info.isMonorepo).toBe(true)
    expect(info.type).toBeNull()
  })

  it('detects monorepo flag from turbo.json', async () => {
    fixture = await createFixtureDir({ 'turbo.json': { tasks: {} } })
    const info = detectProject(fixture)
    expect(info.isMonorepo).toBe(true)
  })

  it('detects convex from convex/ directory', async () => {
    fixture = await createFixtureDir({ 'convex/.gitkeep': '' })
    const info = detectProject(fixture)
    expect(info.hasConvex).toBe(true)
  })

  it('detects convex from convex.json', async () => {
    fixture = await createFixtureDir({ 'convex.json': {} })
    const info = detectProject(fixture)
    expect(info.hasConvex).toBe(true)
  })

  it('detects web from package.json deps fallback', async () => {
    fixture = await createFixtureDir({
      'package.json': { name: 'test', dependencies: { next: '^16.0.0' } },
    })
    const info = detectProject(fixture)
    expect(info.type).toBe('web')
  })

  it('detects mobile from package.json deps fallback', async () => {
    fixture = await createFixtureDir({
      'package.json': { name: 'test', dependencies: { expo: '^55.0.0' } },
    })
    const info = detectProject(fixture)
    expect(info.type).toBe('mobile')
  })

  it('returns null type for bare directory', async () => {
    fixture = await createFixtureDir({})
    const info = detectProject(fixture)
    expect(info.type).toBeNull()
    expect(info.hasConvex).toBe(false)
    expect(info.isMonorepo).toBe(false)
  })

  it('handles invalid package.json gracefully', async () => {
    fixture = await createFixtureDir({ 'package.json': 'not json' })
    const info = detectProject(fixture)
    expect(info.type).toBeNull()
  })

  it('web wins over mobile when next.config exists (priority test)', async () => {
    fixture = await createFixtureDir({
      'next.config.mjs': 'export default {}',
      'app.json': { expo: { name: 'test' } },
      'metro.config.cjs': 'module.exports = {}',
    })
    const info = detectProject(fixture)
    expect(info.type).toBe('web')
  })
})
