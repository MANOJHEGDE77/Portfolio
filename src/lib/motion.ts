/**
 * Single owner for every timing the notebook choreography depends on.
 * CSS reads the stagger values through custom properties set by
 * applyMotionTokens(); everything else is consumed directly from here.
 */
export const CELL_RUN_MIN_MS = 420
export const CELL_RUN_MAX_MS = 900
export const CELL_REVEAL_MS = 550
export const RUN_ALL_STAGGER_MS = 220

export const THEME_SWITCH_DELAY_MS = 200
export const THEME_SWITCH_STAGGER_MS = 40

export const VACUUM_STAGGER_MS = 60
export const VACUUM_HOLD_MS = 1500

export const BOOT_MS = 2120
export const BOOT_BAR_MS = 1500

export const TOAST_DEFAULT_MS = 2600

/** How long the last cell needs to settle after a theme switch starts. */
export function themeSwitchSettleMs(cellCount: number): number {
  return THEME_SWITCH_DELAY_MS + CELL_REVEAL_MS + cellCount * THEME_SWITCH_STAGGER_MS
}

/** Publish the values CSS transitions need. Call once before first render. */
export function applyMotionTokens(): void {
  const style = document.documentElement.style
  style.setProperty('--switch-stagger', `${THEME_SWITCH_STAGGER_MS}ms`)
  style.setProperty('--vacuum-stagger', `${VACUUM_STAGGER_MS}ms`)
  style.setProperty('--cell-reveal', `${CELL_REVEAL_MS}ms`)
}
