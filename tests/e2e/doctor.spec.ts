import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import fs from 'fs-extra'
import { runCli, createTmpDir, cleanTmpDir } from '../helpers/cli.js'

describe('vllnt doctor', () => {
  describe('on healthy scaffolded project', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-doctor-healthy-')
      projectDir = path.join(tmpDir, 'healthy-app')

      await runCli(
        ['new', 'healthy-app', '--preset', 'saas', '--convex', 'cloud', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-9: returns correct project info and structure checks passing', async () => {
      const result = await runCli(['doctor', '--json'], {
        cwd: projectDir,
        env: { VLLNT_AGENT: '1' },
      })

      const output = JSON.parse(result.stdout) as {
        project: { name: string; sections: string[]; backend: boolean }
        checks: Array<{ id: string; status: string }>
        summary: { pass: number; warn: number; fail: number }
      }

      expect(output.project.name).toBe('healthy-app')
      expect(output.project.sections).toContain('landing')
      expect(output.project.sections).toContain('dashboard')
      expect(output.project.sections).toContain('auth')
      expect(output.project.backend).toBe(true)

      const vllntCheck = output.checks.find((c) => c.id === 'vllnt-json')
      expect(vllntCheck?.status).toBe('pass')

      const pkgCheck = output.checks.find((c) => c.id === 'package-json')
      expect(pkgCheck?.status).toBe('pass')

      const claudeCheck = output.checks.find((c) => c.id === 'claude-md')
      expect(claudeCheck?.status).toBe('pass')

      const depsCheck = output.checks.find((c) => c.id === 'deps-installed')
      expect(depsCheck?.status).toBe('fail')
    })
  })

  describe('on empty directory', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-doctor-empty-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-10: returns failing checks and exit code 2', async () => {
      const result = await runCli(['doctor', '--json'], {
        cwd: tmpDir,
        env: { VLLNT_AGENT: '1' },
      })

      expect(result.exitCode).toBe(2)

      const output = JSON.parse(result.stdout) as {
        checks: Array<{ id: string; status: string }>
        summary: { pass: number; warn: number; fail: number }
      }

      expect(output.summary.fail).toBeGreaterThan(0)

      const vllntCheck = output.checks.find((c) => c.id === 'vllnt-json')
      expect(vllntCheck?.status).toBe('fail')

      const pkgCheck = output.checks.find((c) => c.id === 'package-json')
      expect(pkgCheck?.status).toBe('fail')

      const depsCheck = output.checks.find((c) => c.id === 'deps-installed')
      expect(depsCheck?.status).toBe('fail')
    })
  })

  describe('section preflight checks', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-doctor-preflight-')
      projectDir = path.join(tmpDir, 'preflight-app')

      await runCli(
        ['new', 'preflight-app', '--sections', 'landing,blog', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('AC-11: fails for dashboard without auth section', async () => {
      const result = await runCli(['doctor', '--json', '--for', 'dashboard'], {
        cwd: projectDir,
        env: { VLLNT_AGENT: '1' },
      })

      expect(result.exitCode).toBe(2)

      const output = JSON.parse(result.stdout) as {
        checks: Array<{ id: string; status: string; message: string }>
        summary: { fail: number }
      }

      const authReqCheck = output.checks.find((c) => c.id === 'dashboard-requires-auth')
      expect(authReqCheck?.status).toBe('fail')
      expect(authReqCheck?.message).toContain('requires')
    })

    it('AC-S2: fails for unknown section', async () => {
      const result = await runCli(['doctor', '--json', '--for', 'unknownsection'], {
        cwd: projectDir,
        env: { VLLNT_AGENT: '1' },
      })

      expect(result.exitCode).toBe(2)

      const output = JSON.parse(result.stdout) as {
        checks: Array<{ id: string; status: string; message: string }>
      }

      const unknownCheck = output.checks.find((c) => c.id === 'unknownsection-unknown')
      expect(unknownCheck?.status).toBe('fail')
      expect(unknownCheck?.message).toContain('Unknown section')
    })
  })
})
