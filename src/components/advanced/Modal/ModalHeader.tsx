import { cn } from '../../../utils/cn'
import { CloseIcon } from '../../internal/icons'

interface ModalHeaderProps {
  title?: string
  titleId: string
  description?: string
  descriptionId: string
  isCloseIconHidden: boolean
  closeIconButtonLabel: string
  onClose: () => void
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  closeIconButtonClassName?: string
}

export function ModalHeader({
  title,
  titleId,
  description,
  descriptionId,
  isCloseIconHidden,
  closeIconButtonLabel,
  onClose,
  className,
  titleClassName,
  descriptionClassName,
  closeIconButtonClassName,
}: ModalHeaderProps) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <div className="flex flex-col gap-1 flex-1">
        {title && (
          <h2
            id={titleId}
            className={cn('text-lg font-semibold text-(--easyui-color-foreground)', titleClassName)}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id={descriptionId}
            className={cn('text-sm text-(--easyui-color-foreground)/60', descriptionClassName)}
          >
            {description}
          </p>
        )}
      </div>
      {!isCloseIconHidden && (
        <button
          type="button"
          aria-label={closeIconButtonLabel}
          onClick={onClose}
          className={cn(
            'shrink-0 flex items-center justify-center cursor-pointer',
            'opacity-70 hover:opacity-100 transition-opacity duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--easyui-color-focus-ring)',
            closeIconButtonClassName,
          )}
        >
          <CloseIcon className="size-4 text-(--easyui-color-foreground)" />
        </button>
      )}
    </div>
  )
}
