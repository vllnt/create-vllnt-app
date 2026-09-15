import { ArrowDown, ArrowUpRight, CornerDownRight, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { CommandBlock } from './command-block'
import { PresetWorkbench } from './preset-workbench'

const SOURCE = 'https://github.com/vllnt/create-vllnt-app'

export default function HomePage(): React.ReactNode {
  const t = useTranslations()

  return (
    <div className="landing">
      <section className="editorial-shell hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            {t('Hero.badge')}
          </p>
          <h1>
            {t('Hero.title_prefix')}
            <br />
            <span>{t('Hero.title_highlight')}</span>
          </h1>
          <p className="hero-description">{t('Hero.description')}</p>
          <CommandBlock
            command={t('Hero.command')}
            label={t('Hero.copy_label')}
          />
          <p className="requirements">{t('Hero.requirements')}</p>
          <a className="text-link" href="#presets">
            {t('Hero.cta')} <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <figure className="project-artifact">
          <figcaption>
            <CornerDownRight aria-hidden="true" />
            <span>{t('Artifact.label')}</span>
            <span className="artifact-tag">saas</span>
          </figcaption>
          <div className="artifact-body">
            <p className="project-name">
              my-app<span>/</span>
            </p>
            <div className="file-row">
              <code>app/[locale]/</code>
              <span>{t('Artifact.app')}</span>
            </div>
            <div className="file-row file-indent">
              <code>(marketing)/</code>
              <span>landing</span>
            </div>
            <div className="file-row file-indent">
              <code>(dashboard)/</code>
              <span>dashboard</span>
            </div>
            <div className="file-row file-indent">
              <code>(auth)/</code>
              <span>auth</span>
            </div>
            <div className="file-row">
              <code>convex/</code>
              <span>{t('Artifact.backend')}</span>
            </div>
            <div className="file-row file-highlight">
              <code>CLAUDE.md</code>
              <span>{t('Artifact.rules')}</span>
            </div>
            <div className="file-row file-highlight">
              <code>AGENTS.md</code>
              <span>{t('Artifact.architecture')}</span>
            </div>
            <div className="file-row file-highlight">
              <code>vllnt.json</code>
              <span>{t('Artifact.registry')}</span>
            </div>
          </div>
          <div className="artifact-footer">
            <Plus aria-hidden="true" />
            {t('Artifact.caption')}
          </div>
        </figure>
      </section>

      <div className="stack-strip">
        <div className="editorial-shell">
          <p>{t('Stack.label')}</p>
          <p>
            Next.js 16 <span>/</span> Expo 55 <span>/</span> Convex{' '}
            <span>/</span> TypeScript <span>/</span> Tailwind CSS
          </p>
        </div>
      </div>

      <section className="editorial-shell editorial-section" id="presets">
        <div className="section-heading">
          <p className="eyebrow">01 / {t('Presets.eyebrow')}</p>
          <div>
            <h2>{t('Presets.title')}</h2>
            <p className="section-description">{t('Presets.subtitle')}</p>
          </div>
        </div>
        <PresetWorkbench />
      </section>

      <section className="context-section">
        <div className="editorial-shell editorial-section">
          <div className="section-heading">
            <p className="eyebrow">02 / {t('AgentFirst.eyebrow')}</p>
            <div>
              <h2>{t('AgentFirst.title')}</h2>
              <p className="section-description">{t('AgentFirst.subtitle')}</p>
            </div>
          </div>
          <div className="context-grid">
            <div className="context-note">
              <CornerDownRight aria-hidden="true" />
              <p>{t('AgentFirst.note')}</p>
              <a
                className="text-link"
                href={`${SOURCE}/tree/main/cli/templates/base/web`}
              >
                {t('AgentFirst.source')} <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <dl className="contract-list">
              {(['claude', 'agents', 'vllnt_json'] as const).map(
                (key, index) => (
                  <div key={key}>
                    <dt>{['CLAUDE.md', 'AGENTS.md', 'vllnt.json'][index]}</dt>
                    <dd>{t(`AgentFirst.${key}`)}</dd>
                  </div>
                ),
              )}
            </dl>
          </div>
          <p className="agent-support">{t('Agents.subtitle')}</p>
        </div>
      </section>

      <section className="editorial-shell editorial-section checks-section">
        <div>
          <p className="eyebrow">03 / {t('Guardrails.eyebrow')}</p>
          <h2>{t('Guardrails.title')}</h2>
          <p className="section-description">{t('Guardrails.subtitle')}</p>
          <a className="text-link" href={`${SOURCE}/blob/main/docs/cli.md`}>
            {t('Guardrails.cta')} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <ol className="checks-list">
          <li>
            <span>01</span>
            <div>
              <h3>TypeScript + ESLint</h3>
              <p>{t('Guardrails.typescript')}</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>{t('Doctor.title')}</h3>
              <p>{t('Doctor.subtitle')}</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>{t('Guardrails.review_title')}</h3>
              <p>{t('Guardrails.review')}</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="closing-section">
        <div className="editorial-shell closing-inner">
          <div>
            <p className="eyebrow">{t('Closing.eyebrow')}</p>
            <h2>{t('Closing.title')}</h2>
            <Link className="text-link" href="/manifesto">
              {t('Closing.manifesto')} <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div>
            <CommandBlock
              command={t('Hero.command')}
              label={t('Closing.copy_label')}
            />
            <a className="text-link" href={SOURCE}>
              {t('Closing.source')} <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
