/**
 * Shared golden-hour lighting + colour palette.
 * Per spec §E.0 (Hero scene lighting).
 */

export const goldenHour = {
  sun: {
    pos: [100, 80, 60] as [number, number, number],
    intensity: 1.2,
    color: '#FFC78F',
  },
  ambient: {
    intensity: 0.4,
    color: '#7A9BC0',
  },
  hemisphere: {
    sky: '#FFE4B5',
    ground: '#5C6E4A',
    intensity: 0.3,
  },
  fog: {
    color: '#FFCFA0',
    density: 0.008,
  },
  sky: {
    top: '#3F5E8C',
    middle: '#FFB37A',
    horizon: '#FFE5C5',
  },
} as const

export function useGoldenHour() {
  return goldenHour
}
