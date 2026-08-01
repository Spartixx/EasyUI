export interface SelectionBehavior<TValue> {
  emptyValue: TValue
  toSelectedValues: (value: TValue | undefined) => string[]
  fromSelectedValues: (selectedValues: string[]) => TValue
  computeNextValues: (selectedValues: string[], optionValue: string) => string[]
}

export const singleSelectionBehavior: SelectionBehavior<string> = {
  emptyValue: '',
  toSelectedValues: (value) => (value ? [value] : []),
  fromSelectedValues: (selectedValues) => selectedValues[selectedValues.length - 1] ?? '',
  computeNextValues: (_selectedValues, optionValue) => [optionValue],
}

export const multipleSelectionBehavior: SelectionBehavior<string[]> = {
  emptyValue: [],
  toSelectedValues: (value) => value ?? [],
  fromSelectedValues: (selectedValues) => selectedValues,
  computeNextValues: (selectedValues, optionValue) =>
    selectedValues.includes(optionValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue],
}
