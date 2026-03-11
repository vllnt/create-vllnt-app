import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'fs-extra'
import { execaNode } from 'execa'

const CLI_PATH = path.resolve(__dirname, '../../cli/dist/index.js')

describe('scaffold-fullstack', () => {
  let tmpDir: string
  let projectDir: string
  const projectName = 'test-fullstack-app'

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vllnt-test-fs-'))
    projectDir = path.join(tmpDir, projectName)
  })

  afterAll(async () => {
    if (tmpDir) {
      await fs.remove(tmpDir)
    }
  })

  it('AC-3: scaffolds a fullstack monorepo with correct structure', async () => {
    const result = await execaNode(CLI_PATH, [
      'new', projectName,
      '--template', 'fullstack',
      '--yes',
      '--skip-install',
    ], {
      cwd: tmpDir,
      timeout: 60_000,
      env: { ...process.env, NO_COLOR: '1' },
      reject: false,
    })

    expect(result.exitCode, `CLI failed: ${result.stderr}`).toBe(0)
    expect(fs.existsSync(projectDir)).toBe(true)
  })

  it('AC-5: root CLAUDE.md exists with monorepo rules', () => {
    const claudePath = path.join(projectDir, 'CLAUDE.md')
    expect(fs.existsSync(claudePath), 'CLAUDE.md missing').toBe(true)

    const content = fs.readFileSync(claudePath, 'utf-8')
    const lineCount = content.split('\n').length
    expect(lineCount, `CLAUDE.md is ${lineCount} lines, max 200`).toBeLessThanOrEqual(200)

    expect(content).toContain('convex')
    expect(content).toContain('features/')
  })

  it('AC-5b: .cursorrules and .windsurfrules exist', () => {
    expect(fs.existsSync(path.join(projectDir, '.cursorrules'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, '.windsurfrules'))).toBe(true)
  })

  it('AC-6: AGENTS.md exists with required sections', () => {
    const agentsPath = path.join(projectDir, 'AGENTS.md')
    expect(fs.existsSync(agentsPath), 'AGENTS.md missing').toBe(true)

    const content = fs.readFileSync(agentsPath, 'utf-8')
    expect(content).toContain('architecture')
  })

  it('AC-7: docs/ has architecture, conventions, extending', () => {
    const docsDir = path.join(projectDir, 'docs')
    expect(fs.existsSync(docsDir), 'docs/ missing').toBe(true)

    for (const file of ['architecture.md', 'conventions.md', 'extending.md']) {
      expect(
        fs.existsSync(path.join(docsDir, file)),
        `docs/${file} missing`,
      ).toBe(true)

      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8')
      expect(content.trim().length, `docs/${file} is empty`).toBeGreaterThan(0)
    }
  })

  it('monorepo: apps/web and apps/mobile exist', () => {
    expect(fs.existsSync(path.join(projectDir, 'apps', 'web'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'apps', 'mobile'))).toBe(true)
  })

  it('monorepo: packages exist (backend, client, theme, shared)', () => {
    expect(fs.existsSync(path.join(projectDir, 'packages', 'backend'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'packages', 'client'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'packages', 'theme'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'packages', 'shared'))).toBe(true)
  })

  it('monorepo: turbo.json exists', () => {
    expect(fs.existsSync(path.join(projectDir, 'turbo.json'))).toBe(true)

    const turbo = JSON.parse(
      fs.readFileSync(path.join(projectDir, 'turbo.json'), 'utf-8'),
    )
    expect(turbo.tasks).toBeDefined()
  })

  it('monorepo: pnpm-workspace.yaml exists', () => {
    expect(fs.existsSync(path.join(projectDir, 'pnpm-workspace.yaml'))).toBe(true)

    const content = fs.readFileSync(
      path.join(projectDir, 'pnpm-workspace.yaml'),
      'utf-8',
    )
    expect(content).toContain('apps/*')
    expect(content).toContain('packages/*')
  })

  it('monorepo: convex backend in packages/backend/', () => {
    const backendConvex = path.join(projectDir, 'packages', 'backend', 'convex')
    expect(fs.existsSync(backendConvex)).toBe(true)
    expect(fs.existsSync(path.join(backendConvex, 'schema.ts'))).toBe(true)
    expect(fs.existsSync(path.join(backendConvex, 'auth', 'schemas.ts'))).toBe(true)
    expect(fs.existsSync(path.join(backendConvex, 'auth', 'queries.ts'))).toBe(true)
    expect(fs.existsSync(path.join(backendConvex, 'auth', 'mutations.ts'))).toBe(true)

    const schemas = fs.readFileSync(
      path.join(backendConvex, 'auth', 'schemas.ts'),
      'utf-8',
    )
    expect(schemas).toContain('Validator')
  })

  it('monorepo: apps reference @repo/* packages', () => {
    const webPkg = JSON.parse(
      fs.readFileSync(path.join(projectDir, 'apps', 'web', 'package.json'), 'utf-8'),
    )
    expect(webPkg.dependencies['@repo/client']).toBeDefined()

    const mobilePkg = JSON.parse(
      fs.readFileSync(path.join(projectDir, 'apps', 'mobile', 'package.json'), 'utf-8'),
    )
    expect(mobilePkg.dependencies['@repo/client']).toBeDefined()
  })

  it('FH-6: CLAUDE.md has BLOCKING rules first', () => {
    const content = fs.readFileSync(path.join(projectDir, 'CLAUDE.md'), 'utf-8')
    const lines = content.split('\n')
    const blockingIndex = lines.findIndex((l) => /blocking/i.test(l))
    expect(blockingIndex, 'No BLOCKING section found').toBeGreaterThan(-1)
    expect(blockingIndex, 'BLOCKING rules should be in first 30 lines').toBeLessThan(30)
  })

  it('placeholder names replaced with project name', () => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(projectDir, 'package.json'), 'utf-8'),
    )
    expect(pkgJson.name).toBe(projectName)
    expect(pkgJson.name).not.toContain('{{')
  })
})
