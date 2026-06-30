import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { EasyUIBaseProps, WithContentProps, WithLabelProps, WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type { ListboxOption } from '../../internal/listbox'

export type SelectorVariant = FormFieldVariant

export type SelectorSlots =
  | 'base'
  | 'label'
  | 'trigger'
  | 'value'
  | 'startContent'
  | 'endContent'
  | 'arrow'
  | 'listbox'
  | 'option'
  | 'description'
  | 'error'
  | 'spinner'

export type SelectorOption = ListboxOption

export interface SelectorProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color' | 'disabled' | 'value' | 'onChange'>,
    EasyUIBaseProps<SelectorSlots>,
    WithContentProps,
    WithLabelProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: SelectorVariant
  options: SelectorOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  error?: string
  isRequired?: boolean
  arrow?: ReactNode
  arrowPlacement?: 'start' | 'end'
  isArrowHidden?: boolean
}
