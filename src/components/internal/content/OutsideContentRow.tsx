import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import { ContentSlot } from './ContentSlot'
import { hasOutsideContent } from './hasOutsideContent'

interface OutsideContentRowProps {
  startContent?: ReactNode
  startContentPlacement?: 'inside' | 'outside'
  startClassName?: string
  endContent?: ReactNode
  endContentPlacement?: 'inside' | 'outside'
  endClassName?: string
  isFullWidth?: boolean
  children: ReactNode
}

export function OutsideContentRow({
  startContent,
  startContentPlacement,
  startClassName,
  endContent,
  endContentPlacement,
  endClassName,
  isFullWidth,
  children,
}: OutsideContentRowProps) {
  if (!hasOutsideContent({ startContent, startContentPlacement, endContent, endContentPlacement })) {
    return children
  }

  return (
    <span className={cn('flex items-center gap-2', isFullWidth && 'w-full')}>
      <ContentSlot content={startContent} placement={startContentPlacement} show="outside" className={startClassName} />
      {children}
      <ContentSlot content={endContent} placement={endContentPlacement} show="outside" className={endClassName} />
    </span>
  )
}
