import { describe, it, expect } from 'vitest'
import { validateProjectName } from '../../cli/src/utils/validate.js'

describe('validateProjectName', () => {
  it('rejects empty string', () => {
    expect(validateProjectName('')).toContain('cannot be empty')
  })

  it('rejects whitespace-only string', () => {
    expect(validateProjectName('   ')).toContain('cannot be empty')
  })

  it('rejects names with spaces and suggests fix', () => {
    const result = validateProjectName('My App')
    expect(result).toContain('no spaces')
    expect(result).toContain('my-app')
  })

  it('rejects uppercase names', () => {
    expect(validateProjectName('MyApp')).toContain('must be lowercase')
  })

  it('rejects names starting with special chars', () => {
    expect(validateProjectName('!invalid')).toContain('must be lowercase')
  })

  it('rejects reserved names that pass regex', () => {
    const reserved = ['node_modules', 'src', 'dist', 'build', 'public', 'test', 'tests']
    for (const name of reserved) {
      expect(validateProjectName(name), `"${name}" should be reserved`).toContain('reserved')
    }
  })

  it('rejects dotfile reserved names via regex before reserved check', () => {
    expect(validateProjectName('.git')).toContain('must be lowercase')
    expect(validateProjectName('.env')).toContain('must be lowercase')
  })

  it('rejects names longer than 214 chars', () => {
    const longName = 'a'.repeat(215)
    expect(validateProjectName(longName)).toContain('too long')
  })

  it('accepts valid simple names', () => {
    expect(validateProjectName('my-app')).toBeUndefined()
    expect(validateProjectName('my-app-123')).toBeUndefined()
    expect(validateProjectName('app.web')).toBeUndefined()
    expect(validateProjectName('my_app')).toBeUndefined()
  })

  it('accepts scoped package names', () => {
    expect(validateProjectName('@scope/my-app')).toBeUndefined()
    expect(validateProjectName('@my-org/web')).toBeUndefined()
  })

  it('accepts names at exactly 214 chars', () => {
    expect(validateProjectName('a'.repeat(214))).toBeUndefined()
  })

  it('returns undefined for valid names (not a string)', () => {
    const result = validateProjectName('valid-name')
    expect(result).toBeUndefined()
  })
})
