import type { ComponentPropsWithoutRef } from 'react'
import type { EasyUIBaseProps, WithContentProps, WithLabelProps, WithVariantProps } from '../../../types/base'

export type ButtonSlots = 'base' | 'startContent' | 'endContent' | 'text' | 'spinner' | 'label' | 'description'

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color' | 'disabled'>,
    EasyUIBaseProps<ButtonSlots>,
    WithContentProps,
    WithVariantProps,
    WithLabelProps {
}
