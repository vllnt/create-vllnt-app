import { useTranslations } from 'next-intl'

export default function DocsPage() {
  const t = useTranslations('Docs')

  return (
    <main className="container mx-auto px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>

      <div className="mt-12">
        <p className="text-muted-foreground">Add MDX files to content/docs/ to get started.</p>
      </div>
    </main>
  )
}
