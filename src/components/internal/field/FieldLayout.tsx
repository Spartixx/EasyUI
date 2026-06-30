import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

interface FieldLayoutProps {
  className?: string
  baseClassName?: string
  isFullWidth?: boolean
  label?: ReactNode
  labelHtmlFor: string
  labelClassName?: string
  isRequired?: boolean
  description?: ReactNode
  descriptionId: string
  descriptionClassName?: string
  descriptionPlacement?: 'label' | 'element'
  error?: string
  errorId: string
  errorClassName?: string
  liveRegionText?: string
  children: ReactNode
}

export function FieldLayout({
  className,
  baseClassName,
  isFullWidth,
  label,
  labelHtmlFor,
  labelClassName,
  isRequired,
  description,
  descriptionId,
  descriptionClassName,
  descriptionPlacement = 'element',
  error,
  errorId,
  errorClassName,
  liveRegionText,
  children,
}: FieldLayoutProps) {
  const descriptionElement = description && (
    <span id={descriptionId} className={cn('text-xs text-(--easyui-color-default-foreground)/60', descriptionClassName)}>
      {description}
    </span>
  )

  return (
    <div className={cn('flex flex-col gap-1', isFullWidth ? 'w-full' : 'w-80', baseClassName, className)}>
      {label && (
        <label htmlFor={labelHtmlFor} className={cn('text-sm font-medium', labelClassName)}>
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
              *
            </span>
          )}
        </label>
      )}
      {descriptionPlacement === 'label' && descriptionElement}
      {children}
      {error ? (
        <span id={errorId} role="alert" className={cn('text-xs text-(--easyui-color-error)', errorClassName)}>
          {error}
        </span>
      ) : (
        descriptionPlacement === 'element' && descriptionElement
      )}
      {liveRegionText !== undefined && (
        <span role="status" aria-live="polite" className="sr-only">
          {liveRegionText}
        </span>
      )}
    </div>
  )
}
