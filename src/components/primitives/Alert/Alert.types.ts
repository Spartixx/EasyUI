import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { EasyUIBaseProps, WithVariantProps } from '../../../types/base'

export type AlertVariant = 'solid' | 'outlined' | 'flat' | 'faded'

export type AlertSlots =
  | 'base'
  | 'iconWrapper'
  | 'icon'
  | 'title'
  | 'description'
  | 'endContent'
  | 'closeButton'

export interface AlertProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'color' | 'title' | 'children'>,
    Omit<EasyUIBaseProps<AlertSlots>, 'isDisabled' | 'isLoading' | 'isFullWidth'>,
    Omit<WithVariantProps, 'variant'> {
  variant?: AlertVariant
  title: string
  description?: ReactNode
  isClosable?: boolean
  onClose?: () => void
  icon?: ReactNode
  closeIcon?: ReactNode
  closeButtonLabel?: string
  isIconHidden?: boolean
  isIconWrapperHidden?: boolean
  endContent?: ReactNode
}
