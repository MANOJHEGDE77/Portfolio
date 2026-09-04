export interface Point {
  x: number
  y: number
}

export function centerOf(el: Element): Point {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}
