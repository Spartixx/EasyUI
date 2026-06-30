import { useId } from 'react'

export function useFieldIds(idProp: string | undefined) {
  const generatedId = useId()
  const fieldId = idProp ?? generatedId
  const listboxId = `${fieldId}-listbox`
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const optionId = (index: number) => `${listboxId}-option-${index}`

  return { fieldId, listboxId, descriptionId, errorId, optionId }
}
