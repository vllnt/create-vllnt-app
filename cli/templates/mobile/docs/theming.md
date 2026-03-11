# Theming

## Color Tokens

Defined in `lib/constants.ts` with light and dark variants:

```typescript
export const Colors = {
  light: {
    text: '#11181c',
    background: '#ffffff',
    tint: '#6366f1',
  },
  dark: {
    text: '#ecedee',
    background: '#151718',
    tint: '#818cf8',
  },
}
```

## Theme Provider

The `ThemeProvider` in `contexts/theme.tsx` detects system color scheme and provides colors:

```tsx
import { useTheme } from '@/contexts/theme'

function MyComponent() {
  const { colors, isDark } = useTheme()
  return <View style={{ backgroundColor: colors.background }} />
}
```

## Dark Mode

Automatic via `useColorScheme()` from React Native. The theme provider reads system preference and exposes the correct color set.

## Component Styling

Use `StyleSheet.create` with color tokens:

```tsx
import { StyleSheet } from 'react-native'
import { Colors } from '@/lib/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 8,
  },
})
```

For theme-aware styles, use the `useTheme` hook inside components.
