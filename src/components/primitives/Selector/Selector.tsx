import { forwardRef, useRef } from 'react'
import type { SelectorProps } from './Selector.types'
import { SelectorCore } from './SelectorCore'
import { multipleSelectionBehavior, singleSelectionBehavior } from '../../internal/field'

export const Selector = forwardRef<HTMLButtonElement, SelectorProps>((props, ref) => {
  const triggerRef = useRef<HTMLButtonElement>(null)

  const setTriggerNode = (node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  if (props.selectionMode === 'multiple') {
    return (
      <SelectorCore<string[]>
        {...props}
        behavior={multipleSelectionBehavior}
        triggerRef={triggerRef}
        setTriggerNode={setTriggerNode}
      />
    )
  }

  return (
    <SelectorCore<string>
      {...props}
      behavior={singleSelectionBehavior}
      triggerRef={triggerRef}
      setTriggerNode={setTriggerNode}
    />
  )
})

Selector.displayName = 'Selector'
