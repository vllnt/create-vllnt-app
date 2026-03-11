import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export function generateMetadata(): Metadata {
  return { title: 'Dashboard' }
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('welcome')}</p>
    </div>
  )
}
