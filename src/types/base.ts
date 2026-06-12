import type { ReactNode } from 'react'

export interface EasyUIBaseProps<TSlots extends string = string> {
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  classNames?: Partial<Record<TSlots, string>>
}

export interface WithContentProps {
  startContent?: ReactNode
  endContent?: ReactNode
  startContentPlacement?: 'outside' | 'inside'
  endContentPlacement?: 'outside' | 'inside'
}

export interface WithVariantProps {
  variant?: 'solid' | 'outlined' | 'flat' | 'light'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export interface WithLabelProps {
  label?: string
  description?: string
  descriptionPlacement?: 'label' | 'element'
}
