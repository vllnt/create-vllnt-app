'use client'

import { useState } from 'react'

import { Combobox } from '@vllnt/ui'
import { ArrowUpRight, CornerDownRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CommandBlock } from './command-block'

const PRESETS = [
  { backend: true, id: 'saas', sections: ['landing', 'dashboard', 'auth'] },
  { backend: false, id: 'landing', sections: ['landing'] },
  { backend: false, id: 'blog', sections: ['blog'] },
  { backend: false, id: 'marketing', sections: ['landing', 'blog'] },
  {
    backend: true,
    id: 'saas-blog',
    sections: ['landing', 'dashboard', 'auth', 'blog'],
  },
  {
    backend: true,
    id: 'full-saas',
    sections: ['landing', 'dashboard', 'auth', 'blog', 'docs'],
  },
  { backend: true, id: 'dashboard', sections: ['dashboard', 'auth'] },
  { backend: true, id: 'internal', sections: ['dashboard', 'admin', 'auth'] },
  { backend: false, id: 'docs', sections: ['docs'] },
  { backend: false, id: 'custom', sections: [] },
] as const

const ROUTES = {
  admin: '/admin',
  auth: '/login · /register',
  blog: '/blog · /blog/[slug]',
  dashboard: '/dashboard',
  docs: '/docs · /docs/[slug]',
  landing: '/',
} as const

export function PresetWorkbench(): React.ReactNode {
  const t = useTranslations('Presets')
  const [selected, setSelected] = useState<string>('saas')
  const preset = PRESETS.find((item) => item.id === selected) ?? PRESETS[0]
  const label = t(preset.id === 'full-saas' ? 'full_saas' : preset.id)
  const command =
    preset.id === 'custom'
      ? 'npx create-vllnt-app@latest new'
      : `npx create-vllnt-app@latest new --preset ${preset.id}`

  return (
    <div className="preset-workbench" id="presets">
      <div className="preset-picker">
        <p className="eyebrow" id="preset-label">
          {t('selector')}
        </p>
        <Combobox
          emptyText={t('empty')}
          onValueChange={(value) => {
            if (value) setSelected(value)
          }}
          options={PRESETS.map((item) => ({
            label: t(item.id === 'full-saas' ? 'full_saas' : item.id),
            value: item.id,
          }))}
          placeholder={t('selector')}
          ref={(element) => {
            element?.setAttribute('aria-labelledby', 'preset-label')
          }}
          searchPlaceholder={t('search')}
          value={selected}
        />
        <p className="picker-note">{t('options')}</p>
        <div className="preset-command">
          <CommandBlock
            command={command}
            key={command}
            label={t('copy_label', { preset: label })}
          />
        </div>
        <p className="requirements">{t('requirements')}</p>
      </div>
      <PresetPreview preset={preset} />
    </div>
  )
}

function PresetPreview({
  preset,
}: {
  preset: (typeof PRESETS)[number]
}): React.ReactNode {
  const t = useTranslations('Presets')
  const label = t(preset.id === 'full-saas' ? 'full_saas' : preset.id)
  return (
    <figure
      aria-label={t('preview_label', { preset: label })}
      className="project-artifact"
    >
      <figcaption>
        <CornerDownRight aria-hidden="true" />
        {t('included')}
        <span className="artifact-tag">{preset.id}</span>
      </figcaption>
      <div className="artifact-body">
        <p className="preview-caveat">{t('skeletons')}</p>
        <dl className="route-list">
          {preset.sections.map((section) => (
            <div key={section}>
              <dt>{section}</dt>
              <dd>
                <code>{ROUTES[section]}</code>
              </dd>
            </div>
          ))}
        </dl>
        {preset.id === 'custom' && (
          <p className="muted custom-preview">{t('custom_hint')}</p>
        )}
        <p className="backend-note">
          {preset.id === 'custom'
            ? t('custom_detail')
            : preset.backend
              ? t('backend')
              : t('no_backend')}
        </p>
        <p className="context-proof">
          <code>CLAUDE.md + AGENTS.md</code>
          <span>{t('context')}</span>
        </p>
      </div>
      <a
        className="artifact-source text-link"
        href="https://github.com/vllnt/create-vllnt-app/tree/main/cli/templates/sections"
      >
        {t('source')}
        <ArrowUpRight aria-hidden="true" />
      </a>
    </figure>
  )
}
