import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type {
  InputProps,
  SelectorSingleProps,
  SelectorMultipleProps,
  SelectorOption,
  AutocompleteSingleProps,
  AutocompleteMultipleProps,
  AutocompleteOption,
  ButtonProps,
} from '../../primitives'
import type {
  InputsGroupTextProps,
  InputsGroupNumberProps,
  InputsGroupTextInitialValue,
  InputsGroupNumberInitialValue,
} from '../InputsGroup'

export type ButtonVariant = NonNullable<WithVariantProps['variant']>
export type FormVariant = FormFieldVariant | ButtonVariant
export type FormColor = NonNullable<WithVariantProps['color']>

export type FormSlots =
  | 'base'
  | 'header'
  | 'title'
  | 'description'
  | 'errorAlert'
  | 'fieldsWrapper'
  | 'inputField'
  | 'selectorField'
  | 'autocompleteField'
  | 'numberField'
  | 'inputsGroupField'
  | 'actions'
  | 'submitButton'
  | 'cancelButton'

export type FieldType = 'input' | 'selector' | 'autocomplete' | 'number' | 'inputs-group' | 'custom'

export type InputKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'password'
  | 'url'
  | 'search'
  | (string & {})

export type FieldValueType = string | string[] | number | (number | null)[] | null
export type FormValues = Record<string, FieldValueType>
export type FieldValidator<TValue extends FieldValueType> = (value: TValue, values: FormValues) => string | null

interface BaseFieldConfig<TValue extends FieldValueType = string> {
  label?: string
  description?: string
  defaultValue?: TValue
  isRequired?: boolean
  isRequiredMessage?: string
  isDisabled?: boolean
  validators?: Array<FieldValidator<TValue>>
  dependsOn?: Record<string, string | null>
  isHidden?: (values: FormValues) => boolean
}

type InputFieldProps = Omit<
  InputProps,
  'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'error' | 'label' | 'description' | 'isRequired' | 'isRequiredMessage' | 'isFormControlled' | 'isDisabled' | 'validations' | 'name' | 'type' | 'className'
>
type SelectionFieldOmittedProps =
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'selectionMode'
  | 'error'
  | 'label'
  | 'description'
  | 'isRequired'
  | 'isRequiredMessage'
  | 'isFormControlled'
  | 'isDisabled'
  | 'options'
  | 'validations'
  | 'name'
  | 'className'

type SelectorSingleFieldProps = Omit<SelectorSingleProps, SelectionFieldOmittedProps>
type SelectorMultipleFieldProps = Omit<SelectorMultipleProps, SelectionFieldOmittedProps>
type AutocompleteSingleFieldProps = Omit<AutocompleteSingleProps, SelectionFieldOmittedProps>
type AutocompleteMultipleFieldProps = Omit<AutocompleteMultipleProps, SelectionFieldOmittedProps>

type InputsGroupFieldOmittedProps =
  | 'type'
  | 'initialValues'
  | 'values'
  | 'onValuesChange'
  | 'label'
  | 'description'
  | 'error'
  | 'isDisabled'
  | 'isRequiredMessage'
  | 'className'

type InputsGroupTextFieldProps = Omit<InputsGroupTextProps, InputsGroupFieldOmittedProps>
type InputsGroupNumberFieldProps = Omit<InputsGroupNumberProps, InputsGroupFieldOmittedProps>

export interface InputFieldConfig extends BaseFieldConfig<string> {
  type: 'input'
  kind?: InputKind
  props?: InputFieldProps
}

export interface SelectorSingleFieldConfig extends BaseFieldConfig<string> {
  type: 'selector'
  selectionMode?: 'single'
  options: SelectorOption[]
  props?: SelectorSingleFieldProps
}

export interface SelectorMultipleFieldConfig extends BaseFieldConfig<string[]> {
  type: 'selector'
  selectionMode: 'multiple'
  options: SelectorOption[]
  props?: SelectorMultipleFieldProps
}

export type SelectorFieldConfig = SelectorSingleFieldConfig | SelectorMultipleFieldConfig

export interface AutocompleteSingleFieldConfig extends BaseFieldConfig<string> {
  type: 'autocomplete'
  selectionMode?: 'single'
  options: AutocompleteOption[]
  props?: AutocompleteSingleFieldProps
}

export interface AutocompleteMultipleFieldConfig extends BaseFieldConfig<string[]> {
  type: 'autocomplete'
  selectionMode: 'multiple'
  options: AutocompleteOption[]
  props?: AutocompleteMultipleFieldProps
}

export type AutocompleteFieldConfig = AutocompleteSingleFieldConfig | AutocompleteMultipleFieldConfig

export interface InputsGroupTextFieldConfig extends Omit<BaseFieldConfig<string[]>, 'defaultValue'> {
  type: 'inputs-group'
  itemsType?: 'text'
  initialValues?: InputsGroupTextInitialValue[]
  props?: InputsGroupTextFieldProps
}

export interface InputsGroupNumberFieldConfig
  extends Omit<BaseFieldConfig<(number | null)[]>, 'defaultValue'> {
  type: 'inputs-group'
  itemsType: 'number'
  initialValues?: InputsGroupNumberInitialValue[]
  props?: InputsGroupNumberFieldProps
}

export type InputsGroupFieldConfig = InputsGroupTextFieldConfig | InputsGroupNumberFieldConfig

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
  | InputsGroupFieldConfig
  | CustomFieldConfig
export type FormFields = Record<string, FieldConfig>

export type FieldValue<TConfig extends FieldConfig> =
  TConfig extends { type: 'number' }
    ? number | null
    : TConfig extends { type: 'selector' | 'autocomplete'; selectionMode: 'multiple' }
      ? string[]
      : TConfig extends { type: 'inputs-group'; itemsType: 'number' }
        ? (number | null)[]
        : TConfig extends { type: 'inputs-group' }
          ? string[]
          : TConfig extends { type: 'input' | 'selector' | 'autocomplete' | 'custom' }
            ? string
            : FieldValueType

type IsConditionalField<TConfig extends FieldConfig> =
  TConfig extends { dependsOn: Record<string, string | null> }
    ? true
    : TConfig extends { isHidden: (values: FormValues) => boolean }
      ? true
      : false

type SubmittedFieldValue<TConfig extends FieldConfig> =
  TConfig extends { type: 'number'; isRequired: true }
    ? number
    : TConfig extends { type: 'inputs-group'; itemsType: 'number' }
      ? number[]
      : FieldValue<TConfig>

export type FormAllValues<TFields extends FormFields = FormFields> = {
  [FieldName in keyof TFields]: FieldValue<TFields[FieldName]>
}

export type FormVisibleValues<TFields extends FormFields = FormFields> = {
  [FieldName in keyof TFields as IsConditionalField<TFields[FieldName]> extends true
    ? never
    : FieldName]: SubmittedFieldValue<TFields[FieldName]>
} & {
  [FieldName in keyof TFields as IsConditionalField<TFields[FieldName]> extends true
    ? FieldName
    : never]?: SubmittedFieldValue<TFields[FieldName]>
}

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
  handleSubmit: (onSubmit: FormSubmitHandler<TFields>) => void | Promise<void>
  reset: () => void
  resetToken: number
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

export type FormSubmitHandler<TFields extends FormFields = FormFields> = (
  values: FormVisibleValues<TFields>,
  allValues: FormAllValues<TFields>,
) => void | Promise<void>

export interface FormActionsConfig {
  submitLabel?: string
  loadingLabel?: string
  submittingLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  showCancel?: boolean
  isSubmitButtonHidden?: boolean
  submitProps?: Partial<ButtonProps>
  cancelProps?: Partial<ButtonProps>
}

export type SubmitErrorMessages = Record<string | number, string>

export interface FormProps<TFields extends FormFields = FormFields, TSubmitError = Error>
  extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'children'> {
  form: FormInstance<TFields>
  onSubmit: FormSubmitHandler<TFields>
  error?: string
  submitErrorMessages?: SubmitErrorMessages
  getSubmitErrorStatus?: (error: TSubmitError) => string | null
  onUnhandledSubmitError?: (error: TSubmitError) => void
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
