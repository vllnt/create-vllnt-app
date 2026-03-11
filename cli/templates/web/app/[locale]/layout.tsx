import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ConvexProvider } from '@/components/providers/convex-provider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: '{{projectName}}',
  description: 'Built with create-vllnt-app',
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ConvexProvider>{children}</ConvexProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
