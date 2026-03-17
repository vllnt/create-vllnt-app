import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export function generateMetadata(): Metadata {
  return {
    title: '{{projectName}}',
    description: 'Built with create-vllnt-app',
  }
}

export default function HomePage() {
  const t = useTranslations('marketing')

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        {t('title')}
      </h1>
      <p className="max-w-xl text-center text-lg text-muted-foreground">
        {t('description')}
      </p>
    </div>
  )
}
