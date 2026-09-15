'use client'

import { useState } from 'react'

import { Combobox } from '@vllnt/ui'
import { useTranslations } from 'next-intl'

import { CommandBlock } from './command-block'

const PRESETS = [
  { backend: true, id: 'saas', sections: 'landing + dashboard + auth' },
  { backend: false, id: 'landing', sections: 'landing' },
  { backend: false, id: 'blog', sections: 'blog' },
  { backend: false, id: 'marketing', sections: 'landing + blog' },
  {
    backend: true,
    id: 'saas-blog',
    sections: 'landing + dashboard + auth + blog',
  },
  {
    backend: true,
    id: 'full-saas',
    sections: 'landing + dashboard + auth + blog + docs',
  },
  { backend: true, id: 'dashboard', sections: 'dashboard + auth' },
  { backend: true, id: 'internal', sections: 'dashboard + admin + auth' },
  { backend: false, id: 'docs', sections: 'docs' },
  { backend: false, id: 'custom', sections: '' },
] as const

export function PresetWorkbench(): React.ReactNode {
  const t = useTranslations('Presets')
  const [selected, setSelected] = useState<string>('saas')
  const preset = PRESETS.find((item) => item.id === selected) ?? PRESETS[0]
  const command =
    preset.id === 'custom'
      ? 'node cli/dist/index.js new'
      : `node cli/dist/index.js new --preset ${preset.id}`

  return (
    <div className="preset-workbench">
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
        <p className="preset-catalog">
          {PRESETS.map((item) =>
            t(item.id === 'full-saas' ? 'full_saas' : item.id),
          ).join(' · ')}
        </p>
      </div>
      <div className="preset-detail">
        <p className="eyebrow">{t('included')}</p>
        <h3>{t(preset.id === 'full-saas' ? 'full_saas' : preset.id)}</h3>
        <p className="preset-sections">
          {preset.id === 'custom' ? t('custom_hint') : preset.sections}
        </p>
        <p className="muted">
          {preset.id === 'custom'
            ? t('custom_detail')
            : preset.backend
              ? t('backend')
              : t('no_backend')}
        </p>
        <div className="preset-command">
          <CommandBlock
            command={command}
            key={command}
            label={t('copy_label', {
              preset: t(preset.id === 'full-saas' ? 'full_saas' : preset.id),
            })}
          />
        </div>
        <p className="small muted">{t('prompt_note')}</p>
      </div>
    </div>
  )
}
