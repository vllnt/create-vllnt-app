import fs from 'fs-extra'
import path from 'node:path'
import * as p from '@clack/prompts'
import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import type { PackageManager } from '../utils/package-manager.js'
import { getInstallCommand } from '../utils/package-manager.js'
import type { SectionMeta } from './presets.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export interface ScaffoldOptions {
  name: string
  preset: string
  sections: string[]
  targetDir: string
  packageManager: string
  includeBackend: boolean
  isAgent: boolean
  isNonInteractive: boolean
  skipInstall: boolean
}

export interface ScaffoldResult {
  success: boolean
  path: string
  preset: string
  sections: string[]
  backend: boolean
  files: string[]
  packageManager: string
}

function getBaseDir(): string {
  return path.resolve(__dirname, '..', 'templates', 'base', 'web')
}

const SECTIONS_BASE = path.resolve(__dirname, '..', 'templates', 'sections')

function getSectionDir(section: string): string {
  const resolved = path.resolve(SECTIONS_BASE, section)
  if (!resolved.startsWith(SECTIONS_BASE + path.sep)) {
    throw new Error(`Invalid section "${section}": path traversal detected.`)
  }
  return resolved
}

function collectFiles(dir: string, prefix = ''): string[] {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    if (entry.isDirectory()) {
      files.push(...collectFiles(path.join(dir, entry.name), relative))
    } else {
      files.push(relative)
    }
  }
  return files
}

function replacePlaceholders(
  content: string,
  replacements: Record<string, string>,
): string {
  let result = content
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{{${key}}}`, value)
  }
  return result
}

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx',
  '.yaml', '.yml', '.toml', '.css', '.html', '.mjs', '.cjs',
  '.env', '.env.example', '.gitignore', '.prettierrc', '.eslintrc',
])

async function processTemplateFiles(
  targetDir: string,
  replacements: Record<string, string>,
): Promise<void> {
  const files = collectFiles(targetDir)
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const basename = path.basename(file)
    if (TEXT_EXTENSIONS.has(ext) || basename.startsWith('.')) {
      const filePath = path.join(targetDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const processed = replacePlaceholders(content, replacements)
      if (processed !== content) {
        await fs.writeFile(filePath, processed, 'utf-8')
      }
    }
  }
}

function loadSectionMeta(sectionDir: string): SectionMeta | undefined {
  const metaPath = path.join(sectionDir, 'section.json')
  if (!fs.existsSync(metaPath)) return undefined
  return fs.readJsonSync(metaPath) as SectionMeta
}

async function mergePackageJson(
  targetDir: string,
  sectionMetas: SectionMeta[],
): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  for (const meta of sectionMetas) {
    if (meta.dependencies) {
      pkg.dependencies = { ...pkg.dependencies, ...meta.dependencies }
    }
    if (meta.devDependencies) {
      pkg.devDependencies = { ...pkg.devDependencies, ...meta.devDependencies }
    }
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })
}

async function mergeI18nKeys(
  targetDir: string,
  sectionMetas: SectionMeta[],
): Promise<void> {
  const messagesPath = path.join(targetDir, 'messages', 'en.json')
  const messages = await fs.readJson(messagesPath)

  for (const meta of sectionMetas) {
    if (meta.i18nKeys) {
      Object.assign(messages, meta.i18nKeys)
    }
  }

  await fs.writeJson(messagesPath, messages, { spaces: 2 })
}

function generateClaudeMd(
  projectName: string,
  sections: string[],
  sectionMetas: SectionMeta[],
  includeBackend: boolean,
): string {
  const rules: string[] = [
    'No `any` type — use `unknown` + type guards. No `@ts-ignore` or `@ts-expect-error`.',
    'No business logic in components — extract to hooks or feature slices.',
    'Features use vertical slices — each feature in `features/{name}/` with components/, hooks/, index.ts.',
    'Shared UI only in components/ — `components/ui/` for primitives, `components/layout/` for shells.',
    'Tests before merge — `pnpm test` and `pnpm typecheck` must pass.',
    'No secrets in code — use environment variables.',
  ]

  for (const meta of sectionMetas) {
    rules.push(...meta.claudeMdRules)
  }

  const stack = [
    '- **Framework**: Next.js 16 (App Router, Server Components, Turbopack)',
    '- **Styling**: Tailwind CSS v4',
    '- **i18n**: next-intl (locale in `[locale]` route segment)',
    '- **Language**: TypeScript (strict mode)',
    '- **Testing**: Vitest (unit) + Playwright (E2E)',
  ]

  if (includeBackend) {
    stack.splice(1, 0, '- **Backend**: Convex (reactive, real-time, serverless)')
  }

  const sectionDocs = sectionMetas
    .map((m) => m.agentsMdExtensions)
    .filter(Boolean)
    .join('\n\n')

  return `# ${projectName} — Agent Rules

## BLOCKING Rules

${rules.map((r, i) => `${i + 1}. **${r}**`).join('\n')}

## Stack

${stack.join('\n')}

## Active Sections

${sections.map((s) => `- \`${s}\``).join('\n')}

## Project Structure

\`\`\`
app/[locale]/           App Router pages
${sectionMetas.map((m) => `  ${m.routeGroup}/          ${m.name} pages`).join('\n')}
components/             Shared UI
features/               Feature slices
${includeBackend ? 'convex/                 Backend functions\n' : ''}lib/                    Shared utilities
i18n/                   i18n config
messages/               Translation files
docs/                   Project documentation
\`\`\`

${sectionDocs}

## Commands

\`\`\`bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm typecheck        # TypeScript check
pnpm lint             # ESLint
${includeBackend ? 'npx convex dev        # Start Convex dev server\n' : ''}\`\`\`
`
}

function generateAgentsMd(
  projectName: string,
  sectionMetas: SectionMeta[],
  includeBackend: boolean,
): string {
  const sectionDocs = sectionMetas
    .map((m) => m.agentsMdExtensions)
    .filter(Boolean)
    .join('\n\n')

  return `# ${projectName} — Agent architecture guide

## Extension Points

| What | Where | How |
|------|-------|-----|
| New page | \`app/[locale]/(group)/\` | Add \`page.tsx\` + layout if needed |
| New feature | \`features/{name}/\` | Create components/, hooks/, index.ts |
${includeBackend ? '| New domain | `convex/{domain}/` | Add schemas.ts, queries.ts, mutations.ts |\n' : ''}| Shared component | \`components/ui/\` | Reusable, no business logic |
| New translation | \`messages/{locale}.json\` | Add key-value pairs |

## Active Sections

${sectionDocs}

## Common Tasks

### Add a new page
1. Create \`app/[locale]/(group)/route-name/page.tsx\`
2. Add translations to \`messages/en.json\`
3. Export metadata via \`generateMetadata\`

### Add a new feature
1. Create \`features/{name}/\` with components/, hooks/, index.ts
2. Export public API from index.ts
3. Import in pages as \`@/features/{name}\`

## Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Business logic in UI | Extract to features/ hooks |
| Cross-feature imports | Import from \`@/features/{name}\` barrel only |
| Hardcoded strings | Use next-intl \`useTranslations()\` |
${includeBackend ? '| Unbounded reads | Always use `.take(n)` or pagination |\n| Full table scans | Define indexes, use `.withIndex()` |\n| Missing validators | Every Convex function needs `args` + `returns` |\n' : ''}
`
}

function generateVllntJson(
  preset: string,
  sections: string[],
  includeBackend: boolean,
): string {
  return JSON.stringify(
    {
      version: '1.0',
      preset,
      sections,
      backend: includeBackend,
      created: new Date().toISOString(),
    },
    null,
    2,
  )
}

async function initGit(targetDir: string): Promise<boolean> {
  try {
    await execa('git', ['init'], { cwd: targetDir })
    await execa('git', ['add', '-A'], { cwd: targetDir })
    await execa('git', ['commit', '-m', 'chore: initial scaffold from create-vllnt-app'], {
      cwd: targetDir,
    })
    return true
  } catch {
    return false
  }
}

async function installDeps(
  targetDir: string,
  packageManager: string,
  isAgent: boolean,
  isNonInteractive: boolean,
): Promise<boolean> {
  const spinner = !isAgent && !isNonInteractive ? p.spinner() : null

  try {
    spinner?.start('Installing dependencies...')

    const [cmd, ...args] = getInstallCommand(packageManager as PackageManager).split(' ')
    await execa(cmd, args, {
      cwd: targetDir,
      stdio: isAgent ? 'pipe' : 'inherit',
    })

    spinner?.stop('Dependencies installed.')
    return true
  } catch {
    spinner?.stop('Install failed.')
    return false
  }
}

export async function scaffold(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const {
    name, preset, sections, targetDir, packageManager,
    includeBackend, isAgent, isNonInteractive, skipInstall,
  } = options

  const baseDir = getBaseDir()
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Base template not found at ${baseDir}. This is a bug — please report it.`)
  }

  const spinner = !isAgent ? p.spinner() : null

  let cleanupNeeded = true
  const cleanup = async (): Promise<void> => {
    if (cleanupNeeded && fs.existsSync(targetDir)) {
      await fs.remove(targetDir)
    }
  }

  const onSignal = (): void => {
    cleanup().then(() => process.exit(130))
  }
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)

  try {
    spinner?.start(`Scaffolding ${preset} project...`)

    // 1. Copy base skeleton
    await fs.copy(baseDir, targetDir)

    // 2. Copy each section (skip section.json — it's metadata only)
    const sectionMetas: SectionMeta[] = []
    for (const section of sections) {
      const sectionDir = getSectionDir(section)
      if (!fs.existsSync(sectionDir)) {
        throw new Error(`Section "${section}" not found at ${sectionDir}. This is a bug.`)
      }

      const meta = loadSectionMeta(sectionDir)
      if (meta) sectionMetas.push(meta)

      // Copy section files to target (excluding section.json)
      const sectionFiles = collectFiles(sectionDir)
      for (const file of sectionFiles) {
        if (file === 'section.json') continue
        const src = path.join(sectionDir, file)
        const dest = path.join(targetDir, file)
        await fs.ensureDir(path.dirname(dest))
        await fs.copy(src, dest)
      }
    }

    // 3. Merge section deps into package.json
    await mergePackageJson(targetDir, sectionMetas)

    // 4. Merge i18n keys
    await mergeI18nKeys(targetDir, sectionMetas)

    // 5. Generate CLAUDE.md, AGENTS.md, vllnt.json
    await fs.writeFile(
      path.join(targetDir, 'CLAUDE.md'),
      generateClaudeMd(name, sections, sectionMetas, includeBackend),
      'utf-8',
    )
    await fs.writeFile(
      path.join(targetDir, 'AGENTS.md'),
      generateAgentsMd(name, sectionMetas, includeBackend),
      'utf-8',
    )
    await fs.writeFile(
      path.join(targetDir, 'vllnt.json'),
      generateVllntJson(preset, sections, includeBackend),
      'utf-8',
    )

    // 6. Replace placeholders
    const replacements: Record<string, string> = {
      projectName: name,
      packageName: name,
    }
    await processTemplateFiles(targetDir, replacements)

    // 7. Strip backend if not needed
    if (!includeBackend) {
      const convexDir = path.join(targetDir, 'convex')
      const convexJson = path.join(targetDir, 'convex.json')
      const convexProvider = path.join(targetDir, 'components', 'providers', 'convex-provider.tsx')
      for (const item of [convexDir, convexJson, convexProvider]) {
        if (fs.existsSync(item)) await fs.remove(item)
      }
    }

    spinner?.stop('Template copied.')

    // 8. Git init
    const gitOk = await initGit(targetDir)
    if (!isAgent && !gitOk) {
      p.log.warn('Git not available. Skipping git init.')
    }

    // 9. Install deps
    const installOk = skipInstall
      ? true
      : await installDeps(targetDir, packageManager, isAgent, isNonInteractive)
    if (!installOk && !isAgent) {
      p.log.warn(
        `Install failed. Run: cd ${name} && ${getInstallCommand(packageManager as PackageManager)}`,
      )
    }

    cleanupNeeded = false

    const files = collectFiles(targetDir)

    return {
      success: true,
      path: targetDir,
      preset,
      sections,
      backend: includeBackend,
      files,
      packageManager,
    }
  } catch (error) {
    await cleanup()
    throw error
  } finally {
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
  }
}

interface LegacyScaffoldOptions {
  name: string
  template: 'mobile' | 'fullstack'
  targetDir: string
  packageManager: string
  isAgent: boolean
  isNonInteractive: boolean
  skipInstall: boolean
  includeBackend: boolean
}

export async function scaffoldLegacy(options: LegacyScaffoldOptions): Promise<ScaffoldResult> {
  const { name, template, targetDir, packageManager, isAgent, isNonInteractive, skipInstall } = options
  const templateDir = path.resolve(__dirname, '..', 'templates', template)

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template "${template}" not found at ${templateDir}. This is a bug — please report it.`)
  }

  const spinner = !isAgent ? p.spinner() : null

  let cleanupNeeded = true
  const cleanup = async (): Promise<void> => {
    if (cleanupNeeded && fs.existsSync(targetDir)) {
      await fs.remove(targetDir)
    }
  }

  const onSignal = (): void => {
    cleanup().then(() => process.exit(130))
  }
  process.on('SIGINT', onSignal)
  process.on('SIGTERM', onSignal)

  try {
    spinner?.start(`Scaffolding ${template} project...`)

    await fs.copy(templateDir, targetDir)

    const replacements: Record<string, string> = {
      projectName: name,
      packageName: name,
    }
    await processTemplateFiles(targetDir, replacements)

    spinner?.stop('Template copied.')

    const gitOk = await initGit(targetDir)
    if (!isAgent && !gitOk) {
      p.log.warn('Git not available. Skipping git init.')
    }

    const installOk = skipInstall
      ? true
      : await installDeps(targetDir, packageManager, isAgent, isNonInteractive)
    if (!installOk && !isAgent) {
      p.log.warn(`Install failed. Run: cd ${name} && ${getInstallCommand(packageManager as PackageManager)}`)
    }

    cleanupNeeded = false

    const files = collectFiles(targetDir)

    return {
      success: true,
      path: targetDir,
      preset: template,
      sections: [],
      backend: true,
      files,
      packageManager,
    }
  } catch (error) {
    await cleanup()
    throw error
  } finally {
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
  }
}
