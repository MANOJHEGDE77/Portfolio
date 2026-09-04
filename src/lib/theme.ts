export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'nb-theme'

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

/** Colors the canvas widgets paint with. `txt` is an "r,g,b" triple for rgba(). */
export interface CanvasPalette {
  txt: string
  ember: string
  amber: string
  teal: string
  ok: string
  err: string
  bronze: string
  silver: string
  gold: string
  bg: string
}

/**
 * Mirrors the `--nb-*` custom properties in index.css. CSS must own the values
 * (they are needed before any JS runs, to avoid a theme flash) and canvas
 * needs them as strings, so both copies exist; assertPaletteMatchesCss keeps
 * them honest in development.
 */
export const CANVAS_PALETTE: Record<Theme, CanvasPalette> = {
  dark: {
    txt: '239,233,228',
    ember: '#ff5a2c',
    amber: '#f5b342',
    teal: '#2fd3b5',
    ok: '#3ad38f',
    err: '#ff6b6b',
    bronze: '#cd7f32',
    silver: '#b8bcc6',
    gold: '#ffc94a',
    bg: '#0b0908',
  },
  light: {
    txt: '28,20,16',
    ember: '#d5431a',
    amber: '#a8720c',
    teal: '#0d8c76',
    ok: '#128a5c',
    err: '#c8372f',
    bronze: '#9c5a1c',
    silver: '#6e737d',
    gold: '#b8860b',
    bg: '#f5f0e8',
  },
}

const PALETTE_CSS_VAR: Record<keyof CanvasPalette, string> = {
  txt: '--nb-txt',
  ember: '--nb-ember',
  amber: '--nb-amber',
  teal: '--nb-teal',
  ok: '--nb-ok',
  err: '--nb-err',
  bronze: '--nb-bronze',
  silver: '--nb-silver',
  gold: '--nb-gold',
  bg: '--nb-bg',
}

function hexToTriple(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

/** Development guard: warns when index.css and CANVAS_PALETTE drift apart. */
export function assertPaletteMatchesCss(theme: Theme): void {
  const css = getComputedStyle(document.documentElement)
  const palette = CANVAS_PALETTE[theme]
  for (const key of Object.keys(PALETTE_CSS_VAR) as Array<keyof CanvasPalette>) {
    const cssValue = css.getPropertyValue(PALETTE_CSS_VAR[key]).trim().toLowerCase()
    const expected = key === 'txt' ? hexToTriple(cssValue) : cssValue
    if (expected !== palette[key].toLowerCase()) {
      console.warn(`[theme] ${theme} ${PALETTE_CSS_VAR[key]} is ${cssValue} in CSS but CANVAS_PALETTE has ${palette[key]}`)
    }
  }
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode or storage disabled. Theme still applies for this visit.
  }
}

/** The inline script in index.html sets data-theme before React mounts. */
export function readInitialTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  return isTheme(attr) ? attr : (readStoredTheme() ?? 'dark')
}

export type RootFx = 'switching' | 'vacuum'

/** Global visual effect flag consumed by CSS (see .cell-out rules in index.css). */
export function setRootFx(fx: RootFx): void {
  document.documentElement.dataset.fx = fx
}

/** Clears the flag only if it still belongs to the caller's effect. */
export function clearRootFx(fx: RootFx): void {
  if (document.documentElement.dataset.fx === fx) delete document.documentElement.dataset.fx
}
