'use client'

import { ThemeToggle as VllntThemeToggle } from '@vllnt/ui'

const themeDict = {
  theme: {
    dark: 'Dark',
    light: 'Light',
    system: 'System',
    toggle_theme: 'Toggle theme',
  },
}

export function ThemeToggle(): React.ReactNode {
  return <VllntThemeToggle dict={themeDict} />
}
