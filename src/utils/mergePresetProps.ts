import { isValidElement } from 'react'

type UnknownRecord = Record<string, unknown>

function isPlainObject(value: unknown): value is UnknownRecord {
  if (typeof value !== 'object' || value === null) return false
  // React elements are literal objects too, so the prototype check alone would deep-merge two icons into a hybrid.
  if (Array.isArray(value) || isValidElement(value)) return false
  const prototype: unknown = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function mergeValues(presetValue: unknown, value: unknown): unknown {
  if (value === undefined) return presetValue
  if (isPlainObject(presetValue) && isPlainObject(value)) return mergeRecords(presetValue, value)
  return value
}

function mergeRecords(presetRecord: UnknownRecord, record: UnknownRecord): UnknownRecord {
  const merged: UnknownRecord = { ...record }

  for (const key of Object.keys(presetRecord)) {
    merged[key] = mergeValues(presetRecord[key], record[key])
  }

  return merged
}

// Values stay unchecked on purpose: a preset declares partial nested objects (a `formProps` without its required
// `onSubmit`, for instance), which `Partial<TProps>` would reject. Their shape is enforced where they are declared,
// in `EasyUIPresetsConfig`.
export type PresetPropsOf<TProps> = { [Key in keyof TProps]?: unknown }

export function mergePresetProps<TProps extends object>(
  presetProps: PresetPropsOf<NoInfer<TProps>> | undefined,
  props: TProps,
): TProps {
  if (!presetProps) return props

  return mergeRecords(presetProps as UnknownRecord, props as UnknownRecord) as TProps
}
