import type { ReactNode } from 'react'
import { Input, Selector, Autocomplete } from '../../../primitives'
import type { FormFieldVariant } from '../../../../utils/class-maps'
import type {
  FieldConfig,
  FieldValueType,
  FormColor,
  InputFieldConfig,
  SelectorFieldConfig,
  AutocompleteFieldConfig,
  NumberFieldConfig,
} from '../Form.types'

export interface BuiltinFieldRenderContext<
  TValue extends FieldValueType = FieldValueType,
  TConfig extends FieldConfig = FieldConfig,
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
      {...config.props}
    />
  )
}

export interface BuiltinFieldRegistry {
  input: (ctx: BuiltinFieldRenderContext<string, InputFieldConfig>) => ReactNode
  selector: (ctx: BuiltinFieldRenderContext<string, SelectorFieldConfig>) => ReactNode
  autocomplete: (ctx: BuiltinFieldRenderContext<string, AutocompleteFieldConfig>) => ReactNode
  number: (ctx: BuiltinFieldRenderContext<number | null, NumberFieldConfig>) => ReactNode
}

export const fieldRegistry: BuiltinFieldRegistry = {
  input: (ctx) => renderInputField(ctx, ctx.config.kind ?? 'text'),
  selector: (ctx) => (
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
      {...ctx.config.props}
    />
  ),
  autocomplete: (ctx) => (
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
      {...ctx.config.props}
    />
  ),
  number: (ctx) =>
    renderInputField(
      {
        ...ctx,
        value: ctx.value === null ? '' : String(ctx.value),
        setValue: (raw) => {
          const trimmed = raw.trim()
          const next = trimmed === '' ? null : Number(trimmed)
          ctx.setValue(next !== null && Number.isNaN(next) ? null : next)
        },
      },
      'number',
    ),
}
