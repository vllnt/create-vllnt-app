import { useTranslations } from 'next-intl'

export default function AdminPage() {
  const t = useTranslations('Admin')

  return (
    <main className="container mx-auto px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>
    </main>
  )
}
