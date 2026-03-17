import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import fs from 'fs-extra'
import { runCli, createTmpDir, cleanTmpDir, parseJsonOutput, fileExists, readFile } from '../helpers/cli.js'
import { PRESETS } from '../../cli/src/core/presets.js'

describe('scaffold-sections', () => {
  describe('saas preset', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-sections-saas-')
      projectDir = path.join(tmpDir, 'saas-app')

      await runCli(
        ['new', 'saas-app', '--preset', 'saas', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-12: includes landing, dashboard, and auth sections', () => {
      expect(fileExists(projectDir, 'app', '[locale]', '(marketing)')).toBe(true)
      expect(fileExists(projectDir, 'app', '[locale]', '(dashboard)')).toBe(true)
      expect(fileExists(projectDir, 'app', '[locale]', '(auth)')).toBe(true)
    })

    it('AC-12: vllnt.json lists correct sections', () => {
      const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
      expect(vllntJson.sections).toContain('landing')
      expect(vllntJson.sections).toContain('dashboard')
      expect(vllntJson.sections).toContain('auth')
      expect(vllntJson.preset).toBe('saas')
      expect(vllntJson.backend).toBe(true)
    })

    it('FH-2: no duplicate sections in vllnt.json', () => {
      const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
      const uniqueSections = new Set(vllntJson.sections)
      expect(uniqueSections.size).toBe(vllntJson.sections.length)
    })
  })

  describe('custom --sections', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-sections-custom-')
      projectDir = path.join(tmpDir, 'custom-app')

      await runCli(
        ['new', 'custom-app', '--sections', 'landing,blog', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-13: includes exactly landing and blog', () => {
      expect(fileExists(projectDir, 'app', '[locale]', '(marketing)')).toBe(true)
      expect(fileExists(projectDir, 'app', '[locale]', '(blog)')).toBe(true)
      expect(fileExists(projectDir, 'app', '[locale]', '(dashboard)')).toBe(false)
      expect(fileExists(projectDir, 'app', '[locale]', '(auth)')).toBe(false)
    })

    it('AC-13: no backend files', () => {
      expect(fileExists(projectDir, 'convex')).toBe(false)
    })

    it('AC-13: vllnt.json reflects custom sections', () => {
      const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
      expect(vllntJson.sections).toContain('landing')
      expect(vllntJson.sections).toContain('blog')
      expect(vllntJson.sections).not.toContain('auth')
      expect(vllntJson.backend).toBe(false)
    })
  })

  describe('transitive dependency resolution', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-sections-transitive-')
      projectDir = path.join(tmpDir, 'transitive-app')

      await runCli(
        ['new', 'transitive-app', '--sections', 'dashboard', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-14: auto-resolves auth as transitive dep for dashboard', () => {
      expect(fileExists(projectDir, 'app', '[locale]', '(dashboard)')).toBe(true)
      expect(fileExists(projectDir, 'app', '[locale]', '(auth)')).toBe(true)
    })

    it('AC-14: vllnt.json includes both sections', () => {
      const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
      expect(vllntJson.sections).toContain('dashboard')
      expect(vllntJson.sections).toContain('auth')
      expect(vllntJson.backend).toBe(true)
    })
  })

  describe('all presets scaffold successfully', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-presets-all-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    for (const preset of PRESETS) {
      it(`AC-20: preset "${preset.name}" scaffolds without error`, async () => {
        const projectName = `test-${preset.name}`
        const result = await runCli(
          ['new', projectName, '--preset', preset.name, '--yes', '--skip-install'],
          { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
        )

        expect(result.exitCode, `Preset "${preset.name}" failed: ${result.stderr}`).toBe(0)

        const projectDir = path.join(tmpDir, projectName)
        expect(fileExists(projectDir, 'vllnt.json')).toBe(true)
        expect(fileExists(projectDir, 'package.json')).toBe(true)

        const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
        expect(vllntJson.preset).toBe(preset.name)
        expect(vllntJson.sections.length).toBe(preset.sections.length)
      })
    }
  })
})
