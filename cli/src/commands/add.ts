import { Command } from 'commander'

export const addCommand = new Command('add')
  .argument('<feature>', 'Feature to add: auth, analytics, payments')
  .option('--agent', 'Machine-readable JSON output')
  .description('Add a feature to an existing project')
  .action(async (feature: string, opts: { agent?: boolean }) => {
    const isAgent = opts.agent ?? false

    if (isAgent) {
      console.log(
        JSON.stringify({
          success: false,
          error: 'NOT_IMPLEMENTED',
          message: `"vllnt add ${feature}" is not yet implemented.`,
        }),
      )
    } else {
      console.log(`"vllnt add ${feature}" is not yet implemented.`)
    }
    process.exit(1)
  })
