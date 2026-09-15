'use client'

import { useState } from 'react'

import { Button } from '@vllnt/ui'
import { Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function MatrixBackground(): React.ReactNode {
  const t = useTranslations('Motion')
  const [paused, setPaused] = useState(false)

  return (
    <>
      <div
        aria-hidden="true"
        className="matrix-background"
        data-paused={paused}
      >
        <svg
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 720"
        >
          {Array.from({ length: 72 }, (_, index) => {
            const column = index % 12
            const row = Math.floor(index / 12)
            if ((column + row * 3) % 7 === 0) return null
            const x = column * 104 + 24
            const y = row * 120 + 24
            const slant = (((column * 3 + row) % 5) - 2) * 12
            return (
              <path
                d={`M${x} ${y} l${slant} 64`}
                key={index}
                style={{ animationDelay: `${-(index % 9) * 3}s` }}
              />
            )
          })}
        </svg>
      </div>
      <div className="editorial-shell motion-controls">
        <Button
          aria-pressed={paused}
          className="motion-toggle"
          onClick={() => {
            setPaused(!paused)
          }}
          size="sm"
          variant="ghost"
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {paused ? t('resume') : t('pause')}
        </Button>
        <span className="motion-static">{t('static')}</span>
      </div>
    </>
  )
}
