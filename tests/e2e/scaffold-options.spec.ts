import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import fs from 'fs-extra'
import { runCli, createTmpDir, cleanTmpDir, parseJsonOutput, fileExists, readFile, listFiles } from '../helpers/cli.js'

describe('scaffold-options', () => {
  describe('--skip-backend', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-skipbackend-')
      projectDir = path.join(tmpDir, 'no-backend-app')

      await runCli(
        ['new', 'no-backend-app', '--preset', 'saas', '--yes', '--skip-install', '--skip-backend', '--agent'],
        { cwd: tmpDir },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-15: no convex/ directory exists', () => {
      expect(fileExists(projectDir, 'convex')).toBe(false)
    })

    it('FH-1: no convex files anywhere in project', () => {
      const allFiles = listFiles(projectDir)
      const convexFiles = allFiles.filter((f) => f.includes('convex'))
      expect(convexFiles, `Found convex files: ${convexFiles.join(', ')}`).toHaveLength(0)
    })

    it('AC-15: vllnt.json reflects backend=false', () => {
      const vllntJson = JSON.parse(readFile(projectDir, 'vllnt.json'))
      expect(vllntJson.backend).toBe(false)
    })
  })

  describe('section validation', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-section-validation-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('rejects --sections with path traversal', async () => {
      const result = await runCli(
        ['new', 'traversal-app', '--sections', '../../../etc', '--yes', '--skip-install', '--agent'],
        { cwd: tmpDir },
      )

      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string; message: string }
      expect(output.error).toBe('INVALID_SECTION')
      expect(fs.existsSync(path.join(tmpDir, 'traversal-app'))).toBe(false)
    })

    it('rejects --sections not in ALL_SECTIONS allowlist', async () => {
      const result = await runCli(
        ['new', 'invalid-section-app', '--sections', 'nonexistent', '--yes', '--skip-install', '--agent'],
        { cwd: tmpDir },
      )

      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string; message: string }
      expect(output.error).toBe('INVALID_SECTION')
      expect(output.message).toContain('Valid:')
    })

    it('no unreplaced {{placeholder}} in scaffolded landing project', async () => {
      const dir = path.join(tmpDir, 'placeholder-check')
      await runCli(
        ['new', 'placeholder-check', '--preset', 'landing', '--yes', '--skip-install', '--agent'],
        { cwd: tmpDir },
      )

      const allFiles = listFiles(dir)
      for (const file of allFiles) {
        if (file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.woff2')) continue
        try {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8')
          expect(
            content,
            `Unreplaced placeholder found in ${file}`,
          ).not.toMatch(/\{\{[a-zA-Z]+\}\}/)
        } catch {
          // binary files — skip
        }
      }
    })

    it('i18n namespaces match useTranslations calls in all sections', async () => {
      const sectionsDir = path.resolve(__dirname, '../../cli/templates/sections')
      const sectionNames = fs.readdirSync(sectionsDir).filter((d: string) =>
        fs.statSync(path.join(sectionsDir, d)).isDirectory(),
      )

      for (const section of sectionNames) {
        const metaPath = path.join(sectionsDir, section, 'section.json')
        if (!fs.existsSync(metaPath)) continue

        const meta = fs.readJsonSync(metaPath) as { i18nKeys: Record<string, unknown>; i18nNamespace: string }
        const sectionDir = path.join(sectionsDir, section)
        const allFiles = listFiles(sectionDir).filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'))

        for (const file of allFiles) {
          const content = fs.readFileSync(path.join(sectionDir, file), 'utf-8')
          const matches = content.match(/useTranslations\(['"]([^'"]+)['"]\)/g)
          if (!matches) continue

          for (const match of matches) {
            const namespace = match.match(/useTranslations\(['"]([^'"]+)['"]\)/)![1]
            expect(
              Object.keys(meta.i18nKeys),
              `Section "${section}" file "${file}" calls useTranslations('${namespace}') but i18nKeys has: ${Object.keys(meta.i18nKeys).join(', ')}`,
            ).toContain(namespace)
          }
        }
      }
    })
  })

  describe('error paths', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-errors-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-16: invalid name exits 1 with JSON error', async () => {
      const result = await runCli(
        ['new', 'Invalid Name', '--preset', 'saas', '--yes', '--agent'],
        { cwd: tmpDir },
      )

      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string }
      expect(output.error).toBeTruthy()
    })

    it('AC-17: unknown preset exits 1 with JSON error', async () => {
      const result = await runCli(
        ['new', 'test-app', '--preset', 'nonexistent', '--yes', '--agent'],
        { cwd: tmpDir },
      )

      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string }
      expect(output.error).toBeTruthy()
    })

    it('AC-18: existing non-empty dir exits 1', async () => {
      const existingDir = path.join(tmpDir, 'existing-app')
      await fs.ensureDir(existingDir)
      await fs.writeFile(path.join(existingDir, 'file.txt'), 'content')

      const result = await runCli(
        ['new', 'existing-app', '--preset', 'saas', '--yes', '--agent'],
        { cwd: tmpDir },
      )

      expect(result.exitCode).toBe(1)
    })
  })
})
