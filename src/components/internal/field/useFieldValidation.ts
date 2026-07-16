import { useState } from 'react'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'

export const DEFAULT_REQUIRED_MESSAGE = 'This field is required'

interface UseFieldValidationOptions<TValue> {
  isRequired: boolean
  isRequiredMessage?: string
  isFormControlled: boolean
  isEmpty: (value: TValue) => boolean
  validations?: Array<(value: TValue) => string | null>
}

interface FieldValidationResult<TValue> {
  error: string | null
  validate: (value: TValue) => boolean
  revalidate: (value: TValue) => void
}

export function useFieldValidation<TValue>(
  options: UseFieldValidationOptions<TValue>,
): FieldValidationResult<TValue> {
  const { isRequired, isRequiredMessage, isFormControlled, isEmpty, validations } = options
  const { defaults } = useEasyUIConfig()
  const [error, setError] = useState<string | null>(null)

  const resolveRequiredMessage = () =>
    isRequiredMessage ?? defaults?.requiredMessage ?? DEFAULT_REQUIRED_MESSAGE

  const validate = (value: TValue): boolean => {
    if (isFormControlled) return true
    if (isRequired && isEmpty(value)) {
      setError(resolveRequiredMessage())
      return false
    }
    if (validations) {
      for (const validation of validations) {
        const result = validation(value)
        if (result !== null) {
          setError(result)
          return false
        }
      }
    }
    setError(null)
    return true
  }

  const revalidate = (value: TValue) => {
    if (error !== null) validate(value)
  }

  return { error, validate, revalidate }
}
