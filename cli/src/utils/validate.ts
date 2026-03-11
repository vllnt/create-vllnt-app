const NPM_NAME_REGEX = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

const RESERVED_NAMES = new Set([
  'node_modules',
  'favicon.ico',
  'package.json',
  'tsconfig.json',
  '.git',
  '.env',
  'src',
  'dist',
  'build',
  'public',
  'test',
  'tests',
])

export function validateProjectName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty.'
  }

  if (name.includes(' ')) {
    return `Invalid name: no spaces allowed. Try: ${name.replace(/\s+/g, '-').toLowerCase()}`
  }

  if (!NPM_NAME_REGEX.test(name)) {
    return 'Invalid name: must be lowercase, no spaces. Use a-z, 0-9, hyphens, dots.'
  }

  if (RESERVED_NAMES.has(name.toLowerCase())) {
    return `"${name}" is a reserved name. Choose another.`
  }

  if (name.length > 214) {
    return 'Name too long (max 214 characters).'
  }

  return undefined
}
