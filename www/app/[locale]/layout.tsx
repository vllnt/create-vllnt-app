import '../globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

import { routing } from '@/i18n/routing'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = 'https://create-vllnt-app.vllnt.com'
const title = 'create-vllnt-app — Agent-First Fullstack Scaffolder'
const description =
  'Scaffold production-grade Next.js, Expo, or fullstack monorepo projects with Convex backend. CLAUDE.md + AI agent contracts included.'

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
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
  authors: [{ name: 'vllnt', url: 'https://vllnt.com' }],
  creator: 'vllnt',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'create-vllnt-app',
    title,
    description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'create-vllnt-app — Ship with AI agents from day one',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
    creator: '@bntvllnt',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <body className={inter.className}>
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
