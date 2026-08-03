import { cn } from '../../../utils/cn'
import { Button } from '../../primitives/Button'
import type { ActionsConfig } from './actions.types'
import type { ButtonVariant } from './resolveButtonVariant'
import type { WithVariantProps } from '../../../types/base'

interface ActionsFooterProps {
  actions?: ActionsConfig
  showSubmit: boolean
  showCancel: boolean
  submitType: 'submit' | 'button'
  onSubmitClick?: () => void
  color?: NonNullable<WithVariantProps['color']>
  buttonVariant?: ButtonVariant
  isDisabled: boolean
  isLoading: boolean
  isSubmitting: boolean
  className?: string
  submitClassName?: string
  cancelClassName?: string
}

export function ActionsFooter({
  actions,
  showSubmit,
  showCancel,
  submitType,
  onSubmitClick,
  color,
  buttonVariant,
  isDisabled,
  isLoading,
  isSubmitting,
  className,
  submitClassName,
  cancelClassName,
}: ActionsFooterProps) {
  const submitLabel =
    (isSubmitting && actions?.submittingLabel) ||
    (isLoading && actions?.loadingLabel) ||
    actions?.submitLabel ||
    'Submit'

  return (
    <div className={cn('flex justify-end gap-2', className)}>
      {showCancel && (
        <Button
          type="button"
          color={color ?? 'default'}
          variant={buttonVariant ?? 'light'}
          isDisabled={isDisabled || isLoading || isSubmitting}
          onClick={actions?.onCancel}
          className={cancelClassName}
          {...actions?.cancelProps}
        >
          {actions?.cancelLabel ?? 'Cancel'}
        </Button>
      )}
      {showSubmit && (
        <Button
          type={submitType}
          color={color ?? 'primary'}
          variant={buttonVariant ?? 'solid'}
          isLoading={isSubmitting}
          isDisabled={isDisabled || isLoading}
          onClick={onSubmitClick}
          className={submitClassName}
          {...actions?.submitProps}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  )
}
