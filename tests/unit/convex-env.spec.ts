import { describe, it, expect } from 'vitest'
import {
  CONVEX_MODES,
  isConvexMode,
  convexEnvBlock,
  convexComposeYml,
  selfHostingDoc,
} from '../../cli/src/core/convex-env.js'

describe('isConvexMode', () => {
  it('accepts supported modes', () => {
    expect(isConvexMode('cloud')).toBe(true)
    expect(isConvexMode('self-hosted')).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isConvexMode('hybrid')).toBe(false)
    expect(isConvexMode('')).toBe(false)
  })

  it('exposes both modes', () => {
    expect(CONVEX_MODES).toEqual(['cloud', 'self-hosted'])
  })
})

describe('convexEnvBlock', () => {
  it('cloud + public var emits empty URL and commented deploy key', () => {
    const out = convexEnvBlock({
      mode: 'cloud',
      publicVar: 'NEXT_PUBLIC_CONVEX_URL',
      includeDeploy: true,
    })
    expect(out).toContain('NEXT_PUBLIC_CONVEX_URL=')
    expect(out).not.toContain('NEXT_PUBLIC_CONVEX_URL=http')
    expect(out).toContain('# CONVEX_DEPLOY_KEY=')
    expect(out).not.toContain('CONVEX_SELF_HOSTED')
  })

  it('self-hosted + public var emits local URL and admin key vars', () => {
    const out = convexEnvBlock({
      mode: 'self-hosted',
      publicVar: 'NEXT_PUBLIC_CONVEX_URL',
      includeDeploy: true,
    })
    expect(out).toContain('NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210')
    expect(out).toContain('CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210')
    expect(out).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY=')
    expect(out).not.toContain('CONVEX_DEPLOY_KEY')
  })

  it('uses the Expo prefix when requested', () => {
    const out = convexEnvBlock({
      mode: 'self-hosted',
      publicVar: 'EXPO_PUBLIC_CONVEX_URL',
      includeDeploy: false,
    })
    expect(out).toContain('EXPO_PUBLIC_CONVEX_URL=http://127.0.0.1:3210')
    expect(out).not.toContain('CONVEX_SELF_HOSTED_ADMIN_KEY')
  })

  it('backend-only file omits the client URL var', () => {
    const cloud = convexEnvBlock({ mode: 'cloud', publicVar: null, includeDeploy: true })
    expect(cloud).not.toContain('NEXT_PUBLIC_CONVEX_URL')
    expect(cloud).not.toContain('EXPO_PUBLIC_CONVEX_URL')
    expect(cloud).toContain('# CONVEX_DEPLOY_KEY=')

    const self = convexEnvBlock({ mode: 'self-hosted', publicVar: null, includeDeploy: true })
    expect(self).toContain('CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210')
    expect(self).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY=')
  })

  it('omits deploy credentials when includeDeploy is false', () => {
    const out = convexEnvBlock({
      mode: 'self-hosted',
      publicVar: 'NEXT_PUBLIC_CONVEX_URL',
      includeDeploy: false,
    })
    expect(out).not.toContain('CONVEX_SELF_HOSTED_URL')
    expect(out).not.toContain('CONVEX_SELF_HOSTED_ADMIN_KEY')
  })
})

describe('convexComposeYml', () => {
  it('defines backend and dashboard services', () => {
    const yml = convexComposeYml()
    expect(yml).toContain('ghcr.io/get-convex/convex-backend')
    expect(yml).toContain('ghcr.io/get-convex/convex-dashboard')
    expect(yml).toContain(':3210"')
    expect(yml).toContain(':6791"')
    expect(yml).toContain('healthcheck')
    expect(yml).toContain('CONVEX_BACKEND_REV')
  })
})

describe('selfHostingDoc', () => {
  it('documents the admin key flow for a root backend', () => {
    const doc = selfHostingDoc({ publicVar: 'NEXT_PUBLIC_CONVEX_URL', backendDir: '.' })
    expect(doc).toContain('generate_admin_key.sh')
    expect(doc).toContain('CONVEX_SELF_HOSTED_ADMIN_KEY')
    expect(doc).toContain('docker compose up -d')
    expect(doc).not.toContain('cd .')
  })

  it('directs self-hosted pushes to convex deploy, not convex dev', () => {
    const doc = selfHostingDoc({ publicVar: 'NEXT_PUBLIC_CONVEX_URL', backendDir: '.' })
    expect(doc).toContain('npx convex deploy')
    // The push step must warn that `convex dev` goes anonymous for self-hosted.
    expect(doc).toMatch(/anonymous/i)
  })

  it('env block tells self-hosted users to deploy, not dev', () => {
    const out = convexEnvBlock({
      mode: 'self-hosted',
      publicVar: 'NEXT_PUBLIC_CONVEX_URL',
      includeDeploy: true,
    })
    expect(out).toContain('convex deploy')
  })

  it('prefixes a cd for a monorepo backend dir', () => {
    const doc = selfHostingDoc({ publicVar: 'NEXT_PUBLIC_CONVEX_URL', backendDir: 'packages/backend' })
    expect(doc).toContain('cd packages/backend')
    expect(doc).toContain("apps/web/.env.local")
  })
})
