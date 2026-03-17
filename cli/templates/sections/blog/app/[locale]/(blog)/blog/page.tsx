import { useTranslations } from 'next-intl'

export default function BlogPage() {
  const t = useTranslations('Blog')

  return (
    <main className="container mx-auto px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <p className="text-muted-foreground">No posts yet. Add MDX files to content/blog/.</p>
      </div>
    </main>
  )
}
