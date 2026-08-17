import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import {
  runCli,
  createTmpDir,
  cleanTmpDir,
  parseJsonOutput,
  fileExists,
  readFile,
} from '../helpers/cli.js'

describe('scaffold-convex modes', () => {
  describe('web cloud', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-convex-cloud-')
      projectDir = path.join(tmpDir, 'cloud-app')
      await runCli(
        ['new', 'cloud-app', '--preset', 'saas', '--convex', 'cloud', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('writes cloud Convex env vars', () => {
      const env = readFile(projectDir, '.env.example')
      expect(env).toContain('NEXT_PUBLIC_CONVEX_URL=')
      expect(env).not.toContain('NEXT_PUBLIC_CONVEX_URL=http')
      expect(env).toContain('# CONVEX_DEPLOY_KEY=')
      expect(env).not.toContain('CONVEX_SELF_HOSTED')
    })

    it('does not emit self-hosted infra', () => {
      expect(fileExists(projectDir, 'docker-compose.yml')).toBe(false)
      expect(fileExists(projectDir, 'docs', 'self-hosting.md')).toBe(false)
    })
  })

  describe('web self-hosted', () => {
    let tmpDir: string
    let projectDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-convex-self-')
      projectDir = path.join(tmpDir, 'self-app')
      await runCli(
        ['new', 'self-app', '--preset', 'saas', '--convex', 'self-hosted', '--yes', '--skip-install'],
        { cwd: tmpDir, env: { VLLNT_AGENT: '1' } },
      )
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('writes self-hosted Convex env vars', () => {
      const env = readFile(projectDir, '.env.example')
      expect(env).toContain('NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210')
      expect(env).toContain('CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210')
      expect(env).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY=')
      expect(env).not.toContain('CONVEX_DEPLOY_KEY')
    })

    it('emits docker-compose.yml with backend + dashboard', () => {
      expect(fileExists(projectDir, 'docker-compose.yml')).toBe(true)
      const yml = readFile(projectDir, 'docker-compose.yml')
      expect(yml).toContain('convex-backend')
      expect(yml).toContain('convex-dashboard')
    })

    it('emits docs/self-hosting.md', () => {
      expect(fileExists(projectDir, 'docs', 'self-hosting.md')).toBe(true)
      expect(readFile(projectDir, 'docs', 'self-hosting.md')).toContain('generate_admin_key.sh')
    })
  })

  describe('force-choice', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-convex-force-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('errors when a backend is included but --convex is missing', async () => {
      const result = await runCli(
        ['new', 'no-mode-app', '--preset', 'saas', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string }
      expect(output.error).toBe('CONVEX_MODE_REQUIRED')
    })

    it('errors on an invalid --convex value', async () => {
      const result = await runCli(
        ['new', 'bad-mode-app', '--preset', 'saas', '--convex', 'hybrid', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode).toBe(1)
      const output = parseJsonOutput(result.stdout) as { error: string }
      expect(output.error).toBe('INVALID_CONVEX_MODE')
    })

    it('reports the chosen mode in --agent output', async () => {
      const result = await runCli(
        ['new', 'agent-mode-app', '--preset', 'saas', '--convex', 'self-hosted', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode, result.stderr).toBe(0)
      const output = parseJsonOutput(result.stdout) as { convexMode: string }
      expect(output.convexMode).toBe('self-hosted')
    })

    it('does not require --convex for a backend-less preset', async () => {
      const result = await runCli(
        ['new', 'landing-app', '--preset', 'landing', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode, result.stderr).toBe(0)
      const projectDir = path.join(tmpDir, 'landing-app')
      expect(fileExists(projectDir, 'docker-compose.yml')).toBe(false)
      expect(readFile(projectDir, '.env.example')).not.toContain('CONVEX')
    })
  })

  describe('legacy templates', () => {
    let tmpDir: string

    beforeAll(async () => {
      tmpDir = await createTmpDir('vllnt-convex-legacy-')
    })

    afterAll(async () => {
      if (tmpDir) await cleanTmpDir(tmpDir)
    })

    it('mobile self-hosted writes Expo env + compose', async () => {
      const result = await runCli(
        ['new', 'mob-app', '--template', 'mobile', '--convex', 'self-hosted', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode, result.stderr).toBe(0)
      const projectDir = path.join(tmpDir, 'mob-app')
      const env = readFile(projectDir, '.env.example')
      expect(env).toContain('EXPO_PUBLIC_CONVEX_URL=http://127.0.0.1:3210')
      expect(env).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY=')
      expect(fileExists(projectDir, 'docker-compose.yml')).toBe(true)
    })

    it('fullstack self-hosted writes per-app + backend env', async () => {
      const result = await runCli(
        ['new', 'fs-app', '--template', 'fullstack', '--convex', 'self-hosted', '--yes', '--agent', '--skip-install'],
        { cwd: tmpDir },
      )
      expect(result.exitCode, result.stderr).toBe(0)
      const projectDir = path.join(tmpDir, 'fs-app')
      expect(readFile(projectDir, 'apps', 'web', '.env.example')).toContain(
        'NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210',
      )
      expect(readFile(projectDir, 'apps', 'mobile', '.env.example')).toContain(
        'EXPO_PUBLIC_CONVEX_URL=http://127.0.0.1:3210',
      )
      const backendEnv = readFile(projectDir, 'packages', 'backend', '.env.example')
      expect(backendEnv).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY=')
      expect(backendEnv).not.toContain('NEXT_PUBLIC_CONVEX_URL')
      expect(fileExists(projectDir, 'docs', 'self-hosting.md')).toBe(true)
    })
  })
})
