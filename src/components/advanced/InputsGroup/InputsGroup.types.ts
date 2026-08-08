import type { ReactNode } from 'react'
import type { EasyUIBaseProps } from '../../../types/base'
import type { ButtonProps, InputProps, InputNumberProps } from '../../primitives'

export type InputsGroupSlots =
  | 'base'
  | 'header'
  | 'label'
  | 'description'
  | 'items'
  | 'item'
  | 'input'
  | 'removeButton'
  | 'addButton'

export interface RenderRemoveButtonParams {
  onRemove: () => void
  index: number
  isDisabled: boolean
}

export interface InputsGroupCommonProps extends Omit<EasyUIBaseProps<InputsGroupSlots>, 'isLoading'> {
  label?: string
  description?: string
  error?: string
  isRequiredMessage?: string
  removeButtonPlacement?: 'left' | 'right'
  maxItems?: number
  addButtonLabel?: string
  addButtonPlacement?: 'left' | 'right' | 'full-width'
  isAddButtonHidden?: boolean
  addButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>
  removeButtonProps?: Omit<ButtonProps, 'onClick'>
  renderRemoveButton?: (params: RenderRemoveButtonParams) => ReactNode
}

type SharedInputPropsOmit =
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'label'
  | 'description'
  | 'error'
  | 'isRequired'
  | 'validations'

export interface InputsGroupTextInitialValue {
  isRequired?: boolean
  value: string
}

export interface InputsGroupTextProps extends InputsGroupCommonProps {
  type?: 'text'
  initialValues?: InputsGroupTextInitialValue[]
  values?: string[]
  onValuesChange?: (values: string[]) => void
  onNonEmptyValuesChange?: (values: string[]) => void
  validations?: Array<(value: string) => string | null>
  inputProps?: Omit<InputProps, SharedInputPropsOmit>
}

export interface InputsGroupNumberInitialValue {
  isRequired?: boolean
  value: number | null
}

export interface InputsGroupNumberProps extends InputsGroupCommonProps {
  type: 'number'
  initialValues?: InputsGroupNumberInitialValue[]
  values?: (number | null)[]
  onValuesChange?: (values: (number | null)[]) => void
  onNonEmptyValuesChange?: (values: number[]) => void
  validations?: Array<(value: number | null) => string | null>
  inputProps?: Omit<InputNumberProps, SharedInputPropsOmit>
}

export type InputsGroupProps = InputsGroupTextProps | InputsGroupNumberProps
