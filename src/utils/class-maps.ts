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

export const FOCUS_OUTLINE_CLASSES =
  'focus-visible:outline-(length:--easyui-outline-width) focus-visible:outline-offset-(--easyui-outline-offset) focus-visible:outline-(--easyui-color-focus-ring)'

export const FOCUS_WITHIN_OUTLINE_CLASSES =
  'focus-within:outline-(length:--easyui-outline-width) focus-within:outline-offset-(--easyui-outline-offset) focus-within:outline-(--easyui-color-focus-ring)'

export const ARROW_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-6',
}

export const SURFACE_VARIANT_COLOR_CLASSES: Record<
  NonNullable<WithVariantProps['variant']>,
  Record<NonNullable<WithVariantProps['color']>, string>
> = {
  solid: {
    default: 'bg-(--easyui-color-default) text-(--easyui-color-default-foreground)',
    primary: 'bg-(--easyui-color-primary) text-(--easyui-color-primary-foreground)',
    secondary: 'bg-(--easyui-color-secondary) text-(--easyui-color-secondary-foreground)',
    success: 'bg-(--easyui-color-success) text-(--easyui-color-success-foreground)',
    warning: 'bg-(--easyui-color-warning) text-(--easyui-color-warning-foreground)',
    error: 'bg-(--easyui-color-error) text-(--easyui-color-error-foreground)',
  },
  outlined: {
    default: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-default) text-(--easyui-color-default-foreground)',
    primary: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-primary) text-(--easyui-color-primary)',
    secondary: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-secondary) text-(--easyui-color-secondary)',
    success: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-success) text-(--easyui-color-success)',
    warning: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-warning) text-(--easyui-color-warning)',
    error: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-error) text-(--easyui-color-error)',
  },
  flat: {
    default: 'bg-(--easyui-color-default)/40 text-(--easyui-color-default-foreground)',
    primary: 'bg-(--easyui-color-primary)/20 text-(--easyui-color-primary-dark)',
    secondary: 'bg-(--easyui-color-secondary)/20 text-(--easyui-color-secondary-dark)',
    success: 'bg-(--easyui-color-success)/20 text-(--easyui-color-success-dark)',
    warning: 'bg-(--easyui-color-warning)/20 text-(--easyui-color-warning-dark)',
    error: 'bg-(--easyui-color-error)/20 text-(--easyui-color-error-dark)',
  },
  light: {
    default: 'text-(--easyui-color-default-foreground)',
    primary: 'text-(--easyui-color-primary)',
    secondary: 'text-(--easyui-color-secondary)',
    success: 'text-(--easyui-color-success)',
    warning: 'text-(--easyui-color-warning)',
    error: 'text-(--easyui-color-error)',
  },
}

export const LABEL_COLOR_CLASSES: Record<NonNullable<WithVariantProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark)',
}

export const CONTENT_COLOR_CLASSES: Record<NonNullable<WithVariantProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)/60',
  primary: 'text-(--easyui-color-primary-dark)/60',
  secondary: 'text-(--easyui-color-secondary-dark)/60',
  success: 'text-(--easyui-color-success-dark)/60',
  warning: 'text-(--easyui-color-warning-dark)/60',
  error: 'text-(--easyui-color-error-dark)/60',
}

export const ERROR_CONTENT_COLOR = 'text-(--easyui-color-error-dark)/60'

export const CONTENT_COLOR_STRONG_CLASSES: Record<NonNullable<WithVariantProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark)',
}

export const ERROR_CONTENT_COLOR_STRONG = 'text-(--easyui-color-error-dark)'

export type FormFieldVariant = 'bordered' | 'faded' | 'flat' | 'underlined'

export const TEXT_FIELD_WRAPPER_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-10 px-3 gap-2',
  lg: 'h-12 px-4 gap-2',
}

export const TEXT_FIELD_TEXT_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const TEXT_FIELD_TEXT_COLOR_CLASSES: Record<NonNullable<WithVariantProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground) placeholder:text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark) placeholder:text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark) placeholder:text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark) placeholder:text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark) placeholder:text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark) placeholder:text-(--easyui-color-error-dark)',
}

export const TEXT_FIELD_ERROR_TEXT_COLOR =
  'text-(--easyui-color-error-dark) placeholder:text-(--easyui-color-error-dark)/40'

export const TEXT_FIELD_WRAPPER_VARIANT_COLOR_CLASSES: Record<
  FormFieldVariant,
  Record<NonNullable<WithVariantProps['color']>, string>
> = {
  bordered: {
    default:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    primary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    secondary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    success:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    warning:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    error:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
  },
  faded: {
    default:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) bg-(--easyui-color-default)/40 focus-within:border-(--easyui-color-focus-ring)',
    primary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) bg-(--easyui-color-primary)/30 focus-within:border-(--easyui-color-focus-ring)',
    secondary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) bg-(--easyui-color-secondary)/30 focus-within:border-(--easyui-color-focus-ring)',
    success:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) bg-(--easyui-color-success)/30 focus-within:border-(--easyui-color-focus-ring)',
    warning:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) bg-(--easyui-color-warning)/30 focus-within:border-(--easyui-color-focus-ring)',
    error:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) bg-(--easyui-color-error)/30 focus-within:border-(--easyui-color-focus-ring)',
  },
  flat: {
    default: 'bg-(--easyui-color-default)/40 focus-within:bg-(--easyui-color-default)/50',
    primary: 'bg-(--easyui-color-primary)/30 focus-within:bg-(--easyui-color-primary)/20',
    secondary: 'bg-(--easyui-color-secondary)/30 focus-within:bg-(--easyui-color-secondary)/20',
    success: 'bg-(--easyui-color-success)/30 focus-within:bg-(--easyui-color-success)/20',
    warning: 'bg-(--easyui-color-warning)/30 focus-within:bg-(--easyui-color-warning)/20',
    error: 'bg-(--easyui-color-error)/30 focus-within:bg-(--easyui-color-error)/20',
  },
  underlined: {
    default:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-focus-ring)',
    primary:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) focus-within:border-(--easyui-color-focus-ring)',
    secondary:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) focus-within:border-(--easyui-color-focus-ring)',
    success:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) focus-within:border-(--easyui-color-focus-ring)',
    warning:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) focus-within:border-(--easyui-color-focus-ring)',
    error:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) focus-within:border-(--easyui-color-focus-ring)',
  },
}

export const TEXT_FIELD_ERROR_WRAPPER_CLASSES: Record<FormFieldVariant, string> = {
  bordered: 'border-(--easyui-color-error) focus-within:border-(--easyui-color-error)',
  faded: 'border-(--easyui-color-error) bg-(--easyui-color-error)/10 focus-within:border-(--easyui-color-error)',
  flat: 'bg-(--easyui-color-error)/15 focus-within:bg-(--easyui-color-error)/20',
  underlined: 'border-(--easyui-color-error) focus-within:border-(--easyui-color-error)',
}
