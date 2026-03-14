import { Command } from 'commander'
import { newCommand } from './commands/new.js'
import { addCommand } from './commands/add.js'
import { generateCommand } from './commands/generate.js'
import { doctorCommand } from './commands/doctor.js'
import { version } from './utils/version.js'
import { showBanner } from './utils/banner.js'

const program = new Command()

program
  .name('vllnt')
  .description(
    'Opinionated CLI platform for agent-first web and mobile development',
  )
  .version(version)

program.addCommand(newCommand)
program.addCommand(addCommand)
program.addCommand(generateCommand)
program.addCommand(doctorCommand)

program.hook('preAction', () => {
  const args = process.argv
  if (!process.env.VLLNT_AGENT && !args.includes('--agent') && !args.includes('--json')) {
    showBanner()
  }
})

program.parse()
