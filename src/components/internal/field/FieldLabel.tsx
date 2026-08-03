import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

export type FieldLabelAssociation = { htmlFor: string } | { id: string }

interface FieldLabelProps {
  association: FieldLabelAssociation
  isRequired?: boolean
  className?: string
  children: ReactNode
}

export function FieldLabel({ association, isRequired, className, children }: FieldLabelProps) {
  const labelClassName = cn('text-sm font-medium', className)
  const labelContent = (
    <>
      {children}
      {isRequired && (
        <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
          *
        </span>
      )}
    </>
  )

  if ('htmlFor' in association) {
    return (
      <label htmlFor={association.htmlFor} className={labelClassName}>
        {labelContent}
      </label>
    )
  }

  return (
    <span id={association.id} className={labelClassName}>
      {labelContent}
    </span>
  )
}
