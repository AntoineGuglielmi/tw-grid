import plugin from 'tailwindcss/plugin'
import { TailwindTheme } from 'tailwindcss/types/config'

export const typeface = plugin(
  function ({ addUtilities, theme, e }) {
    const typefaces = theme('typeface') as TailwindTheme['typeface'] // Assure-toi que TypeScript valide l'objet
    const spacing = theme('spacing')

    const newUtilities: Record<string, any> = {}

    Object.keys(typefaces).forEach((key) => {
      const styles = typefaces[key]
      const fontSize = spacing![styles.fontSize] ?? styles.fontSize

      newUtilities[`.${e(`typeface-${key}`)}`] = {
        fontFamily: styles.fontFamily,
        fontSize,
        ...(styles.lineHeight ? { lineHeight: styles.lineHeight } : {}),
        ...(styles.letterSpacing
          ? { letterSpacing: styles.letterSpacing }
          : {}),
        ...(styles.fontWeight ? { fontWeight: styles.fontWeight } : {}),
      }
    })

    addUtilities(newUtilities)
  },
  {
    theme: {
      typeface: {
        body: {
          fontFamily: 'var(--font-nunito)',
          fontSize: 'base',
          fontWeight: '400',
          lineHeight: '1.5',
        },
      },
    },
  },
)
