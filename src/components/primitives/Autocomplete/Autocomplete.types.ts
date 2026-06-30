import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { EasyUIBaseProps, WithContentProps, WithLabelProps, WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type { ListboxOption } from '../../internal/listbox'

export type AutocompleteVariant = FormFieldVariant

export type AutocompleteSlots =
  | 'base'
  | 'label'
  | 'inputWrapper'
  | 'input'
  | 'startContent'
  | 'endContent'
  | 'arrow'
  | 'listbox'
  | 'option'
  | 'description'
  | 'error'
  | 'spinner'

export type AutocompleteOption = ListboxOption

export interface AutocompleteProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'color' | 'disabled' | 'required' | 'readOnly' | 'value' | 'onChange'>,
    EasyUIBaseProps<AutocompleteSlots>,
    WithContentProps,
    WithLabelProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: AutocompleteVariant
  options: AutocompleteOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  error?: string
  isRequired?: boolean
  noResultsMessage?: string
  arrow?: ReactNode
  arrowPlacement?: 'start' | 'end'
  isArrowHidden?: boolean
}
