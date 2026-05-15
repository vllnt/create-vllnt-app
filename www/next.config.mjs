import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted on OVH MKS — produces .next/standalone for slim runtime image
  output: 'standalone',
  transpilePackages: ['@vllnt/ui'],
}

export default withNextIntl(nextConfig)
