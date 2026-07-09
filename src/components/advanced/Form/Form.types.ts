import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type {
  InputProps,
  SelectorProps,
  SelectorOption,
  AutocompleteProps,
  AutocompleteOption,
  ButtonProps,
} from '../../primitives'

export type ButtonVariant = NonNullable<WithVariantProps['variant']>
export type FormVariant = FormFieldVariant | ButtonVariant
export type FormColor = NonNullable<WithVariantProps['color']>

export type FormSlots =
  | 'base'
  | 'header'
  | 'title'
  | 'description'
  | 'fieldsWrapper'
  | 'inputField'
  | 'selectorField'
  | 'autocompleteField'
  | 'numberField'
  | 'actions'
  | 'submitButton'
  | 'cancelButton'

export type FieldType = 'input' | 'selector' | 'autocomplete' | 'number' | 'custom'

export type InputKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'password'
  | 'url'
  | 'search'
  | (string & {})

export type FieldValueType = string | string[] | number | null
export type FormValues = Record<string, FieldValueType>
export type FieldValidator<TValue extends FieldValueType> = (value: TValue, values: FormValues) => string | null

interface BaseFieldConfig<TValue extends FieldValueType = string> {
  label?: string
  description?: string
  defaultValue?: TValue
  isRequired?: boolean
  isDisabled?: boolean
  validators?: Array<FieldValidator<TValue>>
  dependsOn?: Record<string, string | null>
  isHidden?: (values: FormValues) => boolean
}

type InputFieldProps = Omit<
  InputProps,
  'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'error' | 'label' | 'description' | 'isRequired' | 'isDisabled' | 'validations' | 'name' | 'type' | 'className'
>
type SelectorFieldProps = Omit<
  SelectorProps,
  'value' | 'defaultValue' | 'onValueChange' | 'error' | 'label' | 'description' | 'isRequired' | 'isDisabled' | 'options' | 'name' | 'className'
>
type AutocompleteFieldProps = Omit<
  AutocompleteProps,
  'value' | 'defaultValue' | 'onValueChange' | 'error' | 'label' | 'description' | 'isRequired' | 'isDisabled' | 'options' | 'name' | 'className'
>

export interface InputFieldConfig extends BaseFieldConfig<string> {
  type: 'input'
  kind?: InputKind
  props?: InputFieldProps
}

export interface SelectorFieldConfig extends BaseFieldConfig<string> {
  type: 'selector'
  options: SelectorOption[]
  props?: SelectorFieldProps
}

export interface AutocompleteFieldConfig extends BaseFieldConfig<string> {
  type: 'autocomplete'
  options: AutocompleteOption[]
  props?: AutocompleteFieldProps
}

export interface NumberFieldConfig extends BaseFieldConfig<number | null> {
  type: 'number'
  props?: InputFieldProps
}

export interface FieldRenderContext<TValue extends FieldValueType = string> {
  name: string
  value: TValue
  setValue: (value: TValue) => void
  onBlur: () => void
  error: string | null
  isDisabled: boolean
}

export type ValidateMode = 'submit' | 'blur' | 'change'

export interface UseFormOptions {
  validateOn?: ValidateMode
}

export interface CustomFieldConfig extends BaseFieldConfig<string> {
  type: 'custom'
  render: (ctx: FieldRenderContext<string>) => ReactNode
}

export type FieldConfig =
  | InputFieldConfig
  | SelectorFieldConfig
  | AutocompleteFieldConfig
  | NumberFieldConfig
  | CustomFieldConfig
export type FormFields = Record<string, FieldConfig>
export type FieldValue<TConfig extends FieldConfig> =
  TConfig extends BaseFieldConfig<infer TValue> ? TValue : FieldValueType

export interface FieldState<TValue extends FieldValueType = FieldValueType> {
  value: TValue
  setValue: (value: TValue) => void
  error: string | null
  isVisible: boolean
  isTouched: boolean
}

export interface FormInstance<TFields extends FormFields = FormFields> {
  fields: { [FieldName in keyof TFields]: FieldState<FieldValue<TFields[FieldName]>> }
  values: { [FieldName in keyof TFields]: FieldValue<TFields[FieldName]> }
  config: TFields
  setValue: <FieldName extends keyof TFields>(name: FieldName, value: FieldValue<TFields[FieldName]>) => void
  getFieldState: <FieldName extends keyof TFields>(name: FieldName) => FieldState<FieldValue<TFields[FieldName]>>
  handleBlur: (name: keyof TFields & string) => void
  validate: () => boolean
  handleSubmit: (onSubmit: FormSubmitHandler) => void | Promise<void>
  reset: () => void
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

export type FormSubmitHandler = (values: FormValues) => void | Promise<void>

export interface FormActionsConfig {
  submitLabel?: string
  loadingLabel?: string
  submittingLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  showCancel?: boolean
  submitProps?: Partial<ButtonProps>
  cancelProps?: Partial<ButtonProps>
}

export interface FormProps<TFields extends FormFields = FormFields>
  extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'children'> {
  form: FormInstance<TFields>
  onSubmit: FormSubmitHandler
  title?: string
  description?: string
  loadingMessage?: string
  disabledMessage?: string
  actions?: FormActionsConfig
  variant?: FormVariant
  color?: FormColor
  isDisabled?: boolean
  isLoading?: boolean
  className?: string
  classNames?: Partial<Record<FormSlots, string>>
  preset?: string
}
