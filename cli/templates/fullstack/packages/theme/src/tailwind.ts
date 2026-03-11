import { colors, spacing, radii } from './tokens'

export const tailwindTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
  },
  spacing: Object.fromEntries(
    Object.entries(spacing).map(([k, v]) => [k, `${v}px`]),
  ),
  borderRadius: Object.fromEntries(
    Object.entries(radii).map(([k, v]) => [k, `${v}px`]),
  ),
} as const
