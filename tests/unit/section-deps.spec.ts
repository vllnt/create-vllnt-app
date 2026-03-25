import { describe, it, expect } from 'vitest'
import { ALL_SECTIONS, SECTION_DEPS } from '../../cli/src/core/presets.js'

describe('SECTION_DEPS parity', () => {
  it('every ALL_SECTIONS entry has a SECTION_DEPS entry', () => {
    for (const section of ALL_SECTIONS) {
      expect(
        SECTION_DEPS[section],
        `Section "${section}" is in ALL_SECTIONS but missing from SECTION_DEPS`,
      ).toBeDefined()
    }
  })

  it('every SECTION_DEPS entry is in ALL_SECTIONS', () => {
    for (const section of Object.keys(SECTION_DEPS)) {
      expect(
        (ALL_SECTIONS as readonly string[]).includes(section),
        `Section "${section}" is in SECTION_DEPS but missing from ALL_SECTIONS`,
      ).toBe(true)
    }
  })

  it('SECTION_DEPS entries have valid requires references', () => {
    for (const [section, dep] of Object.entries(SECTION_DEPS)) {
      for (const req of dep.requires) {
        expect(
          SECTION_DEPS[req],
          `Section "${section}" requires "${req}" but it doesn't exist in SECTION_DEPS`,
        ).toBeDefined()
      }
    }
  })

  it('requiresBackend is true for sections that require backend-dependent sections', () => {
    for (const [section, dep] of Object.entries(SECTION_DEPS)) {
      if (dep.requires.length > 0) {
        const anyRequiresBackend = dep.requires.some((r) => SECTION_DEPS[r]?.requiresBackend)
        if (anyRequiresBackend) {
          expect(
            dep.requiresBackend,
            `Section "${section}" requires backend-dependent sections but has requiresBackend=false`,
          ).toBe(true)
        }
      }
    }
  })
})
