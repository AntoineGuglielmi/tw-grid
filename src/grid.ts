import { spacing } from '@antoineguglielmi/tw-spacing'
import plugin from 'tailwindcss/plugin'

export type GridProps = {
  configKey?: string
}

export type GridSet = {
  cols?: number
  padding?: string
  gap?: string
  extends?: string
  [key: string]: GridSet | string | number | undefined
}

export type GridSets = Record<string, GridSet>

/**
 * Define the grid plugin
 * @param configKey The configuration key
 * @returns The grid plugin
 */
export const grid = ({ configKey = 'grid' }: GridProps = {}) => {
  return plugin(
    ({ addUtilities, theme, e }) => {
      // Retrieve the grid sets from the theme configuration using the provided config key
      const gridSets = theme(configKey) as GridSets

      // Retrieve the breakpoints from the theme configuration
      const breakpoints = theme('screens')

      // Retrieve the spacing from the theme configuration
      const spacing = theme('spacing')

      // Initialize an empty object to store the new utilities
      const newUtilities: Record<string, any> = {}

      // Iterate over the grid sets
      Object.entries(gridSets).forEach(([gridName, rawGridSet]) => {
        // Extract the extends property from the grid set
        const { entends: notUsed, ...overRiding } = rawGridSet

        // Merge the grid set with the extended grid set
        const refinedGridSet = {
          ...(rawGridSet.extends ? gridSets[rawGridSet.extends] : {}),
          ...overRiding,
        }

        // Extract the extends, cols, padding, and gap properties from the refined grid set
        const {
          extends: notUsed2,
          cols: notUsed3,
          padding: notUsed4,
          gap: notUsed5,
          ...rawBps
        } = refinedGridSet

        // Merge the breakpoints with the grid set
        const refinedBps = Object.entries(rawBps).reduce((acc, [bp, set]) => {
          return {
            ...acc,
            ...(typeof set === 'object' && set?.extends
              ? { [bp]: gridSets[set.extends][bp] }
              : { [bp]: set }),
          }
        }, {})

        // Merge the grid set with the breakpoints
        const finalGridSet = {
          ...refinedGridSet,
          ...refinedBps,
        }

        // Update the grid set in the theme configuration
        theme(configKey)![gridName] = finalGridSet

        // Extract the cols, padding, and gap properties from the final grid set
        const { cols, padding, gap, extends: notUsed6, ...bps } = finalGridSet

        // Define the base class
        const baseClass = {
          display: 'grid',
          ...(cols
            ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
            : {}),
          ...(padding ? { padding: spacing![padding] ?? padding } : {}),
          ...(gap ? { gap: spacing![gap] ?? gap } : {}),
        }

        // Define the responsive classes
        const responsiveClasses = Object.entries(bps).reduce(
          (acc, [bpName, bpGridSet]) => {
            if (breakpoints && breakpoints[bpName]) {
              // Extract the cols, padding, and gap properties from the breakpoint grid set
              const {
                cols: bpCols,
                padding: bpPadding,
                gap: bpGap,
              } = bpGridSet as GridSet

              // Return the responsive class
              return {
                ...acc,
                [`@media (min-width: ${breakpoints[bpName]})`]: {
                  ...(bpCols
                    ? {
                        gridTemplateColumns: `repeat(${bpCols}, minmax(0, 1fr))`,
                      }
                    : {}),
                  ...(bpPadding
                    ? { padding: spacing![bpPadding] ?? bpPadding }
                    : {}),
                  ...(bpGap ? { padding: spacing![bpGap] ?? bpGap } : {}),
                },
              }
            }
            return acc
          },
          {} as Record<string, any>,
        )

        // Define the new utility
        const newUtilitie = {
          ...baseClass,
          ...responsiveClasses,
        }

        // Add the new utility to the new utilities object
        newUtilities[`.${e(`grid-${gridName}`)}`] = newUtilitie
      })

      // Add the new utilities to the Tailwind CSS build
      addUtilities(newUtilities)
    },
    {
      theme: {
        [configKey]: {
          standard: {
            cols: 1,
            gap: '1rem',
            md: {
              cols: 2,
            },
            lg: {
              cols: 3,
            },
          },
        },
      },
    },
  )
}

/**
 * Define the grid sets
 * @param gridSets The grid sets
 * @returns The grid sets
 */
export const defineGrid = (gridSets: GridSets): GridSets => {
  // Return the grid sets as is
  // This function is only used to help autocompletion in the editor
  return gridSets
}
