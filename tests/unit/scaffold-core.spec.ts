import { describe, it, expect } from 'vitest'
import {
  replacePlaceholders,
  generateClaudeMd,
  generateAgentsMd,
  generateVllntJson,
} from '../../cli/src/core/scaffold.js'
import type { SectionMeta } from '../../cli/src/core/presets.js'

const mockSectionMeta: SectionMeta = {
  name: 'landing',
  routeGroup: '(marketing)',
  requires: [],
  requiresBackend: false,
  dependencies: {},
  devDependencies: {},
  i18nNamespace: 'marketing',
  i18nKeys: { marketing: { title: 'Welcome' } },
  claudeMdRules: ['Landing pages use Server Components'],
  agentsMdExtensions: '### Landing Section\n- Marketing pages in (marketing)/',
}

const backendSectionMeta: SectionMeta = {
  name: 'dashboard',
  routeGroup: '(dashboard)',
  requires: ['auth'],
  requiresBackend: true,
  dependencies: {},
  devDependencies: {},
  i18nNamespace: 'dashboard',
  i18nKeys: { dashboard: { title: 'Dashboard' } },
  claudeMdRules: ['Dashboard pages are auth-protected'],
  agentsMdExtensions: '### Dashboard Section\n- Protected routes in (dashboard)/',
}

describe('replacePlaceholders', () => {
  it('replaces single placeholder', () => {
    expect(replacePlaceholders('Hello {{name}}', { name: 'world' })).toBe('Hello world')
  })

  it('replaces multiple occurrences of same placeholder', () => {
    expect(replacePlaceholders('{{x}} and {{x}}', { x: 'a' })).toBe('a and a')
  })

  it('replaces multiple different placeholders', () => {
    const result = replacePlaceholders('{{a}} {{b}}', { a: '1', b: '2' })
    expect(result).toBe('1 2')
  })

  it('returns content unchanged when no placeholders match', () => {
    expect(replacePlaceholders('no placeholders here', { x: 'y' })).toBe('no placeholders here')
  })

  it('handles empty replacements', () => {
    expect(replacePlaceholders('{{x}}', { x: '' })).toBe('')
  })

  it('does not replace partial matches', () => {
    expect(replacePlaceholders('{x}', { x: 'y' })).toBe('{x}')
  })

  it('handles special regex characters in replacement value', () => {
    expect(replacePlaceholders('{{name}}', { name: '$1.00' })).toBe('$1.00')
  })
})

describe('generateClaudeMd', () => {
  it('includes project name in title', () => {
    const result = generateClaudeMd('my-app', ['landing'], [mockSectionMeta], false)
    expect(result).toContain('# my-app')
  })

  it('includes BLOCKING rules section', () => {
    const result = generateClaudeMd('my-app', ['landing'], [mockSectionMeta], false)
    expect(result).toContain('## BLOCKING Rules')
    expect(result).toContain('No `any` type')
  })

  it('includes section-specific rules', () => {
    const result = generateClaudeMd('my-app', ['landing'], [mockSectionMeta], false)
    expect(result).toContain('Landing pages use Server Components')
  })

  it('includes backend stack when includeBackend is true', () => {
    const result = generateClaudeMd('my-app', ['dashboard'], [backendSectionMeta], true)
    expect(result).toContain('Convex')
    expect(result).toContain('npx convex dev')
  })

  it('excludes backend stack when includeBackend is false', () => {
    const result = generateClaudeMd('my-app', ['landing'], [mockSectionMeta], false)
    expect(result).not.toContain('npx convex dev')
  })

  it('lists active sections', () => {
    const result = generateClaudeMd('my-app', ['landing', 'blog'], [mockSectionMeta], false)
    expect(result).toContain('`landing`')
    expect(result).toContain('`blog`')
  })

  it('output is under 200 lines', () => {
    const result = generateClaudeMd('my-app', ['landing'], [mockSectionMeta], false)
    expect(result.split('\n').length).toBeLessThanOrEqual(200)
  })
})

describe('generateAgentsMd', () => {
  it('includes project name', () => {
    const result = generateAgentsMd('my-app', [mockSectionMeta], false)
    expect(result).toContain('# my-app')
  })

  it('includes extension points table', () => {
    const result = generateAgentsMd('my-app', [mockSectionMeta], false)
    expect(result).toContain('Extension Points')
    expect(result).toContain('New page')
  })

  it('includes section-specific docs', () => {
    const result = generateAgentsMd('my-app', [mockSectionMeta], false)
    expect(result).toContain('Landing Section')
  })

  it('includes convex domain row when backend enabled', () => {
    const result = generateAgentsMd('my-app', [backendSectionMeta], true)
    expect(result).toContain('New domain')
    expect(result).toContain('convex/{domain}')
  })

  it('excludes convex when no backend', () => {
    const result = generateAgentsMd('my-app', [mockSectionMeta], false)
    expect(result).not.toContain('convex/{domain}')
  })
})

describe('generateVllntJson', () => {
  it('produces valid JSON', () => {
    const result = generateVllntJson('saas', ['landing', 'dashboard', 'auth'], true)
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('includes correct fields', () => {
    const parsed = JSON.parse(generateVllntJson('saas', ['landing', 'auth'], true))
    expect(parsed.version).toBe('1.0')
    expect(parsed.preset).toBe('saas')
    expect(parsed.sections).toEqual(['landing', 'auth'])
    expect(parsed.backend).toBe(true)
    expect(parsed.created).toBeDefined()
  })

  it('reflects backend=false when no backend', () => {
    const parsed = JSON.parse(generateVllntJson('landing', ['landing'], false))
    expect(parsed.backend).toBe(false)
  })

  it('created field is valid ISO timestamp', () => {
    const parsed = JSON.parse(generateVllntJson('saas', [], true))
    expect(new Date(parsed.created).toISOString()).toBe(parsed.created)
  })
})
