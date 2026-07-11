import type { ComponentPropsWithoutRef } from 'react'
import type { EasyUIBaseProps, WithContentProps, WithLabelProps, WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'

export type InputNumberVariant = FormFieldVariant

export type InputNumberSlots =
  | 'base'
  | 'label'
  | 'inputWrapper'
  | 'input'
  | 'prefix'
  | 'suffix'
  | 'startContent'
  | 'endContent'
  | 'description'
  | 'error'
  | 'spinner'
  | 'stepper'
  | 'incrementButton'
  | 'decrementButton'

export interface InputNumberProps
  extends Omit<
      ComponentPropsWithoutRef<'input'>,
      | 'size'
      | 'color'
      | 'disabled'
      | 'required'
      | 'readOnly'
      | 'type'
      | 'value'
      | 'defaultValue'
      | 'onChange'
      | 'prefix'
      | 'min'
      | 'max'
      | 'step'
    >,
    EasyUIBaseProps<InputNumberSlots>,
    WithContentProps,
    WithLabelProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: InputNumberVariant
  labelPlacement?: 'outside' | 'inside'
  stepperPlacement?: 'end' | 'sides'
  prefix?: string
  suffix?: string
  value?: number | null
  defaultValue?: number | null
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number | null) => void
  isWheelStepEnabled?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  error?: string
  validations?: Array<(value: number | null) => string | null>
}
