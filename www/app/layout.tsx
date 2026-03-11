import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'create-vllnt-app — Agent-First Fullstack Scaffolder',
  description:
    'Scaffold production-grade Next.js, Expo, or fullstack monorepo projects with Convex backend. AI agent contracts included.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
