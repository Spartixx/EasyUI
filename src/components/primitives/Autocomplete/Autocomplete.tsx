import { forwardRef, useRef } from 'react'
import type { AutocompleteProps } from './Autocomplete.types'
import { AutocompleteCore } from './AutocompleteCore'
import { multipleSelectionBehavior, singleSelectionBehavior } from '../../internal/field'

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const setInputNode = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  if (props.selectionMode === 'multiple') {
    return (
      <AutocompleteCore<string[]>
        {...props}
        behavior={multipleSelectionBehavior}
        inputRef={inputRef}
        setInputNode={setInputNode}
      />
    )
  }

  return (
    <AutocompleteCore<string>
      {...props}
      behavior={singleSelectionBehavior}
      inputRef={inputRef}
      setInputNode={setInputNode}
    />
  )
})

Autocomplete.displayName = 'Autocomplete'
