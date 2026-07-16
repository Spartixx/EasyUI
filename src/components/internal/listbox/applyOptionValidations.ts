import type { ListboxOption } from './Listbox.types'

export function getOptionValidationError<TOption extends ListboxOption>(
  option: TOption,
  validations?: Array<(option: TOption) => string | null>,
): string | null {
  if (!validations?.length) return null
  for (const validate of validations) {
    const result = validate(option)
    if (result !== null) return result
  }
  return null
}

export function applyOptionValidations<TOption extends ListboxOption>(
  options: TOption[],
  validations?: Array<(option: TOption) => string | null>,
): TOption[] {
  if (!validations?.length) return options
  return options.map((option) => {
    const error = getOptionValidationError(option, validations)
    return error !== null ? { ...option, isDisabled: true, description: error } : option
  })
}
