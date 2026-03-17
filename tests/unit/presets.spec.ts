import { describe, it, expect } from 'vitest'
import {
  PRESETS,
  ALL_SECTIONS,
  resolveTransitiveDeps,
  getPreset,
  needsBackend,
} from '../../cli/src/core/presets.js'

describe('PRESETS', () => {
  it('has exactly 9 presets', () => {
    expect(PRESETS).toHaveLength(9)
  })

  it('each preset has required shape', () => {
    for (const preset of PRESETS) {
      expect(preset).toHaveProperty('name')
      expect(preset).toHaveProperty('label')
      expect(preset).toHaveProperty('hint')
      expect(preset).toHaveProperty('sections')
      expect(preset).toHaveProperty('backend')
      expect(preset.name).toBeTruthy()
      expect(preset.sections.length).toBeGreaterThan(0)
    }
  })

  it('all preset section names are valid', () => {
    for (const preset of PRESETS) {
      for (const section of preset.sections) {
        expect(
          (ALL_SECTIONS as readonly string[]).includes(section),
          `Preset "${preset.name}" has unknown section "${section}"`,
        ).toBe(true)
      }
    }
  })

  it('presets with backend=true include at least one backend section', () => {
    const backendSections = ['dashboard', 'auth', 'admin']
    for (const preset of PRESETS) {
      if (preset.backend) {
        const hasBackendSection = preset.sections.some((s) => backendSections.includes(s))
        expect(
          hasBackendSection,
          `Preset "${preset.name}" has backend=true but no backend sections`,
        ).toBe(true)
      }
    }
  })
})

describe('ALL_SECTIONS', () => {
  it('has 6 sections', () => {
    expect(ALL_SECTIONS).toHaveLength(6)
  })

  it('includes expected sections', () => {
    expect(ALL_SECTIONS).toContain('landing')
    expect(ALL_SECTIONS).toContain('blog')
    expect(ALL_SECTIONS).toContain('dashboard')
    expect(ALL_SECTIONS).toContain('auth')
    expect(ALL_SECTIONS).toContain('docs')
    expect(ALL_SECTIONS).toContain('admin')
  })
})

describe('resolveTransitiveDeps', () => {
  it('returns empty array for empty input', () => {
    expect(resolveTransitiveDeps([])).toEqual([])
  })

  it('returns section as-is when it has no deps', () => {
    const result = resolveTransitiveDeps(['landing'])
    expect(result).toEqual(['landing'])
  })

  it('auto-adds auth for dashboard', () => {
    const result = resolveTransitiveDeps(['dashboard'])
    expect(result).toContain('auth')
    expect(result).toContain('dashboard')
    expect(result.indexOf('auth')).toBeLessThan(result.indexOf('dashboard'))
  })

  it('auto-adds auth for admin', () => {
    const result = resolveTransitiveDeps(['admin'])
    expect(result).toContain('auth')
    expect(result).toContain('admin')
    expect(result.indexOf('auth')).toBeLessThan(result.indexOf('admin'))
  })

  it('does not duplicate auth when both dashboard and admin requested', () => {
    const result = resolveTransitiveDeps(['dashboard', 'admin'])
    const authCount = result.filter((s) => s === 'auth').length
    expect(authCount).toBe(1)
  })

  it('preserves all requested sections plus deps', () => {
    const result = resolveTransitiveDeps(['landing', 'dashboard', 'blog'])
    expect(result).toContain('landing')
    expect(result).toContain('dashboard')
    expect(result).toContain('blog')
    expect(result).toContain('auth')
  })

  it('handles unknown section without crashing', () => {
    const result = resolveTransitiveDeps(['unknown-section'])
    expect(result).toContain('unknown-section')
  })

  it('does not duplicate when section already in input with its dep', () => {
    const result = resolveTransitiveDeps(['auth', 'dashboard'])
    const authCount = result.filter((s) => s === 'auth').length
    expect(authCount).toBe(1)
  })
})

describe('getPreset', () => {
  it('returns preset for each known name', () => {
    const names = ['landing', 'blog', 'marketing', 'saas', 'saas-blog', 'full-saas', 'dashboard', 'internal', 'docs']
    for (const name of names) {
      const preset = getPreset(name)
      expect(preset, `Preset "${name}" not found`).toBeDefined()
      expect(preset!.name).toBe(name)
    }
  })

  it('returns undefined for unknown preset', () => {
    expect(getPreset('nonexistent')).toBeUndefined()
    expect(getPreset('')).toBeUndefined()
  })
})

describe('needsBackend', () => {
  it('returns false for content-only sections', () => {
    expect(needsBackend(['landing'])).toBe(false)
    expect(needsBackend(['blog'])).toBe(false)
    expect(needsBackend(['docs'])).toBe(false)
    expect(needsBackend(['landing', 'blog', 'docs'])).toBe(false)
  })

  it('returns true for sections requiring backend', () => {
    expect(needsBackend(['dashboard'])).toBe(true)
    expect(needsBackend(['auth'])).toBe(true)
    expect(needsBackend(['admin'])).toBe(true)
  })

  it('returns true when mixed with content sections', () => {
    expect(needsBackend(['landing', 'dashboard'])).toBe(true)
    expect(needsBackend(['blog', 'auth'])).toBe(true)
  })

  it('returns false for empty array', () => {
    expect(needsBackend([])).toBe(false)
  })
})
