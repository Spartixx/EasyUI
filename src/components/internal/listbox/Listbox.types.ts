import type { ReactNode } from 'react'

export interface ListboxOption {
  value: string
  label: string
  description?: string
  isDisabled?: boolean
  startContent?: ReactNode
  endContent?: ReactNode
}
