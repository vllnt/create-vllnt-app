import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'fs-extra'
import { execaNode } from 'execa'

const CLI_PATH = path.resolve(__dirname, '../../cli/dist/index.js')

describe('scaffold-mobile', () => {
  let tmpDir: string
  let projectDir: string
  const projectName = 'test-mobile-app'

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vllnt-test-mobile-'))
    projectDir = path.join(tmpDir, projectName)
  })

  afterAll(async () => {
    if (tmpDir) {
      await fs.remove(tmpDir)
    }
  })

  it('AC-2: scaffolds a mobile project with correct structure', async () => {
    const result = await execaNode(CLI_PATH, [
      'new', projectName,
      '--template', 'mobile',
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

  it('AC-5: CLAUDE.md exists with platform rules', () => {
    const claudePath = path.join(projectDir, 'CLAUDE.md')
    expect(fs.existsSync(claudePath), 'CLAUDE.md missing').toBe(true)

    const content = fs.readFileSync(claudePath, 'utf-8')
    const lineCount = content.split('\n').length
    expect(lineCount, `CLAUDE.md is ${lineCount} lines, max 200`).toBeLessThanOrEqual(200)

    expect(content).toContain('convex')
    expect(content).toContain('features/')
    expect(content).toContain('Expo')
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

  it('AC-7: docs/ has 6 files', () => {
    const docsDir = path.join(projectDir, 'docs')
    expect(fs.existsSync(docsDir), 'docs/ missing').toBe(true)

    const expectedFiles = [
      'architecture.md',
      'conventions.md',
      'testing.md',
      'i18n.md',
      'theming.md',
      'extending.md',
    ]

    for (const file of expectedFiles) {
      expect(
        fs.existsSync(path.join(docsDir, file)),
        `docs/${file} missing`,
      ).toBe(true)

      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8')
      expect(content.trim().length, `docs/${file} is empty`).toBeGreaterThan(0)
    }
  })

  it('AC-8: features/ and components/ structure exists', () => {
    expect(fs.existsSync(path.join(projectDir, 'features'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'features', 'auth'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'features', 'auth', 'components'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'features', 'auth', 'hooks'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'features', 'auth', 'index.ts'))).toBe(true)

    expect(fs.existsSync(path.join(projectDir, 'components'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'components', 'ui'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'components', 'layout'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'components', 'providers'))).toBe(true)
  })

  it('AC-9: convex/ has domain-folder structure with auth/', () => {
    expect(fs.existsSync(path.join(projectDir, 'convex'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'convex', 'schema.ts'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'convex', 'auth', 'schemas.ts'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'convex', 'auth', 'queries.ts'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'convex', 'auth', 'mutations.ts'))).toBe(true)

    const schemas = fs.readFileSync(
      path.join(projectDir, 'convex', 'auth', 'schemas.ts'),
      'utf-8',
    )
    expect(schemas).toContain('Validator')

    const queries = fs.readFileSync(
      path.join(projectDir, 'convex', 'auth', 'queries.ts'),
      'utf-8',
    )
    expect(queries).toContain('withIndex')
    expect(queries).toContain('.take(')
    expect(queries).toContain('args')
    expect(queries).toContain('returns')
  })

  it('AC-9b: convex.config.ts exists', () => {
    expect(
      fs.existsSync(path.join(projectDir, 'convex', 'convex.config.ts')),
    ).toBe(true)
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

  it('Expo-specific: app.json exists with project config', () => {
    const appJsonPath = path.join(projectDir, 'app.json')
    expect(fs.existsSync(appJsonPath), 'app.json missing').toBe(true)

    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'))
    expect(appJson.expo).toBeDefined()
    expect(appJson.expo.name).toBe(projectName)
  })

  it('Expo-specific: app/ has tab layout structure', () => {
    expect(fs.existsSync(path.join(projectDir, 'app', '_layout.tsx'))).toBe(true)
    expect(fs.existsSync(path.join(projectDir, 'app', '(tabs)'))).toBe(true)
  })
})
