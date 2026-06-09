import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

interface ButtonContentProps {
  className?: string
  children: ReactNode
}

export function ButtonContent({ className, children }: ButtonContentProps) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      {children}
    </span>
  )
}
