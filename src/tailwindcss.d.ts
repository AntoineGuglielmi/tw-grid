import 'tailwindcss/types/config'

declare module 'tailwindcss/types/config' {
  export interface TailwindTheme {
    typeface: Record<
      string,
      {
        fontFamily: string
        fontSize: string
        lineHeight?: string | number
        letterSpacing?: string
        fontWeight?:
          | '100'
          | '200'
          | '300'
          | '400'
          | '500'
          | '600'
          | '700'
          | '800'
          | '900'
      }
    >
  }
}
