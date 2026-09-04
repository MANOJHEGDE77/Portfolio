import { createContext, useContext } from 'react'

export type CellStatus = 'pending' | 'running' | 'done'

export const CellStatusContext = createContext<CellStatus>('pending')

/** The execution state of the enclosing <Cell>, for outputs that animate on reveal. */
export function useCellStatus(): CellStatus {
  return useContext(CellStatusContext)
}
