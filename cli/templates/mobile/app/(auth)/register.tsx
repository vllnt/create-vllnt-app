import { View, Text, StyleSheet } from 'react-native'

export default function RegisterScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.hint}>Run: vllnt add auth</Text>
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
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#999',
  },
})
