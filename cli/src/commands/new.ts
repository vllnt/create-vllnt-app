import { Command } from 'commander'
import * as p from '@clack/prompts'
import path from 'node:path'
import fs from 'fs-extra'
import { validateProjectName } from '../utils/validate.js'
import { detectPackageManager } from '../utils/package-manager.js'
import { scaffold, scaffoldLegacy } from '../core/scaffold.js'
import {
  PRESETS,
  ALL_SECTIONS,
  getPreset,
  resolveTransitiveDeps,
  needsBackend,
} from '../core/presets.js'
import { CONVEX_MODES, isConvexMode, type ConvexMode } from '../core/convex-env.js'

interface NewOptions {
  template?: string
  preset?: string
  yes?: boolean
  agent?: boolean
  packageManager?: string
  skipInstall?: boolean
  skipBackend?: boolean
  sections?: string
  convex?: string
}

export const newCommand = new Command('new')
  .argument('[name]', 'Project name')
  .option('-p, --preset <preset>', 'Preset: landing, blog, marketing, saas, full-saas, dashboard, internal, docs')
  .option('-t, --template <template>', 'Alias for --preset (backward compat)')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .option('--agent', 'Machine-readable JSON output (implies --yes)')
  .option('--package-manager <pm>', 'Package manager: npm, pnpm, yarn, bun')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-backend', 'Skip Convex backend setup')
  .option('--sections <sections>', 'Comma-separated sections for custom preset')
  .option('--convex <mode>', 'Convex backend mode: cloud, self-hosted (required when a backend is included)')
  .description('Scaffold a new project')
  .action(async (name: string | undefined, opts: NewOptions) => {
    const isAgent = opts.agent ?? false
    const isNonInteractive = opts.yes ?? isAgent

    if (isAgent) {
      process.env.VLLNT_AGENT = '1'
    }

    let projectName = name
    let presetName = opts.preset ?? opts.template
    let sections: string[] = []
    let includeBackend = !opts.skipBackend
    const packageManager = opts.packageManager ?? detectPackageManager()

    // Backward compat: --template web → --preset saas (closest match)
    // Mobile and fullstack still use legacy monolithic templates
    if (presetName === 'web') presetName = 'saas'
    const isLegacyTemplate = presetName === 'mobile' || presetName === 'fullstack'

    if (!isNonInteractive) {
      p.intro('Create a new vllnt project')

      // 1. Project name
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

      // 2. Preset selection
      if (!presetName) {
        const presetResult = await p.select({
          message: 'What are you building?',
          options: [
            ...PRESETS.map((preset) => ({
              value: preset.name,
              label: preset.label,
              hint: preset.hint,
            })),
            {
              value: 'custom',
              label: 'Custom',
              hint: 'Pick sections manually',
            },
          ],
        })
        if (p.isCancel(presetResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        presetName = presetResult as string
      }

      // 3. Custom section selection
      if (presetName === 'custom') {
        const sectionsResult = await p.multiselect({
          message: 'Select sections',
          options: ALL_SECTIONS.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          })),
          required: true,
        })
        if (p.isCancel(sectionsResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        sections = resolveTransitiveDeps(sectionsResult as string[])

        // Notify about auto-added deps
        const added = sections.filter((s) => !(sectionsResult as string[]).includes(s))
        if (added.length > 0) {
          p.log.info(`Auto-added required sections: ${added.join(', ')}`)
        }
      } else {
        const preset = getPreset(presetName)
        if (!preset) {
          p.log.error(`Unknown preset "${presetName}". Available: ${PRESETS.map((p) => p.name).join(', ')}`)
          process.exit(1)
        }
        sections = preset.sections
        includeBackend = preset.backend && !opts.skipBackend
      }

      // 4. Backend prompt (only if sections need it and user hasn't opted out)
      if (!opts.skipBackend && presetName === 'custom' && needsBackend(sections)) {
        const backendResult = await p.confirm({
          message: 'Include Convex backend?',
          initialValue: true,
        })
        if (p.isCancel(backendResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        includeBackend = backendResult
      }
    } else {
      // Non-interactive mode
      if (!projectName) projectName = 'my-app'
      const nameError = validateProjectName(projectName)
      if (nameError) {
        if (isAgent) {
          console.log(JSON.stringify({ success: false, error: 'INVALID_NAME', message: nameError }))
        } else {
          console.error(`Error: ${nameError}`)
        }
        process.exit(1)
      }

      if (!isLegacyTemplate) {
        if (opts.sections) {
          const rawSections = opts.sections.split(',').map((s) => s.trim())
          const invalid = rawSections.filter((s) => !ALL_SECTIONS.includes(s as typeof ALL_SECTIONS[number]))
          if (invalid.length > 0) {
            const msg = `Invalid section(s): ${invalid.join(', ')}. Valid: ${ALL_SECTIONS.join(', ')}`
            if (isAgent) {
              console.log(JSON.stringify({ success: false, error: 'INVALID_SECTION', message: msg }))
            } else {
              console.error(msg)
            }
            process.exit(1)
          }
          sections = resolveTransitiveDeps(rawSections)
          presetName = 'custom'
          includeBackend = needsBackend(sections) && !opts.skipBackend
        } else if (!presetName) {
          presetName = 'saas'
          const preset = getPreset(presetName)!
          sections = preset.sections
          includeBackend = preset.backend && !opts.skipBackend
        } else {
          const preset = getPreset(presetName)
          if (!preset) {
            const msg = `Unknown preset "${presetName}". Available: ${PRESETS.map((p) => p.name).join(', ')}`
            if (isAgent) {
              console.log(JSON.stringify({ success: false, error: 'UNKNOWN_PRESET', message: msg }))
            } else {
              console.error(msg)
            }
            process.exit(1)
          }
          sections = preset.sections
          includeBackend = preset.backend && !opts.skipBackend
        }
      }
    }

    // Resolve Convex mode (cloud vs self-hosted). No default — force a choice
    // whenever a backend is included: prompt interactively, require --convex otherwise.
    let convexMode: ConvexMode | undefined
    const backendForChoice = isLegacyTemplate || includeBackend
    if (backendForChoice) {
      if (opts.convex) {
        if (!isConvexMode(opts.convex)) {
          const message = `Invalid --convex "${opts.convex}". Use: ${CONVEX_MODES.join(', ')}`
          if (isAgent) {
            console.log(JSON.stringify({ success: false, error: 'INVALID_CONVEX_MODE', message }))
          } else {
            p.log.error(message)
          }
          process.exit(1)
        }
        convexMode = opts.convex
      } else if (isNonInteractive) {
        const message = `--convex <${CONVEX_MODES.join('|')}> is required when a backend is included.`
        if (isAgent) {
          console.log(JSON.stringify({ success: false, error: 'CONVEX_MODE_REQUIRED', message }))
        } else {
          console.error(`Error: ${message}`)
        }
        process.exit(1)
      } else {
        const convexResult = await p.select({
          message: 'Convex backend',
          options: [
            { value: 'cloud', label: 'Cloud', hint: 'Managed convex.dev — zero infra' },
            { value: 'self-hosted', label: 'Self-hosted', hint: 'Run your own backend via Docker' },
          ],
        })
        if (p.isCancel(convexResult)) {
          p.cancel('Cancelled.')
          process.exit(0)
        }
        convexMode = convexResult as ConvexMode
      }
    }

    const targetDir = path.resolve(process.cwd(), projectName!)

    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      const message = `Directory "${projectName}" already exists and is not empty.`
      if (isAgent) {
        console.log(JSON.stringify({ success: false, error: 'DIR_EXISTS', message }))
      } else {
        p.log.error(message)
      }
      process.exit(1)
    }

    try {
      if (isLegacyTemplate) {
        // Legacy path for mobile/fullstack (monolithic templates)
        const result = await scaffoldLegacy({
          name: projectName!,
          template: presetName as 'mobile' | 'fullstack',
          targetDir,
          packageManager,
          convexMode,
          isAgent,
          isNonInteractive,
          skipInstall: opts.skipInstall ?? false,
          includeBackend: true,
        })

        if (isAgent) {
          console.log(JSON.stringify(result))
        } else {
          p.outro(`Project created at ./${projectName}`)
          console.log()
          console.log(`  cd ${projectName}`)
          console.log(`  ${packageManager} dev`)
          console.log()
          if (convexMode === 'self-hosted') {
            console.log('  Start backend: docker compose up -d  (see docs/self-hosting.md)')
          } else {
            console.log('  Start backend: npx convex dev')
          }
          console.log('  Agent contract ready: CLAUDE.md + AGENTS.md + docs/')
        }
      } else {
        const result = await scaffold({
          name: projectName!,
          preset: presetName!,
          sections,
          targetDir,
          packageManager,
          includeBackend,
          convexMode,
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
          if (includeBackend) {
            if (convexMode === 'self-hosted') {
              console.log('  Start backend: docker compose up -d  (see docs/self-hosting.md)')
            } else {
              console.log('  Start backend: npx convex dev')
            }
          }
          console.log('  Health check:  vllnt doctor')
          console.log()
          console.log(`  Sections: ${sections.join(', ')}`)
          console.log('  Agent contract ready: CLAUDE.md + AGENTS.md + vllnt.json')
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      if (isAgent) {
        console.log(JSON.stringify({ success: false, error: 'SCAFFOLD_FAILED', message }))
      } else {
        p.log.error(`Scaffold failed: ${message}`)
      }
      process.exit(1)
    }
  })
