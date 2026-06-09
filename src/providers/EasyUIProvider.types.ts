import type { ReactNode } from 'react'
import type { EasyUIConfig } from '../config/easyui.config.types'

export interface EasyUIProviderProps {
  config?: EasyUIConfig
  children?: ReactNode
}

export type EasyUIContextValue = EasyUIConfig
