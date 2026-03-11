import { useColorScheme } from 'react-native'

interface Settings {
  colorScheme: 'light' | 'dark' | null | undefined
}

export function useSettings(): Settings {
  const colorScheme = useColorScheme()
  return { colorScheme }
}
