import fs from 'fs-extra'
import path from 'node:path'
import * as p from '@clack/prompts'
import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import type { Template } from '../commands/new.js'
import type { PackageManager } from '../utils/package-manager.js'
import { getInstallCommand } from '../utils/package-manager.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface ScaffoldOptions {
  name: string
  template: Template
  targetDir: string
  packageManager: string
  isAgent: boolean
  isNonInteractive: boolean
  skipInstall: boolean
}

interface ScaffoldResult {
  success: boolean
  path: string
  template: Template
  files: string[]
  packageManager: string
}

function getTemplateDir(template: Template): string {
  return path.resolve(__dirname, '..', 'templates', template)
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

async function processTemplateFiles(
  targetDir: string,
  replacements: Record<string, string>,
): Promise<void> {
  const textExtensions = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
    '.md',
    '.mdx',
    '.yaml',
    '.yml',
    '.toml',
    '.css',
    '.html',
    '.mjs',
    '.cjs',
    '.env',
    '.env.example',
    '.gitignore',
    '.prettierrc',
    '.eslintrc',
  ])

  const files = collectFiles(targetDir)
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const basename = path.basename(file)
    if (textExtensions.has(ext) || basename.startsWith('.')) {
      const filePath = path.join(targetDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const processed = replacePlaceholders(content, replacements)
      if (processed !== content) {
        await fs.writeFile(filePath, processed, 'utf-8')
      }
    }
  }
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
  const spinner = !isAgent && !isNonInteractive
    ? p.spinner()
    : null

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
  const { name, template, targetDir, packageManager, isAgent, isNonInteractive, skipInstall } = options
  const templateDir = getTemplateDir(template)

  if (!fs.existsSync(templateDir)) {
    throw new Error(
      `Template "${template}" not found at ${templateDir}. ` +
      'This is a bug — please report it.',
    )
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

    spinner?.stop(`Template copied.`)

    const gitOk = await initGit(targetDir)
    if (!isAgent && !gitOk) {
      p.log.warn('Git not available. Skipping git init.')
    }

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
      template,
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
