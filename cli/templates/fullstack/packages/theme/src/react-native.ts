import { colors, spacing, radii } from './tokens'

export const Colors = {
  light: {
    text: colors.text.light,
    background: colors.background.light,
    tint: colors.primary,
    border: colors.border.light,
  },
  dark: {
    text: colors.text.dark,
    background: colors.background.dark,
    tint: colors.secondary,
    border: colors.border.dark,
  },
} as const

export { spacing, radii }
