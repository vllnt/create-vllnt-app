'use client'

import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

interface CommandBlockProps {
  command: string
}

export function CommandBlock({ command }: CommandBlockProps): React.ReactNode {
  const [copied, setCopied] = useState(false)

  function handleCopy(): void {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-sm">
      <Terminal className="h-4 w-4 text-muted-foreground" />
      <span className="text-foreground">{command}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
