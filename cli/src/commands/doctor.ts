import { Command } from 'commander'

export const doctorCommand = new Command('doctor')
  .description('Health check for vllnt project')
  .action(async () => {
    console.log('"vllnt doctor" is not yet implemented.')
    process.exit(1)
  })
