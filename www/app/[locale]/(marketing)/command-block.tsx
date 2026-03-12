'use client'

import { useState } from 'react'

type CommandBlockProps = {
  command: string
}

export function CommandBlock({ command }: CommandBlockProps): React.ReactNode {
  const [copied, setCopied] = useState(false)

  function handleCopy(): void {
    void navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="group relative inline-flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm">
      <span className="text-muted-foreground">$</span>
      <span className="text-foreground">{command}</span>
      <button
        aria-label="Copy command"
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}
