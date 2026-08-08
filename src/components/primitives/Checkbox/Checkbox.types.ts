import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type {
  EasyUIBaseProps,
  WithFieldValidationProps,
  WithLabelProps,
  WithVariantProps,
} from '../../../types/base'

export type CheckboxSlots =
  | 'base'
  | 'wrapper'
  | 'icon'
  | 'content'
  | 'label'
  | 'description'
  | 'error'

export interface CheckboxProps
  extends Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'color' | 'type' | 'checked' | 'defaultChecked' | 'value'
    >,
    Omit<EasyUIBaseProps<CheckboxSlots>, 'isLoading'>,
    Omit<WithVariantProps, 'variant'>,
    WithLabelProps,
    WithFieldValidationProps {
  isSelected?: boolean
  defaultSelected?: boolean
  onValueChange?: (isSelected: boolean) => void
  isIndeterminate?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  error?: string
  validations?: Array<(isSelected: boolean) => string | null>
  icon?: ReactNode
  indeterminateIcon?: ReactNode
  value?: string
}
