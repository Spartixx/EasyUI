import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { WithVariantProps } from '../../../types/base'
import type { ActionsConfig, ButtonVariant } from '../../internal/actions'
import type { SubmitErrorMessages } from '../../internal/submit'

export type ModalSize = 'sm' | 'md' | 'lg'
export type ModalColor = NonNullable<WithVariantProps['color']>
export type ModalVariant = ButtonVariant
export type ModalActionsConfig = ActionsConfig

export type ModalSlots =
  | 'base'
  | 'backdrop'
  | 'header'
  | 'title'
  | 'description'
  | 'closeIconButton'
  | 'body'
  | 'errorAlert'
  | 'footer'
  | 'submitButton'
  | 'cancelButton'

export interface ModalProps<TSubmitError = Error>
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'color' | 'onSubmit' | 'children'> {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title?: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  actions?: ModalActionsConfig
  onSubmit?: () => void | Promise<void>
  isClosedOnSubmit?: boolean
  isCloseIconHidden?: boolean
  closeIconButtonLabel?: string
  isClosedOnBackdropClick?: boolean
  isClosedOnEscape?: boolean
  variant?: ModalVariant
  color?: ModalColor
  isLoading?: boolean
  isDisabled?: boolean
  error?: string
  submitErrorMessages?: SubmitErrorMessages
  getSubmitErrorStatus?: (error: TSubmitError) => string | null
  onUnhandledSubmitError?: (error: TSubmitError) => void
  className?: string
  classNames?: Partial<Record<ModalSlots, string>>
  preset?: string
}
