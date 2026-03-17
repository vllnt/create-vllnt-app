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
