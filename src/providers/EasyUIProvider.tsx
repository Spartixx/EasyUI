import { EasyUIContext } from './EasyUIContext'
import type { EasyUIProviderProps } from './EasyUIProvider.types'

export function EasyUIProvider({ config = {}, children }: EasyUIProviderProps) {
  return <EasyUIContext.Provider value={config}>{children}</EasyUIContext.Provider>
}

EasyUIProvider.displayName = 'EasyUIProvider'
