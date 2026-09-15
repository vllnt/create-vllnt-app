import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const workspaceRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted standalone image; tracing root is the pnpm workspace.
  output: 'standalone',
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: ['@vllnt/ui'],
}

export default withNextIntl(nextConfig)
