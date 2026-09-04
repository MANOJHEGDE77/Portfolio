import { createContext, useContext } from 'react'
import type { CanvasPalette, Theme } from '@/lib/theme'

export interface ThemeContextValue {
  theme: Theme
  palette: CanvasPalette
  toggleTheme(): void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
