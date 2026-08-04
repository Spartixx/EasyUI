import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import { FOCUS_OUTLINE_CLASSES } from '../../../utils/class-maps'
import { CloseIcon } from '../../internal/icons'

interface AlertCloseButtonProps {
  label: string
  icon?: ReactNode
  iconClassName: string
  className?: string
  onClose: () => void
}

export function AlertCloseButton({ label, icon, iconClassName, className, onClose }: AlertCloseButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClose}
      className={cn(
        'shrink-0 flex items-center justify-center cursor-pointer',
        'opacity-70 hover:opacity-100 transition-opacity duration-150',
        FOCUS_OUTLINE_CLASSES,
        className,
      )}
    >
      {icon ?? <CloseIcon className={iconClassName} />}
    </button>
  )
}
