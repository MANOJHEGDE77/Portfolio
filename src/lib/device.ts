interface NavigatorHints extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

function detectLowEnd(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as NavigatorHints
  // A browser too old to report core count is running on old hardware.
  // Safari never reports deviceMemory or connection, so those only ever
  // pull the answer towards low-end, never away from it.
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 8
  return cores <= 4 || memory <= 4 || nav.connection?.saveData === true
}

/**
 * Heuristic, evaluated once. On low-end devices the animation loop runs at
 * 30fps, canvases render at a lower DPR and glow effects are skipped.
 */
export const isLowEndDevice: boolean = detectLowEnd()
