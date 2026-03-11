import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout(): JSX.Element {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  )
}
