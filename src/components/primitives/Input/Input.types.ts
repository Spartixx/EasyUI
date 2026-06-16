import type { ComponentPropsWithoutRef } from 'react'
import type { EasyUIBaseProps, WithContentProps, WithLabelProps, WithVariantProps } from '../../../types/base'

export type InputVariant = 'bordered' | 'faded' | 'flat' | 'underlined'

export type InputSlots =
  | 'base'
  | 'label'
  | 'inputWrapper'
  | 'input'
  | 'startContent'
  | 'endContent'
  | 'description'
  | 'error'
  | 'spinner'

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'color' | 'disabled' | 'required' | 'readOnly'>,
    EasyUIBaseProps<InputSlots>,
    WithContentProps,
    WithLabelProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: InputVariant
  labelPlacement?: 'outside' | 'inside'
  error?: string
  onValueChange?: (value: string) => void
  isRequired?: boolean
  isReadOnly?: boolean
  validations?: Array<(value: string) => string | null>
}
