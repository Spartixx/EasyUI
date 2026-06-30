import { useState } from 'react'

export function useControllableValue(value: string | undefined, defaultValue: string | undefined) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const setValue = (next: string) => {
    if (value === undefined) setInternalValue(next)
  }

  return [currentValue, setValue] as const
}
