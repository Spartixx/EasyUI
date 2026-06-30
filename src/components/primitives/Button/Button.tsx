import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'
import { cn } from '../../../utils/cn'
import { SIZE_CLASSES, RADIUS_CLASSES } from '../../../utils/class-maps'
import { useSlotClassNames } from '../../../hooks/useSlotClassNames'
import { usePreset } from '../../../hooks/usePreset'
import { Spinner } from '../spinners/Spinner'
import { ButtonContent } from './ButtonContent'

const VARIANT_COLOR_CLASSES: Record<
  NonNullable<ButtonProps['variant']>,
  Record<NonNullable<ButtonProps['color']>, string>
> = {
  solid: {
    default: 'bg-(--easyui-color-default) text-(--easyui-color-default-foreground) hover:brightness-95 active:brightness-90',
    primary: 'bg-(--easyui-color-primary) text-(--easyui-color-primary-foreground) hover:brightness-95 active:brightness-90',
    secondary: 'bg-(--easyui-color-secondary) text-(--easyui-color-secondary-foreground) hover:brightness-95 active:brightness-90',
    success: 'bg-(--easyui-color-success) text-(--easyui-color-success-foreground) hover:brightness-95 active:brightness-90',
    warning: 'bg-(--easyui-color-warning) text-(--easyui-color-warning-foreground) hover:brightness-95 active:brightness-90',
    error: 'bg-(--easyui-color-error) text-(--easyui-color-error-foreground) hover:brightness-95 active:brightness-90',
  },
  outlined: {
    default: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-default) text-(--easyui-color-default-foreground) hover:bg-(--easyui-color-default)/50 active:bg-(--easyui-color-default)/70',
    primary: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-primary) text-(--easyui-color-primary) hover:bg-(--easyui-color-primary)/10 active:bg-(--easyui-color-primary)/15',
    secondary: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-secondary) text-(--easyui-color-secondary) hover:bg-(--easyui-color-secondary)/10 active:bg-(--easyui-color-secondary)/15',
    success: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-success) text-(--easyui-color-success) hover:bg-(--easyui-color-success)/10 active:bg-(--easyui-color-success)/15',
    warning: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-warning) text-(--easyui-color-warning) hover:bg-(--easyui-color-warning)/10 active:bg-(--easyui-color-warning)/15',
    error: 'border-solid border-[length:var(--easyui-border-width-md)] border-(--easyui-color-error) text-(--easyui-color-error) hover:bg-(--easyui-color-error)/10 active:bg-(--easyui-color-error)/15',
  },
  flat: {
    default: 'bg-(--easyui-color-default)/40 text-(--easyui-color-default-foreground) hover:brightness-95 active:brightness-90',
    primary: 'bg-(--easyui-color-primary)/20 text-(--easyui-color-primary-dark) hover:bg-(--easyui-color-primary)/25',
    secondary: 'bg-(--easyui-color-secondary)/20 text-(--easyui-color-secondary-dark) hover:bg-(--easyui-color-secondary)/25',
    success: 'bg-(--easyui-color-success)/20 text-(--easyui-color-success-dark) hover:bg-(--easyui-color-success)/25',
    warning: 'bg-(--easyui-color-warning)/20 text-(--easyui-color-warning-dark) hover:bg-(--easyui-color-warning)/25',
    error: 'bg-(--easyui-color-error)/20 text-(--easyui-color-error-dark) hover:bg-(--easyui-color-error)/25',
  },
  light: {
    default: 'text-(--easyui-color-default-foreground) hover:bg-black/5 active:bg-black/10',
    primary: 'text-(--easyui-color-primary) hover:bg-(--easyui-color-primary)/10 active:bg-(--easyui-color-primary)/15',
    secondary: 'text-(--easyui-color-secondary) hover:bg-(--easyui-color-secondary)/10 active:bg-(--easyui-color-secondary)/15',
    success: 'text-(--easyui-color-success) hover:bg-(--easyui-color-success)/10 active:bg-(--easyui-color-success)/15',
    warning: 'text-(--easyui-color-warning) hover:bg-(--easyui-color-warning)/10 active:bg-(--easyui-color-warning)/15',
    error: 'text-(--easyui-color-error) hover:bg-(--easyui-color-error)/10 active:bg-(--easyui-color-error)/15',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('button', preset)

  const {
    children,
    className,
    classNames,
    label,
    description,
    descriptionPlacement = 'element',
    size = 'md',
    variant = 'solid',
    color = 'default',
    radius = 'md',
    isDisabled = false,
    isLoading = false,
    isFullWidth = false,
    startContent,
    endContent,
    startContentPlacement = 'inside',
    endContentPlacement = 'inside',
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('button', classNames, presetClassNames, presetConfig?.className)

  const isButtonDisabled = isDisabled || isLoading

  const hasOutsideContent =
    (!!startContent && startContentPlacement === 'outside') ||
    (!!endContent && endContentPlacement === 'outside')

  const button = (
    <button
      ref={ref}
      disabled={isButtonDisabled}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-normal cursor-pointer select-none',
        'transition-[filter,background-color] duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--easyui-color-focus-ring)',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        SIZE_CLASSES[size],
        RADIUS_CLASSES[radius],
        VARIANT_COLOR_CLASSES[variant][color],
        !hasOutsideContent && isFullWidth && 'w-full',
        hasOutsideContent && isFullWidth && 'flex-1',
        slotClassName('base'),
        className,
      )}
      {...nativeProps}
    >
      {startContent && startContentPlacement === 'inside' && (
        <ButtonContent className={slotClassName('startContent')}>
          {startContent}
        </ButtonContent>
      )}
      {isLoading && <Spinner size={size} className={slotClassName('spinner')} />}
      <span className={slotClassName('text')}>{children}</span>
      {endContent && endContentPlacement === 'inside' && (
        <ButtonContent className={slotClassName('endContent')}>
          {endContent}
        </ButtonContent>
      )}
    </button>
  )

  const content = !hasOutsideContent ? (
    button
  ) : (
    <span className={cn('inline-flex items-center gap-2', isFullWidth && 'w-full')}>
      {startContent && startContentPlacement === 'outside' && (
        <ButtonContent className={slotClassName('startContent')}>
          {startContent}
        </ButtonContent>
      )}
      {button}
      {endContent && endContentPlacement === 'outside' && (
        <ButtonContent className={slotClassName('endContent')}>
          {endContent}
        </ButtonContent>
      )}
    </span>
  )

  if (!label && !description) return content

  const descriptionElement = description && (
    <span className={cn('text-xs text-(--easyui-color-default-foreground)/60', slotClassName('description'))}>
      {description}
    </span>
  )

  return (
    <div className={cn('inline-flex flex-col gap-1', isFullWidth && 'w-full')}>
      {label && (
        <span className={cn('text-sm font-medium text-(--easyui-color-default-foreground)', slotClassName('label'))}>
          {label}
        </span>
      )}
      {descriptionPlacement === 'label' && descriptionElement}
      {content}
      {descriptionPlacement === 'element' && descriptionElement}
    </div>
  )
})

Button.displayName = 'Button'
