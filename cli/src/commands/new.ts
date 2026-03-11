import { Command } from 'commander'
import * as p from '@clack/prompts'
import path from 'node:path'
import fs from 'fs-extra'
import { validateProjectName } from '../utils/validate.js'
import { detectPackageManager } from '../utils/package-manager.js'
import { scaffold } from '../core/scaffold.js'

export type Template = 'web' | 'mobile' | 'fullstack'

interface NewOptions {
  template?: Template
  yes?: boolean
  agent?: boolean
  packageManager?: string
  skipInstall?: boolean
}

export const newCommand = new Command('new')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template: web, mobile, fullstack')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .option('--agent', 'Machine-readable JSON output (implies --yes)')
  .option('--package-manager <pm>', 'Package manager: npm, pnpm, yarn, bun')
  .option('--skip-install', 'Skip dependency installation')
  .description('Scaffold a new project')
  .action(async (name: string | undefined, opts: NewOptions) => {
    const isAgent = opts.agent ?? false
    const isNonInteractive = opts.yes ?? isAgent

    if (isAgent) {
      process.env.VLLNT_AGENT = '1'
    }

    let projectName = name
    let template = opts.template as Template | undefined
    let packageManager = opts.packageManager ?? detectPackageManager()

    if (!isNonInteractive) {
      p.intro('Create a new vllnt project')

      if (!projectName) {
        const nameResult = await p.text({
          message: 'Project name',
          placeholder: 'my-app',
          validate: validateProjectName,
        })
        if (p.isCancel(nameResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        projectName = nameResult
      } else {
        const nameError = validateProjectName(projectName)
        if (nameError) {
          p.log.error(nameError)
          process.exit(1)
        }
      }

      if (!template) {
        const templateResult = await p.select({
          message: 'Select template',
          options: [
            {
              value: 'web' as const,
              label: 'Web',
              hint: 'Next.js 16 + Convex + Tailwind v4 + next-intl + @vllnt/ui',
            },
            {
              value: 'mobile' as const,
              label: 'Mobile',
              hint: 'Expo 55 + Convex + React Native + i18next',
            },
            {
              value: 'fullstack' as const,
              label: 'Full Stack',
              hint: 'Monorepo: apps/web + apps/mobile + packages/backend',
            },
          ],
        })
        if (p.isCancel(templateResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        template = templateResult
      }
    } else {
      if (!projectName) {
        projectName = 'my-app'
      }
      const nameError = validateProjectName(projectName)
      if (nameError) {
        if (isAgent) {
          console.log(
            JSON.stringify({
              success: false,
              error: 'INVALID_NAME',
              message: nameError,
            }),
          )
        } else {
          console.error(`Error: ${nameError}`)
        }
        process.exit(1)
      }
      if (!template) {
        template = 'web'
      }
    }

    const targetDir = path.resolve(process.cwd(), projectName!)

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      const message = `Directory "${projectName}" already exists and is not empty.`
      if (isAgent) {
        console.log(
          JSON.stringify({
            success: false,
            error: 'DIR_EXISTS',
            message,
          }),
        )
      } else {
        p.log.error(message)
      }
      process.exit(1)
    }

    try {
      const result = await scaffold({
        name: projectName!,
        template: template!,
        targetDir,
        packageManager,
        isAgent,
        isNonInteractive,
        skipInstall: opts.skipInstall ?? false,
      })

      if (isAgent) {
        console.log(JSON.stringify(result))
      } else {
        p.outro(`Project created at ./${projectName}`)
        console.log()
        console.log(`  cd ${projectName}`)
        console.log(`  ${packageManager} dev`)
        console.log()
        console.log('  Add features:  vllnt add auth')
        console.log('  Generate code: vllnt generate feature dashboard')
        console.log()
        console.log('  Agent contract ready: CLAUDE.md + AGENTS.md + docs/')
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred'
      if (isAgent) {
        console.log(
          JSON.stringify({
            success: false,
            error: 'SCAFFOLD_FAILED',
            message,
          }),
        )
      } else {
        p.log.error(`Scaffold failed: ${message}`)
      }
      process.exit(1)
    }
  })
