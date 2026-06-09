import { createContext, useContext } from 'react'
import type { EasyUIContextValue } from './EasyUIProvider.types'

export const EasyUIContext = createContext<EasyUIContextValue>({})

export function useEasyUIConfig(): EasyUIContextValue {
  return useContext(EasyUIContext)
}
