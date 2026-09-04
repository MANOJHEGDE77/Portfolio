/** Brand colors for logos that simple-icons does not cover, plus the marker shapes. */
export const BRAND_COLOR = {
  azure: '#0078d4',
  awsS3: '#569a31',
  powerBi: '#f2c811',
  excel: '#217346',
  spring: '#6db33f',
  mysql: '#4479a1',
  mongo: '#47a248',
  jwt: '#d63aff',
} as const

/** Diamond gradient for special architectural markers. */
export const DELTA_GRADIENT = 'linear-gradient(135deg, var(--nb-teal), #00add8)'

export type DotShape = 'circle' | 'square' | 'diamond'

