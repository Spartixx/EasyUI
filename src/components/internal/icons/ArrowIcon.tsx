import type { ReactNode, MouseEvent } from 'react'
import { cn } from '../../../utils/cn'
import { ARROW_SIZE_CLASSES } from '../../../utils/class-maps'
import { ChevronDownIcon } from './ChevronDownIcon'

interface ArrowIconProps {
  isOpen: boolean
  size: 'sm' | 'md' | 'lg'
  colorClass: string
  className?: string
  children?: ReactNode
  cursorPointer?: boolean
  onMouseDown?: (e: MouseEvent) => void
  onClick?: () => void
}

export function ArrowIcon({ isOpen, size, colorClass, className, children, cursorPointer, onMouseDown, onClick }: ArrowIconProps) {
  return (
    <span
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={cn(
        'shrink-0 flex items-center transition-transform duration-150',
        cursorPointer && 'cursor-pointer',
        isOpen && 'rotate-180',
        colorClass,
        className,
      )}
    >
      {children ?? <ChevronDownIcon className={ARROW_SIZE_CLASSES[size]} />}
    </span>
  )
}
