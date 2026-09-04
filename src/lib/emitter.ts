export interface Emitter<T> {
  emit(value: T): void
  subscribe(listener: (value: T) => void): () => void
  readonly size: number
}

/** Minimal synchronous pub/sub. Used where React state would re-render too often. */
export function createEmitter<T>(): Emitter<T> {
  const listeners = new Set<(value: T) => void>()
  return {
    emit(value) {
      for (const listener of listeners) listener(value)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    get size() {
      return listeners.size
    },
  }
}
