import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type {
  EasyUIBaseProps,
  WithContentProps,
  WithFieldValidationProps,
  WithLabelProps,
  WithVariantProps,
} from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type { ListboxOption, SelectionIndicator } from '../../internal/listbox'

export type AutocompleteVariant = FormFieldVariant

export type AutocompleteSelectionIndicator = SelectionIndicator

export type AutocompleteSlots =
  | 'base'
  | 'label'
  | 'inputWrapper'
  | 'input'
  | 'chips'
  | 'chip'
  | 'chipLabel'
  | 'chipRemoveButton'
  | 'startContent'
  | 'endContent'
  | 'arrow'
  | 'listbox'
  | 'option'
  | 'description'
  | 'error'
  | 'spinner'

export type AutocompleteOption = ListboxOption

export interface AutocompleteCommonProps
  extends Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'color' | 'disabled' | 'required' | 'readOnly' | 'value' | 'defaultValue' | 'onChange'
    >,
    EasyUIBaseProps<AutocompleteSlots>,
    WithContentProps,
    WithLabelProps,
    WithFieldValidationProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: AutocompleteVariant
  options: AutocompleteOption[]
  selectionIndicator?: AutocompleteSelectionIndicator
  placeholder?: string
  error?: string
  isRequired?: boolean
  validations?: Array<(option: AutocompleteOption) => string | null>
  noResultsMessage?: string
  isInputClearedOnFocus?: boolean
  arrow?: ReactNode
  arrowPlacement?: 'start' | 'end'
  isArrowHidden?: boolean
}

export interface AutocompleteSingleProps extends AutocompleteCommonProps {
  selectionMode?: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface AutocompleteMultipleProps extends AutocompleteCommonProps {
  selectionMode: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (values: string[]) => void
}

export type AutocompleteProps = AutocompleteSingleProps | AutocompleteMultipleProps
