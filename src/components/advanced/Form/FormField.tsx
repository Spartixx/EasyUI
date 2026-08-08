import { assertNever } from '../../../utils/assertNever'
import { mergePresetProps } from '../../../utils/mergePresetProps'
import type { PresetPropsOf } from '../../../utils/mergePresetProps'
import type { FormFieldVariant } from '../../../utils/class-maps'
import type {
  FieldConfig,
  FormColor,
  FormFieldPropsByType,
  FormFields,
  FormInstance,
  FormSlots,
  FormVariant,
} from './Form.types'
import { fieldRegistry } from './fields/registry'

interface FormFieldProps<TFields extends FormFields> {
  form: FormInstance<TFields>
  fieldName: keyof TFields & string
  isFormDisabled: boolean
  isFormLoading: boolean
  formVariant?: FormVariant
  formColor?: FormColor
  fieldProps?: FormFieldPropsByType
  slotClassName: (slot: FormSlots) => string
}

function resolveFieldProps<TProps extends object>(
  inherited: PresetPropsOf<NoInfer<TProps>> | undefined,
  ownProps: TProps | undefined,
): TProps {
  const hasOwnPreset = Boolean((ownProps as { preset?: string } | undefined)?.preset)
  return mergePresetProps(hasOwnPreset ? undefined : inherited, ownProps ?? ({} as TProps))
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
  fieldProps,
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
      return <>{fieldRegistry.input({ ...common, config, props: resolveFieldProps(fieldProps?.input, config.props), value: stringValue, setValue: setStringValue, slotClassName: slotClassName('inputField') })}</>
    case 'selector':
      return config.selectionMode === 'multiple' ? (
        <>
          {fieldRegistry.selectorMultiple({
            ...common,
            config,
            props: resolveFieldProps(fieldProps?.selector, config.props),
            value: fieldState.value as string[],
            setValue: fieldState.setValue as (value: string[]) => void,
            slotClassName: slotClassName('selectorField'),
          })}
        </>
      ) : (
        <>{fieldRegistry.selectorSingle({ ...common, config, props: resolveFieldProps(fieldProps?.selector, config.props), value: stringValue, setValue: setStringValue, slotClassName: slotClassName('selectorField') })}</>
      )
    case 'autocomplete':
      return config.selectionMode === 'multiple' ? (
        <>
          {fieldRegistry.autocompleteMultiple({
            ...common,
            config,
            props: resolveFieldProps(fieldProps?.autocomplete, config.props),
            value: fieldState.value as string[],
            setValue: fieldState.setValue as (value: string[]) => void,
            slotClassName: slotClassName('autocompleteField'),
          })}
        </>
      ) : (
        <>{fieldRegistry.autocompleteSingle({ ...common, config, props: resolveFieldProps(fieldProps?.autocomplete, config.props), value: stringValue, setValue: setStringValue, slotClassName: slotClassName('autocompleteField') })}</>
      )
    case 'inputs-group':
      return config.itemsType === 'number' ? (
        <>
          {fieldRegistry.inputsGroupNumber({
            ...common,
            config,
            props: resolveFieldProps(fieldProps?.inputsGroup, config.props),
            value: fieldState.value as (number | null)[],
            setValue: fieldState.setValue as (value: (number | null)[]) => void,
            slotClassName: slotClassName('inputsGroupField'),
          })}
        </>
      ) : (
        <>
          {fieldRegistry.inputsGroupText({
            ...common,
            config,
            props: resolveFieldProps(fieldProps?.inputsGroup, config.props),
            value: fieldState.value as string[],
            setValue: fieldState.setValue as (value: string[]) => void,
            slotClassName: slotClassName('inputsGroupField'),
          })}
        </>
      )
    case 'number':
      return (
        <>
          {fieldRegistry.number({
            ...common,
            config,
            props: resolveFieldProps(fieldProps?.number, config.props),
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
