import { forwardRef } from 'react'
import type { ButtonProps } from './Button.types'
import { cn } from '../../../utils/cn'
import { mergePresetProps } from '../../../utils/mergePresetProps'
import {
  SIZE_CLASSES,
  RADIUS_CLASSES,
  SURFACE_VARIANT_COLOR_CLASSES,
  FOCUS_OUTLINE_CLASSES,
} from '../../../utils/class-maps'
import { useSlotClassNames } from '../../../hooks/useSlotClassNames'
import { usePreset } from '../../../hooks/usePreset'
import { Spinner } from '../spinners/Spinner'
import { ButtonContent } from './ButtonContent'

const INTERACTION_VARIANT_COLOR_CLASSES: Record<
  NonNullable<ButtonProps['variant']>,
  Record<NonNullable<ButtonProps['color']>, string>
> = {
  solid: {
    default: 'hover:brightness-95 active:brightness-90',
    primary: 'hover:brightness-95 active:brightness-90',
    secondary: 'hover:brightness-95 active:brightness-90',
    success: 'hover:brightness-95 active:brightness-90',
    warning: 'hover:brightness-95 active:brightness-90',
    error: 'hover:brightness-95 active:brightness-90',
  },
  outlined: {
    default: 'hover:bg-(--easyui-color-default)/50 active:bg-(--easyui-color-default)/70',
    primary: 'hover:bg-(--easyui-color-primary)/10 active:bg-(--easyui-color-primary)/15',
    secondary: 'hover:bg-(--easyui-color-secondary)/10 active:bg-(--easyui-color-secondary)/15',
    success: 'hover:bg-(--easyui-color-success)/10 active:bg-(--easyui-color-success)/15',
    warning: 'hover:bg-(--easyui-color-warning)/10 active:bg-(--easyui-color-warning)/15',
    error: 'hover:bg-(--easyui-color-error)/10 active:bg-(--easyui-color-error)/15',
  },
  flat: {
    default: 'hover:brightness-95 active:brightness-90',
    primary: 'hover:bg-(--easyui-color-primary)/25',
    secondary: 'hover:bg-(--easyui-color-secondary)/25',
    success: 'hover:bg-(--easyui-color-success)/25',
    warning: 'hover:bg-(--easyui-color-warning)/25',
    error: 'hover:bg-(--easyui-color-error)/25',
  },
  light: {
    default: 'hover:bg-black/5 active:bg-black/10',
    primary: 'hover:bg-(--easyui-color-primary)/10 active:bg-(--easyui-color-primary)/15',
    secondary: 'hover:bg-(--easyui-color-secondary)/10 active:bg-(--easyui-color-secondary)/15',
    success: 'hover:bg-(--easyui-color-success)/10 active:bg-(--easyui-color-success)/15',
    warning: 'hover:bg-(--easyui-color-warning)/10 active:bg-(--easyui-color-warning)/15',
    error: 'hover:bg-(--easyui-color-error)/10 active:bg-(--easyui-color-error)/15',
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
  } = mergePresetProps(presetConfig?.props, rest)

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
        FOCUS_OUTLINE_CLASSES,
        'disabled:opacity-50 disabled:cursor-not-allowed',
        SIZE_CLASSES[size],
        RADIUS_CLASSES[radius],
        SURFACE_VARIANT_COLOR_CLASSES[variant][color],
        INTERACTION_VARIANT_COLOR_CLASSES[variant][color],
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
