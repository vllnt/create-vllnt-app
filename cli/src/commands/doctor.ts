import { Command } from 'commander'
import * as p from '@clack/prompts'
import chalk from 'chalk'
import { runDoctor } from '../core/doctor.js'

interface DoctorOptions {
  for?: string
  json?: boolean
}

export const doctorCommand = new Command('doctor')
  .option('--for <section>', 'Run preflight checks for a specific section')
  .option('--json', 'Output structured JSON (for agents)')
  .description('Check project health and surface issues')
  .action(async (opts: DoctorOptions) => {
    const cwd = process.cwd()
    const isJson = opts.json ?? !!process.env.VLLNT_AGENT

    if (isJson) {
      process.env.VLLNT_AGENT = '1'
    }

    const result = await runDoctor(cwd, opts.for)

    if (isJson) {
      console.log(JSON.stringify(result, null, 2))
      process.exit(result.summary.fail > 0 ? 2 : 0)
      return
    }

    // Human-readable output
    p.intro('vllnt doctor')

    p.log.info(
      `Project: ${result.project.name} (${result.project.type})` +
      `\nSections: ${result.project.sections.length > 0 ? result.project.sections.join(', ') : 'none detected'}` +
      `\nBackend: ${result.project.backend ? 'Convex' : 'none'}`,
    )

    if (opts.for) {
      p.log.info(`Preflight for: ${opts.for}`)
    }

    console.log()

    for (const check of result.checks) {
      const icon =
        check.status === 'pass' ? chalk.green('PASS') :
        check.status === 'warn' ? chalk.yellow('WARN') :
        chalk.red('FAIL')

      console.log(`  ${icon}  ${check.message}`)
      if (check.fix && check.status !== 'pass') {
        const fixText = check.fix.type === 'command'
          ? `${check.fix.cmd} ${check.fix.args.join(' ')}`
          : check.fix.args.join(' ')
        console.log(`         ${chalk.dim(`fix: ${fixText}`)}`)
      }
    }

    console.log()

    const { pass, warn, fail } = result.summary
    const summaryParts = [
      chalk.green(`${pass} pass`),
      ...(warn > 0 ? [chalk.yellow(`${warn} warn`)] : []),
      ...(fail > 0 ? [chalk.red(`${fail} fail`)] : []),
    ]

    p.outro(summaryParts.join('  '))

    process.exit(fail > 0 ? 2 : 0)
  })
