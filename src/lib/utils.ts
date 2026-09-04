import { clsx, type ClassValue } from 'clsx'

/**
 * Joins class names, dropping falsy values. Callers keep conflicting utilities
 * out of the same element on purpose, so no merge step is needed.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
