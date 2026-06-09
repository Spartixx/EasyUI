import type { EasyUIBaseProps, WithVariantProps } from '../types/base'

export const SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export const RADIUS_CLASSES: Record<NonNullable<WithVariantProps['radius']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-(--easyui-radius-sm)',
  md: 'rounded-(--easyui-radius-md)',
  lg: 'rounded-(--easyui-radius-lg)',
  full: 'rounded-full',
}
