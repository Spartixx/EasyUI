import type { ReactNode } from 'react'

export type SelectionIndicator = 'check' | 'none'

export interface ListboxOption {
  value: string
  label: string
  description?: string
  isDisabled?: boolean
  startContent?: ReactNode
  endContent?: ReactNode
}
