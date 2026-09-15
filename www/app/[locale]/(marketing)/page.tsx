import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { MatrixBackground } from './matrix-background'
import { PresetWorkbench } from './preset-workbench'

const SOURCE = 'https://github.com/vllnt/create-vllnt-app'

export default function HomePage(): React.ReactNode {
  const t = useTranslations()

  return (
    <div className="landing">
      <MatrixBackground />
      <section className="editorial-shell hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('Hero.badge')}</p>
          <h1>
            {t('Hero.title_prefix')}
            <br />
            <span>{t('Hero.title_highlight')}</span>
          </h1>
          <p className="hero-description">{t('Hero.description')}</p>
        </div>
        <PresetWorkbench />
      </section>
      <section className="editorial-shell next-step">
        <div>
          <h2>{t('Next.title')}</h2>
          <p>{t('Next.description')}</p>
        </div>
        <div className="next-links">
          <a className="text-link" href={`${SOURCE}/blob/main/docs/cli.md`}>
            {t('Next.docs')} <ArrowUpRight aria-hidden="true" />
          </a>
          <Link className="text-link" href="/manifesto">
            {t('Closing.manifesto')} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
