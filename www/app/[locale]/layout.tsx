import '../globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

import { routing } from '@/i18n/routing'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'create-vllnt-app — Agent-First Fullstack Scaffolder',
  description:
    'Scaffold production-grade Next.js, Expo, or fullstack monorepo projects with Convex backend. AI agent contracts included.',
  metadataBase: new URL('https://create-vllnt-app.vllnt.com'),
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
