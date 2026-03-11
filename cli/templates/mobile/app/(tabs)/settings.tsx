import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function SettingsScreen(): JSX.Element {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
})
