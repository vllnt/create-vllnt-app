import fs from 'fs-extra'
import path from 'node:path'
import { execa } from 'execa'
import { detectPackageManager } from '../utils/package-manager.js'
import { SECTION_DEPS } from './presets.js'

export interface DoctorFix {
  cmd: string
  args: string[]
  type: 'command' | 'manual'
}

export interface DoctorCheck {
  id: string
  category: 'structure' | 'deps' | 'config' | 'types' | 'build' | 'prerequisites'
  status: 'pass' | 'warn' | 'fail'
  message: string
  fix?: DoctorFix
}

export interface DoctorProject {
  name: string
  type: 'web' | 'mobile' | 'unknown'
  sections: string[]
  backend: boolean
  packageManager: string
}

export interface DoctorResult {
  project: DoctorProject
  target?: string
  checks: DoctorCheck[]
  summary: {
    pass: number
    warn: number
    fail: number
  }
}

interface VllntJson {
  version: string
  preset: string
  sections: string[]
  backend: boolean
}

function detectProject(cwd: string): DoctorProject {
  const pm = detectPackageManager(cwd)
  let name = 'unknown'
  let type: 'web' | 'mobile' | 'unknown' = 'unknown'
  let sections: string[] = []
  let backend = false

  const pkgPath = path.join(cwd, 'package.json')
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath)
      name = pkg.name ?? 'unknown'
      if (pkg.dependencies?.next) type = 'web'
      if (pkg.dependencies?.expo) type = 'mobile'
    } catch {
      // invalid package.json
    }
  }

  const vllntPath = path.join(cwd, 'vllnt.json')
  if (fs.existsSync(vllntPath)) {
    try {
      const vllnt = fs.readJsonSync(vllntPath) as VllntJson
      sections = vllnt.sections ?? []
      backend = vllnt.backend ?? false
    } catch {
      // invalid vllnt.json
    }
  }

  return { name, type, sections, backend, packageManager: pm }
}


function runGlobalChecks(cwd: string, project: DoctorProject): DoctorCheck[] {
  const checks: DoctorCheck[] = []
  const pm = project.packageManager

  // vllnt.json
  const vllntExists = fs.existsSync(path.join(cwd, 'vllnt.json'))
  checks.push({
    id: 'vllnt-json',
    category: 'structure',
    status: vllntExists ? 'pass' : 'fail',
    message: vllntExists ? 'vllnt.json found' : 'vllnt.json not found',
    ...(!vllntExists && {
      fix: { cmd: 'echo', args: ['Create vllnt.json or re-scaffold with create-vllnt-app new'], type: 'manual' as const },
    }),
  })

  // package.json
  const pkgPath = path.join(cwd, 'package.json')
  let pkgValid = false
  try {
    if (fs.existsSync(pkgPath)) {
      fs.readJsonSync(pkgPath)
      pkgValid = true
    }
  } catch {
    // invalid
  }
  checks.push({
    id: 'package-json',
    category: 'structure',
    status: pkgValid ? 'pass' : 'fail',
    message: pkgValid ? 'package.json valid' : 'package.json missing or invalid',
    ...(!pkgValid && {
      fix: { cmd: 'echo', args: ['Fix JSON syntax in package.json'], type: 'manual' as const },
    }),
  })

  // CLAUDE.md
  const claudeExists = fs.existsSync(path.join(cwd, 'CLAUDE.md'))
  checks.push({
    id: 'claude-md',
    category: 'structure',
    status: claudeExists ? 'pass' : 'warn',
    message: claudeExists ? 'CLAUDE.md found' : 'CLAUDE.md missing — agents need this',
    ...(!claudeExists && {
      fix: { cmd: 'echo', args: ['Create CLAUDE.md with project rules'], type: 'manual' as const },
    }),
  })

  // node_modules
  const depsInstalled = fs.existsSync(path.join(cwd, 'node_modules'))
  checks.push({
    id: 'deps-installed',
    category: 'deps',
    status: depsInstalled ? 'pass' : 'fail',
    message: depsInstalled ? 'Dependencies installed' : 'Dependencies not installed',
    ...(!depsInstalled && {
      fix: { cmd: pm, args: ['install'], type: 'command' as const },
    }),
  })

  return checks
}

async function runTypeChecks(cwd: string): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = []

  // Typecheck
  try {
    await execa('npx', ['tsc', '--noEmit'], { cwd, timeout: 60_000 })
    checks.push({
      id: 'typecheck',
      category: 'types',
      status: 'pass',
      message: 'TypeScript check passed',
    })
  } catch (error: unknown) {
    const stderr = (error as { stderr?: string }).stderr ?? ''
    checks.push({
      id: 'typecheck',
      category: 'types',
      status: 'warn',
      message: `Type errors found`,
      fix: { cmd: 'echo', args: [stderr.slice(0, 500) || 'Run: npx tsc --noEmit'], type: 'manual' },
    })
  }

  return checks
}

function runSectionPreflightChecks(
  cwd: string,
  section: string,
  project: DoctorProject,
): DoctorCheck[] {
  const checks: DoctorCheck[] = []
  const sectionDep = SECTION_DEPS[section]

  if (!sectionDep) {
    checks.push({
      id: `${section}-unknown`,
      category: 'prerequisites',
      status: 'fail',
      message: `Unknown section "${section}"`,
    })
    return checks
  }

  // Check required sections
  for (const req of sectionDep.requires) {
    const hasReq = project.sections.includes(req)
    checks.push({
      id: `${section}-requires-${req}`,
      category: 'prerequisites',
      status: hasReq ? 'pass' : 'fail',
      message: hasReq
        ? `Required section "${req}" is active`
        : `Section "${section}" requires "${req}"`,
      ...(!hasReq && {
        fix: { cmd: 'echo', args: [`Add ${req} section first`], type: 'manual' },
      }),
    })
  }

  // Check backend
  if (sectionDep.requiresBackend && !project.backend) {
    checks.push({
      id: `${section}-requires-backend`,
      category: 'prerequisites',
      status: 'fail',
      message: `Section "${section}" requires Convex backend`,
      fix: { cmd: 'echo', args: ['Backend required — re-scaffold with backend enabled'], type: 'manual' },
    })
  }

  // Check route group conflict
  const routeGroups: Record<string, string> = {
    landing: '(marketing)',
    blog: '(blog)',
    dashboard: '(dashboard)',
    auth: '(auth)',
    docs: '(docs)',
    admin: '(admin)',
  }

  const routeGroup = routeGroups[section]
  if (routeGroup) {
    const routeExists = fs.existsSync(path.join(cwd, 'app', '[locale]', routeGroup))
    if (routeExists && !project.sections.includes(section)) {
      checks.push({
        id: `${section}-route-conflict`,
        category: 'prerequisites',
        status: 'warn',
        message: `Route group ${routeGroup}/ already exists`,
      })
    }
  }

  return checks
}

export async function runDoctor(
  cwd: string,
  targetSection?: string,
): Promise<DoctorResult> {
  const project = detectProject(cwd)
  const checks: DoctorCheck[] = []

  // Global checks
  checks.push(...runGlobalChecks(cwd, project))

  // Type checks (only if deps installed)
  if (fs.existsSync(path.join(cwd, 'node_modules'))) {
    const typeChecks = await runTypeChecks(cwd)
    checks.push(...typeChecks)
  }

  // Section preflight checks
  if (targetSection) {
    checks.push(...runSectionPreflightChecks(cwd, targetSection, project))
  }

  const summary = {
    pass: checks.filter((c) => c.status === 'pass').length,
    warn: checks.filter((c) => c.status === 'warn').length,
    fail: checks.filter((c) => c.status === 'fail').length,
  }

  return {
    project,
    target: targetSection,
    checks,
    summary,
  }
}
