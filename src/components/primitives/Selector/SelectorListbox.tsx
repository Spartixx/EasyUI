import type { ReactNode, Ref } from 'react'
import { cn } from '../../../utils/cn'

interface SelectorListboxProps {
  id: string
  listboxRef: Ref<HTMLUListElement>
  className?: string
  children: ReactNode
}

export function SelectorListbox({ id, listboxRef, className, children }: SelectorListboxProps) {
  return (
    <ul
      id={id}
      ref={listboxRef}
      role="listbox"
      className={cn(
        'absolute top-full inset-x-0 mt-1 z-10 max-h-60 overflow-y-auto',
        'border-solid border-(length:--easyui-border-width-sm) border-(--easyui-color-default)',
        'bg-(--easyui-color-background) shadow-md',
        className,
      )}
    >
      {children}
    </ul>
  )
}
