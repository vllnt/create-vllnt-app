'use client'

import { useState } from 'react'

import { Button, Textarea } from '@vllnt/ui'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'

type CommandBlockProps = { command: string; label: string }

export function CommandBlock({
  command,
  label,
}: CommandBlockProps): React.ReactNode {
  const t = useTranslations('Command')
  const [status, setStatus] = useState<
    'copied' | 'failed' | 'idle' | 'pending'
  >('idle')

  async function handleCopy(): Promise<void> {
    setStatus('pending')
    try {
      await navigator.clipboard.writeText(command)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <div className="command-block">
      <div className="command-line">
        <span aria-hidden="true" className="command-prompt">
          $
        </span>
        <Textarea
          aria-label={label}
          readOnly
          rows={command.split('\n').length}
          value={command}
          wrap="off"
        />
        <Button
          aria-label={label}
          disabled={status === 'pending'}
          onClick={() => {
            void handleCopy()
          }}
          type="button"
        >
          {status === 'copied' ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          {status === 'copied' ? t('copied') : t('copy')}
        </Button>
      </div>
      <p aria-live="polite" className="command-status">
        {status === 'failed'
          ? t('failed')
          : status === 'copied'
            ? t('success')
            : t('hint')}
      </p>
    </div>
  )
}
