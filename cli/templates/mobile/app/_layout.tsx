import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { ConvexProvider } from '@/components/providers/convex-provider'
import { ThemeProvider } from '@/contexts/theme'
import '@/i18n'

SplashScreen.preventAutoHideAsync()

export default function RootLayout(): JSX.Element {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <ThemeProvider>
      <ConvexProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </ConvexProvider>
    </ThemeProvider>
  )
}
