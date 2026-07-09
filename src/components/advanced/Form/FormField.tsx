import { assertNever } from '../../../utils/assertNever'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type { FieldConfig, FormColor, FormFields, FormInstance, FormSlots, FormVariant } from './Form.types'
import { fieldRegistry } from './fields/registry'

interface FormFieldProps<TFields extends FormFields> {
  form: FormInstance<TFields>
  fieldName: keyof TFields & string
  isFormDisabled: boolean
  isFormLoading: boolean
  formVariant?: FormVariant
  formColor?: FormColor
  slotClassName: (slot: FormSlots) => string
}

const FIELD_VARIANTS: FormFieldVariant[] = ['bordered', 'faded', 'flat', 'underlined']

function resolveFieldVariant(formVariant: FormVariant | undefined): FormFieldVariant | undefined {
  return formVariant && (FIELD_VARIANTS as string[]).includes(formVariant)
    ? (formVariant as FormFieldVariant)
    : undefined
}

export function FormField<TFields extends FormFields>({
  form,
  fieldName,
  isFormDisabled,
  isFormLoading,
  formVariant,
  formColor,
  slotClassName,
}: FormFieldProps<TFields>) {
  const config: FieldConfig = form.config[fieldName]
  const fieldState = form.fields[fieldName]
  const onBlur = () => form.handleBlur(fieldName)

  const common = {
    name: fieldName,
    onBlur,
    error: fieldState.error,
    isDisabled: isFormDisabled || !!config.isDisabled,
    isLoading: isFormLoading,
    variant: resolveFieldVariant(formVariant),
    color: formColor,
  }
  const stringValue = fieldState.value as string
  const setStringValue = fieldState.setValue as (value: string) => void

  switch (config.type) {
    case 'input':
      return <>{fieldRegistry.input({ ...common, config, value: stringValue, setValue: setStringValue, slotClassName: slotClassName('inputField') })}</>
    case 'selector':
      return <>{fieldRegistry.selector({ ...common, config, value: stringValue, setValue: setStringValue, slotClassName: slotClassName('selectorField') })}</>
    case 'autocomplete':
      return <>{fieldRegistry.autocomplete({ ...common, config, value: stringValue, setValue: setStringValue, slotClassName: slotClassName('autocompleteField') })}</>
    case 'number':
      return (
        <>
          {fieldRegistry.number({
            ...common,
            config,
            value: fieldState.value as number | null,
            setValue: fieldState.setValue as (value: number | null) => void,
            slotClassName: slotClassName('numberField'),
          })}
        </>
      )
    case 'custom':
      return (
        <>
          {config.render({
            name: fieldName,
            value: stringValue,
            setValue: setStringValue,
            onBlur,
            error: fieldState.error,
            isDisabled: isFormDisabled || isFormLoading || !!config.isDisabled,
          })}
        </>
      )
    default:
      return assertNever(config)
  }
}
