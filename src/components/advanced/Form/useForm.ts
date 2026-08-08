import { useCallback, useMemo, useState } from 'react'
import { assertNever } from '../../../utils/assertNever'
import { DEFAULT_REQUIRED_MESSAGE } from '../../internal/field'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import type {
  FieldConfig,
  FieldState,
  FieldValue,
  FieldValueType,
  FormAllValues,
  FormFields,
  FormInstance,
  FormSubmitHandler,
  FormValues,
  FormVisibleValues,
  UseFormOptions,
} from './Form.types'

function initialValueFor(config: FieldConfig): FieldValueType {
  if (config.type === 'inputs-group') {
    // Both branches are identical on purpose: without narrowing on itemsType first, initialValues
    // stays the union of both row shapes and .map() yields a mixed (string | number | null)[].
    return config.itemsType === 'number'
      ? (config.initialValues ?? []).map((entry) => entry.value)
      : (config.initialValues ?? []).map((entry) => entry.value)
  }

  if (config.defaultValue !== undefined) return config.defaultValue

  switch (config.type) {
    case 'input':
    case 'custom':
      return ''
    case 'selector':
    case 'autocomplete':
      return config.selectionMode === 'multiple' ? [] : ''
    case 'number':
      return null
    case 'checkbox':
      return false
    default:
      return assertNever(config)
  }
}

function buildInitialValues(fields: FormFields): FormValues {
  const values: FormValues = {}
  for (const fieldName of Object.keys(fields)) {
    values[fieldName] = initialValueFor(fields[fieldName])
  }
  return values
}

function isEmpty(value: FieldValueType): boolean {
  if (value === null) return true
  if (Array.isArray(value)) return value.every((entry) => isEmpty(entry))
  if (typeof value === 'number') return false
  // A required checkbox is only satisfied when it is checked, so an unchecked one counts as empty.
  if (typeof value === 'boolean') return !value
  return value.trim() === ''
}

function isSameValue(current: FieldValueType, other: FieldValueType): boolean {
  if (Array.isArray(current) && Array.isArray(other)) {
    return current.length === other.length && current.every((entry, index) => entry === other[index])
  }
  return current === other
}

function computeVisibility(fields: FormFields, values: FormValues): Record<string, boolean> {
  const cache: Record<string, boolean> = {}
  const computing = new Set<string>()

  const isVisible = (fieldName: string): boolean => {
    if (fieldName in cache) return cache[fieldName]
    if (computing.has(fieldName)) return true
    computing.add(fieldName)

    const config = fields[fieldName]
    let visible = true

    if (config?.dependsOn) {
      for (const [dependencyName, expectedValue] of Object.entries(config.dependsOn)) {
        if (!fields[dependencyName] || !isVisible(dependencyName)) {
          visible = false
          break
        }
        if (expectedValue !== null && values[dependencyName] !== expectedValue) {
          visible = false
          break
        }
      }
    }

    if (visible && config?.isHidden && config.isHidden(values)) {
      visible = false
    }

    computing.delete(fieldName)
    cache[fieldName] = visible
    return visible
  }

  const visibilityByName: Record<string, boolean> = {}
  for (const fieldName of Object.keys(fields)) visibilityByName[fieldName] = isVisible(fieldName)
  return visibilityByName
}

function requiredEntryCount(config: FieldConfig): number {
  if (config.type !== 'inputs-group') return 0
  let count = 0
  for (const entry of config.initialValues ?? []) {
    if (entry.isRequired) count += 1
  }
  return count
}

function filledEntryCount(value: FieldValueType): number {
  if (!Array.isArray(value)) return 0
  let count = 0
  for (const entry of value) {
    if (!isEmpty(entry)) count += 1
  }
  return count
}

// Empty rows are dropped from the submitted payload only; the form state stays raw, because it drives
// a controlled InputsGroup where filtering would make a freshly added row disappear.
// The casts are guarded by itemsType: TypeScript cannot correlate a discriminant on `config` with the
// type of a separate `value` argument.
function submittedValueFor(config: FieldConfig, value: FieldValueType): FieldValueType {
  if (config.type !== 'inputs-group' || !Array.isArray(value)) return value
  if (config.itemsType === 'number') {
    const entries = value as (number | null)[]
    return entries.filter((entry) => !isEmpty(entry))
  }
  const entries = value as string[]
  return entries.filter((entry) => !isEmpty(entry))
}

function computeErrors(
  fields: FormFields,
  values: FormValues,
  defaultRequiredMessage: string,
): Record<string, string | null> {
  const visibility = computeVisibility(fields, values)
  const errors: Record<string, string | null> = {}
  for (const fieldName of Object.keys(fields)) {
    if (!visibility[fieldName]) {
      errors[fieldName] = null
      continue
    }
    const config = fields[fieldName]
    const value = values[fieldName]
    let error: string | null = null
    if (config.isRequired && isEmpty(value)) {
      error = config.isRequiredMessage ?? defaultRequiredMessage
    }
    if (!error && filledEntryCount(value) < requiredEntryCount(config)) {
      error = config.isRequiredMessage ?? defaultRequiredMessage
    }
    if (!error && config.validators) {
      for (const validate of config.validators) {
        const result = validate(value as never, values)
        if (result !== null) {
          error = result
          break
        }
      }
    }
    errors[fieldName] = error
  }
  return errors
}

function isFormValid(errors: Record<string, string | null>): boolean {
  return Object.values(errors).every((error) => !error)
}

function resetHiddenFields(fields: FormFields, values: FormValues, initialValues: FormValues): FormValues {
  let current = values
  const maxPasses = Object.keys(fields).length + 1
  for (let pass = 0; pass < maxPasses; pass++) {
    const visibility = computeVisibility(fields, current)
    let changed = false
    const next = { ...current }
    for (const fieldName of Object.keys(fields)) {
      if (!visibility[fieldName] && !isSameValue(next[fieldName], initialValues[fieldName])) {
        next[fieldName] = initialValues[fieldName]
        changed = true
      }
    }
    if (!changed) break
    current = next
  }
  return current
}

export function useForm<TFields extends FormFields>(
  fields: TFields,
  options: UseFormOptions = {},
): FormInstance<TFields> {
  const { validateOn = 'submit' } = options
  const { defaults } = useEasyUIConfig()
  const defaultRequiredMessage = defaults?.requiredMessage ?? DEFAULT_REQUIRED_MESSAGE
  const [initialValues] = useState<FormValues>(() => buildInitialValues(fields))

  const [values, setValues] = useState<FormValues>(() => ({ ...initialValues }))
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetToken, setResetToken] = useState(0)

  const visibility = useMemo(() => computeVisibility(fields, values), [fields, values])

  const markTouched = useCallback((fieldNames: string[]) => {
    setTouched((previousTouched) => {
      const next = { ...previousTouched }
      for (const fieldName of fieldNames) next[fieldName] = true
      return next
    })
  }, [])

  const setValue = useCallback(
    (fieldName: string, value: FieldValueType) => {
      const nextValues = resetHiddenFields(fields, { ...values, [fieldName]: value }, initialValues)
      const nextVisibility = computeVisibility(fields, nextValues)
      setValues(nextValues)

      if (validateOn === 'change') markTouched([fieldName])

      const revalidate = validateOn === 'change' || touched[fieldName]
      setErrors((previousErrors) => {
        const next = revalidate ? computeErrors(fields, nextValues, defaultRequiredMessage) : { ...previousErrors, [fieldName]: null }
        for (const otherName of Object.keys(fields)) {
          if (!nextVisibility[otherName] && next[otherName]) next[otherName] = null
        }
        return next
      })
    },
    [fields, values, initialValues, validateOn, touched, markTouched, defaultRequiredMessage],
  )

  const handleBlur = useCallback(
    (fieldName: string) => {
      if (validateOn !== 'blur') return
      markTouched([fieldName])
      setErrors(computeErrors(fields, values, defaultRequiredMessage))
    },
    [validateOn, fields, values, markTouched, defaultRequiredMessage],
  )

  const validate = useCallback((): boolean => {
    const nextErrors = computeErrors(fields, values, defaultRequiredMessage)
    setErrors(nextErrors)
    markTouched(Object.keys(nextErrors))
    return isFormValid(nextErrors)
  }, [fields, values, markTouched, defaultRequiredMessage])

  const handleSubmit = useCallback(
    async (onSubmit: FormSubmitHandler<TFields>) => {
      const nextErrors = computeErrors(fields, values, defaultRequiredMessage)
      setErrors(nextErrors)
      markTouched(Object.keys(nextErrors))
      if (!isFormValid(nextErrors)) return false

      const currentVisibility = computeVisibility(fields, values)
      const visiblePayload: FormValues = {}
      for (const fieldName of Object.keys(fields)) {
        if (currentVisibility[fieldName]) {
          visiblePayload[fieldName] = submittedValueFor(fields[fieldName], values[fieldName])
        }
      }

      try {
        setIsSubmitting(true)
        await onSubmit(
          visiblePayload as FormVisibleValues<TFields>,
          values as FormAllValues<TFields>,
        )
      } finally {
        setIsSubmitting(false)
      }
      return true
    },
    [fields, values, markTouched, defaultRequiredMessage],
  )

  const reset = useCallback(() => {
    setValues({ ...initialValues })
    setErrors({})
    setTouched({})
    setResetToken((token) => token + 1)
  }, [initialValues])

  const fieldStates = useMemo(() => {
    const states = {} as { [FieldName in keyof TFields]: FieldState<FieldValue<TFields[FieldName]>> }
    for (const fieldName of Object.keys(fields) as Array<keyof TFields>) {
      const key = fieldName as string
      states[fieldName] = {
        value: values[key] as FieldValue<TFields[typeof fieldName]>,
        setValue: (value) => setValue(key, value),
        error: touched[key] ? (errors[key] ?? null) : null,
        isVisible: visibility[key],
        isTouched: touched[key] ?? false,
      }
    }
    return states
  }, [fields, values, errors, visibility, touched, setValue])

  const getFieldState = useCallback(
    <FieldName extends keyof TFields>(name: FieldName) => fieldStates[name],
    [fieldStates],
  )

  const isDirty = useMemo(
    () => Object.keys(fields).some((fieldName) => !isSameValue(values[fieldName], initialValues[fieldName])),
    [fields, values, initialValues],
  )
  const isValid = useMemo(
    () => isFormValid(computeErrors(fields, values, defaultRequiredMessage)),
    [fields, values, defaultRequiredMessage],
  )

  return {
    fields: fieldStates,
    values: values as { [FieldName in keyof TFields]: FieldValue<TFields[FieldName]> },
    config: fields,
    setValue: (name, value) => setValue(name as string, value),
    handleBlur: (name) => handleBlur(name as string),
    getFieldState,
    validate,
    handleSubmit,
    reset,
    resetToken,
    isValid,
    isSubmitting,
    isDirty,
  }
}
