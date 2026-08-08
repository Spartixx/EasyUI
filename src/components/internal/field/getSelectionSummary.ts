export function getSelectionSummary(isMultiple: boolean, selectedValues: string[], selectedLabel?: string) {
  if (selectedValues.length === 0) return null
  if (isMultiple) return `${selectedValues.length} selected`
  return `Selected: ${selectedLabel ?? selectedValues[0]}`
}
