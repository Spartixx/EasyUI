import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

interface ContentSlotProps {
  content?: ReactNode
  placement?: 'inside' | 'outside'
  show: 'inside' | 'outside'
  className?: string
}

export function ContentSlot({ content, placement, show, className }: ContentSlotProps) {
  if (!content || placement !== show) return null
  return <span className={cn('shrink-0 flex items-center', className)}>{content}</span>
}
