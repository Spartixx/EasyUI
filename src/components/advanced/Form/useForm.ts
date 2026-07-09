import { useCallback, useMemo, useState } from 'react'
import { assertNever } from '../../../utils/assertNever'
import type {
  FieldConfig,
  FieldState,
  FieldValue,
  FieldValueType,
  FormFields,
  FormInstance,
  FormSubmitHandler,
  FormValues,
  UseFormOptions,
} from './Form.types'

const REQUIRED_MESSAGE = 'This field is required'

function initialValueFor(config: FieldConfig): FieldValueType {
  if (config.defaultValue !== undefined) return config.defaultValue
  switch (config.type) {
    case 'input':
    case 'selector':
    case 'autocomplete':
    case 'custom':
      return ''
    case 'number':
      return null
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
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'number') return false
  return value.trim() === ''
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

function computeErrors(fields: FormFields, values: FormValues): Record<string, string | null> {
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
      error = REQUIRED_MESSAGE
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
      if (!visibility[fieldName] && next[fieldName] !== initialValues[fieldName]) {
        next[fieldName] = initialValues[fieldName]
        changed = true
      }
    }
    if (!changed) return current
    current = next
  }
  return current
}

export function useForm<TFields extends FormFields>(
  fields: TFields,
  options: UseFormOptions = {},
): FormInstance<TFields> {
  const { validateOn = 'submit' } = options
  const [initialValues] = useState<FormValues>(() => buildInitialValues(fields))

  const [values, setValues] = useState<FormValues>(() => ({ ...initialValues }))
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const next = revalidate ? computeErrors(fields, nextValues) : { ...previousErrors, [fieldName]: null }
        for (const otherName of Object.keys(fields)) {
          if (!nextVisibility[otherName] && next[otherName]) next[otherName] = null
        }
        return next
      })
    },
    [fields, values, initialValues, validateOn, touched, markTouched],
  )

  const handleBlur = useCallback(
    (fieldName: string) => {
      if (validateOn !== 'blur') return
      markTouched([fieldName])
      setErrors(computeErrors(fields, values))
    },
    [validateOn, fields, values, markTouched],
  )

  const validate = useCallback((): boolean => {
    const nextErrors = computeErrors(fields, values)
    setErrors(nextErrors)
    markTouched(Object.keys(nextErrors))
    return isFormValid(nextErrors)
  }, [fields, values, markTouched])

  const handleSubmit = useCallback(
    async (onSubmit: FormSubmitHandler) => {
      const nextErrors = computeErrors(fields, values)
      setErrors(nextErrors)
      markTouched(Object.keys(nextErrors))
      if (!isFormValid(nextErrors)) return

      const currentVisibility = computeVisibility(fields, values)
      const payload: FormValues = {}
      for (const fieldName of Object.keys(fields)) {
        if (currentVisibility[fieldName]) payload[fieldName] = values[fieldName]
      }

      try {
        setIsSubmitting(true)
        await onSubmit(payload)
      } finally {
        setIsSubmitting(false)
      }
    },
    [fields, values, markTouched],
  )

  const reset = useCallback(() => {
    setValues({ ...initialValues })
    setErrors({})
    setTouched({})
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
    () => Object.keys(fields).some((fieldName) => values[fieldName] !== initialValues[fieldName]),
    [fields, values, initialValues],
  )
  const isValid = useMemo(() => isFormValid(computeErrors(fields, values)), [fields, values])

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
    isValid,
    isSubmitting,
    isDirty,
  }
}
