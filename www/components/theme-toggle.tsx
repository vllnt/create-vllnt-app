'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle(): React.ReactNode {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-xs text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
      type="button"
    >
      {resolvedTheme === 'dark' ? 'light' : 'dark'}
    </button>
  )
}
