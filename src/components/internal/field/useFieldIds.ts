import { useId } from 'react'

export function useFieldIds(idProp: string | undefined) {
  const generatedId = useId()
  const fieldId = idProp ?? generatedId
  const labelId = `${fieldId}-label`
  const listboxId = `${fieldId}-listbox`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const optionId = (index: number) => `${listboxId}-option-${index}`

  return { fieldId, labelId, listboxId, descriptionId, errorId, optionId }
}
