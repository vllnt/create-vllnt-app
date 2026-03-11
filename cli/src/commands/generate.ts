import { Command } from 'commander'

export const generateCommand = new Command('generate')
  .alias('gen')
  .argument('<type>', 'Type: page, screen, component, hook, api, feature, domain')
  .argument('<name>', 'Name of the generated artifact')
  .option('--agent', 'Machine-readable JSON output')
  .description('Generate code artifact')
  .action(
    async (type: string, name: string, opts: { agent?: boolean }) => {
      const isAgent = opts.agent ?? false

      if (isAgent) {
        console.log(
          JSON.stringify({
            success: false,
            error: 'NOT_IMPLEMENTED',
            message: `"vllnt generate ${type} ${name}" is not yet implemented.`,
          }),
        )
      } else {
        console.log(
          `"vllnt generate ${type} ${name}" is not yet implemented.`,
        )
      }
      process.exit(1)
    },
  )
