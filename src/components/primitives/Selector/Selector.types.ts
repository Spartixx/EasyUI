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

export type SelectorVariant = FormFieldVariant

export type SelectorSelectionIndicator = SelectionIndicator

export type SelectorSlots =
  | 'base'
  | 'label'
  | 'trigger'
  | 'activeTrigger'
  | 'value'
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

export type SelectorOption = ListboxOption

export interface SelectorCommonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color' | 'disabled' | 'value' | 'defaultValue' | 'onChange'>,
    EasyUIBaseProps<SelectorSlots>,
    WithContentProps,
    WithLabelProps,
    WithFieldValidationProps,
    Omit<WithVariantProps, 'variant'> {
  variant?: SelectorVariant
  options: SelectorOption[]
  selectionIndicator?: SelectorSelectionIndicator
  placeholder?: string
  triggerText?: string
  isActive?: boolean
  error?: string
  isRequired?: boolean
  validations?: Array<(option: SelectorOption) => string | null>
  noResultsMessage?: string
  arrow?: ReactNode
  arrowPlacement?: 'start' | 'end'
  isArrowHidden?: boolean
}

export interface SelectorSingleProps extends SelectorCommonProps {
  selectionMode?: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface SelectorMultipleProps extends SelectorCommonProps {
  selectionMode: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (values: string[]) => void
}

export type SelectorProps = SelectorSingleProps | SelectorMultipleProps
