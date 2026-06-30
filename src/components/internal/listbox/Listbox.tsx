import type { ReactNode, Ref } from 'react'
import { cn } from '../../../utils/cn'

interface ListboxProps {
  id: string
  listboxRef: Ref<HTMLUListElement>
  className?: string
  isEmpty?: boolean
  noResultsMessage?: string
  children: ReactNode
}

export function Listbox({ id, listboxRef, className, isEmpty = false, noResultsMessage = 'No results found', children }: ListboxProps) {
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
      {isEmpty ? (
        <li className="px-3 py-2 text-sm text-(--easyui-color-default-foreground)/60">{noResultsMessage}</li>
      ) : (
        children
      )}
    </ul>
  )
}
