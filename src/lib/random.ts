/** Uniform random number in [min, max). */
export function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function pick<T>(items: ReadonlyArray<T>): T {
  return items[Math.floor(Math.random() * items.length)]
}
