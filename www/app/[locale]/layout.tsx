import '../globals.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

import { routing } from '@/i18n/routing'

const siteUrl = 'https://create-vllnt-app.vllnt.com'
const title = 'create-vllnt-app — Agent-First Fullstack Scaffolder'
const description =
  'Scaffold production-grade Next.js, Expo, or fullstack monorepo projects with Convex backend. CLAUDE.md + AI agent contracts included.'

export const metadata: Metadata = {
  authors: [{ name: 'vllnt', url: 'https://vllnt.com' }],
  creator: 'vllnt',
  description,
  keywords: [
    'create-vllnt-app',
    'scaffolder',
    'Next.js',
    'Expo',
    'Convex',
    'AI agents',
    'CLAUDE.md',
    'fullstack',
    'monorepo',
    'React',
    'React Native',
    'Tailwind CSS',
    'Turborepo',
    'Vercel',
    'agent-first',
    'CLI',
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    description,
    locale: 'en_US',
    siteName: 'create-vllnt-app',
    title,
    type: 'website',
    url: siteUrl,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title,
  twitter: {
    card: 'summary_large_image',
    creator: '@bntvllnt',
    description,
    title,
  },
}

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}): Promise<React.ReactNode> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
