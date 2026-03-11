import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function TabLayout(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6366f1',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarLabel: t('tabs.home'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarLabel: t('tabs.settings'),
        }}
      />
    </Tabs>
  )
}
