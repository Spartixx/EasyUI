import { useState } from 'react'

export function useControllableValue<T>(value: T | undefined, defaultValue: T | undefined) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const setValue = (next: T) => {
    if (value === undefined) setInternalValue(next)
  }

  return [currentValue, setValue] as const
}
