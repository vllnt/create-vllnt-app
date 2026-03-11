import { createContext, useContext, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/lib/constants'

interface ThemeContextValue {
  colors: typeof Colors.light
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Colors.light,
  isDark: false,
})

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const colors = isDark ? Colors.dark : Colors.light

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
