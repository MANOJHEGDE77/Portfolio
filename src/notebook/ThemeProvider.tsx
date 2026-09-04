import { useEffect, useState, type ReactNode } from 'react'
import { SECTION_IDS } from '@/content/profile'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { useTimers } from '@/hooks/useTimers'
import { THEME_SWITCH_DELAY_MS, themeSwitchSettleMs } from '@/lib/motion'
import {
  CANVAS_PALETTE,
  assertPaletteMatchesCss,
  clearRootFx,
  readInitialTheme,
  setRootFx,
  writeStoredTheme,
  type Theme,
} from '@/lib/theme'
import { ThemeContext } from './ThemeContext'

const flip = (theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark')

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)
  const reducedMotion = useReducedMotion()
  const timers = useTimers()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStoredTheme(theme)
    if (import.meta.env.DEV) assertPaletteMatchesCss(theme)
  }, [theme])

  const toggleTheme = () => {
    if (reducedMotion) {
      setTheme(flip)
      return
    }
    // Notebook-style: every cell output "re-executes" into the new theme.
    // The functional update keeps rapid double clicks honest.
    setRootFx('switching')
    timers.set(() => setTheme(flip), THEME_SWITCH_DELAY_MS)
    timers.set(() => clearRootFx('switching'), themeSwitchSettleMs(SECTION_IDS.length))
  }

  return (
    <ThemeContext value={{ theme, palette: CANVAS_PALETTE[theme], toggleTheme }}>
      {children}
    </ThemeContext>
  )
}
