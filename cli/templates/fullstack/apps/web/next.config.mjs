import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/client', '@repo/theme', '@repo/shared'],
}

export default withNextIntl(nextConfig)
