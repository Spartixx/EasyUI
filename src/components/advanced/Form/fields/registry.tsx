import type { ReactNode } from 'react'
import { Input, Selector, Autocomplete, Checkbox } from '../../../primitives'
import { InputsGroup } from '../../InputsGroup'
import type { FormFieldVariant } from '../../../../utils/class-maps'
import type {
  BuiltinFieldConfig,
  FieldValueType,
  FormColor,
  InputFieldConfig,
  SelectorSingleFieldConfig,
  SelectorMultipleFieldConfig,
  AutocompleteSingleFieldConfig,
  AutocompleteMultipleFieldConfig,
  NumberFieldConfig,
  InputsGroupTextFieldConfig,
  InputsGroupNumberFieldConfig,
  CheckboxFieldConfig,
} from '../Form.types'

export interface BuiltinFieldRenderContext<
  TValue extends FieldValueType = FieldValueType,
  TConfig extends BuiltinFieldConfig = BuiltinFieldConfig,
> {
  name: string
  value: TValue
  setValue: (value: TValue) => void
  onBlur: () => void
  error: string | null
  isDisabled: boolean
  isLoading: boolean
  variant?: FormFieldVariant
  color?: FormColor
  slotClassName: string
  config: TConfig
  props: NonNullable<TConfig['props']>
}

function renderInputField<TConfig extends InputFieldConfig | NumberFieldConfig>(
  ctx: BuiltinFieldRenderContext<string, TConfig>,
  type: string,
): ReactNode {
  const { config } = ctx
  return (
    <Input
      name={ctx.name}
      type={type}
      label={config.label}
      description={config.description}
      isRequired={config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled}
      isLoading={ctx.isLoading}
      isFullWidth
      variant={ctx.variant}
      color={ctx.color}
      value={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  )
}

export interface BuiltinFieldRegistry {
  input: (ctx: BuiltinFieldRenderContext<string, InputFieldConfig>) => ReactNode
  selectorSingle: (ctx: BuiltinFieldRenderContext<string, SelectorSingleFieldConfig>) => ReactNode
  selectorMultiple: (ctx: BuiltinFieldRenderContext<string[], SelectorMultipleFieldConfig>) => ReactNode
  autocompleteSingle: (ctx: BuiltinFieldRenderContext<string, AutocompleteSingleFieldConfig>) => ReactNode
  autocompleteMultiple: (
    ctx: BuiltinFieldRenderContext<string[], AutocompleteMultipleFieldConfig>,
  ) => ReactNode
  number: (ctx: BuiltinFieldRenderContext<number | null, NumberFieldConfig>) => ReactNode
  inputsGroupText: (ctx: BuiltinFieldRenderContext<string[], InputsGroupTextFieldConfig>) => ReactNode
  inputsGroupNumber: (
    ctx: BuiltinFieldRenderContext<(number | null)[], InputsGroupNumberFieldConfig>,
  ) => ReactNode
  checkbox: (ctx: BuiltinFieldRenderContext<boolean, CheckboxFieldConfig>) => ReactNode
}

export const fieldRegistry: BuiltinFieldRegistry = {
  input: (ctx) => renderInputField(ctx, ctx.config.kind ?? 'text'),
  selectorSingle: (ctx) => (
    <Selector
      name={ctx.name}
      options={ctx.config.options}
      label={ctx.config.label}
      description={ctx.config.description}
      isRequired={ctx.config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled}
      isLoading={ctx.isLoading}
      isFullWidth
      variant={ctx.variant}
      color={ctx.color}
      value={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  selectorMultiple: (ctx) => (
    <Selector
      name={ctx.name}
      selectionMode="multiple"
      options={ctx.config.options}
      label={ctx.config.label}
      description={ctx.config.description}
      isRequired={ctx.config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled}
      isLoading={ctx.isLoading}
      isFullWidth
      variant={ctx.variant}
      color={ctx.color}
      value={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  autocompleteSingle: (ctx) => (
    <Autocomplete
      name={ctx.name}
      options={ctx.config.options}
      label={ctx.config.label}
      description={ctx.config.description}
      isRequired={ctx.config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled}
      isLoading={ctx.isLoading}
      isFullWidth
      variant={ctx.variant}
      color={ctx.color}
      value={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  autocompleteMultiple: (ctx) => (
    <Autocomplete
      name={ctx.name}
      selectionMode="multiple"
      options={ctx.config.options}
      label={ctx.config.label}
      description={ctx.config.description}
      isRequired={ctx.config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled}
      isLoading={ctx.isLoading}
      isFullWidth
      variant={ctx.variant}
      color={ctx.color}
      value={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  inputsGroupText: (ctx) => (
    <InputsGroup
      label={ctx.config.label}
      description={ctx.config.description}
      isDisabled={ctx.isDisabled || ctx.isLoading}
      isFullWidth
      initialValues={ctx.config.initialValues}
      values={ctx.value}
      onValuesChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  inputsGroupNumber: (ctx) => (
    <InputsGroup
      type="number"
      label={ctx.config.label}
      description={ctx.config.description}
      isDisabled={ctx.isDisabled || ctx.isLoading}
      isFullWidth
      initialValues={ctx.config.initialValues}
      values={ctx.value}
      onValuesChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  checkbox: (ctx) => (
    <Checkbox
      name={ctx.name}
      label={ctx.config.label}
      description={ctx.config.description}
      isRequired={ctx.config.isRequired}
      isFormControlled
      isDisabled={ctx.isDisabled || ctx.isLoading}
      isFullWidth
      color={ctx.color}
      isSelected={ctx.value}
      onBlur={ctx.onBlur}
      onValueChange={ctx.setValue}
      error={ctx.error ?? undefined}
      className={ctx.slotClassName}
      {...ctx.props}
    />
  ),
  number: (ctx) =>
    renderInputField(
      {
        ...ctx,
        value: ctx.value === null ? '' : String(ctx.value),
        setValue: (raw) => {
          const trimmed = raw.trim()
          ctx.setValue(trimmed === '' ? null : Number(trimmed))
        },
      },
      'number',
    ),
}
