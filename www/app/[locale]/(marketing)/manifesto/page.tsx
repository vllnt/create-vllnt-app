import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@vllnt/ui'
import { Separator } from '@vllnt/ui'

import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Manifesto — create-vllnt-app',
  description:
    'Why I built create-vllnt-app and open-sourced it. The future of development is agent-first.',
}

export default function ManifestoPage(): React.ReactNode {
  const t = useTranslations('Manifesto')

  return (
    <article className="container mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
      </header>

      <div className="prose-custom space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>

        <Separator className="my-10" />

        <h2 className="text-2xl font-bold text-foreground">
          {t('h_opinionated')}
        </h2>
        <p>{t('p4')}</p>

        <Separator className="my-10" />

        <h2 className="text-2xl font-bold text-foreground">{t('h_open')}</h2>
        <p>{t('p5')}</p>

        <Separator className="my-10" />

        <h2 className="text-2xl font-bold text-foreground">{t('h_future')}</h2>
        <p>{t('p6')}</p>
        <p className="text-foreground font-medium">{t('p7')}</p>

        <p className="mt-10 text-lg font-semibold text-foreground">
          {t('signoff')}
        </p>
      </div>

      <div className="mt-16">
        <Button size="lg" className="gap-2" asChild>
          <Link href="/">
            {t('cta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
