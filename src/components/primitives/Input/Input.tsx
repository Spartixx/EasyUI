import React, { forwardRef, useId, useState } from 'react'
import type { InputProps } from './Input.types'
import { cn } from '../../../utils/cn'
import { RADIUS_CLASSES } from '../../../utils/variants'
import { useSlotClassNames } from '../../../hooks'
import { usePreset } from '../../../hooks'
import { Spinner } from '../spinners/Spinner'

const WRAPPER_SIZE_CLASSES: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-10 px-3 gap-2',
  lg: 'h-12 px-4 gap-2',
}

const WRAPPER_INSIDE_LABEL_SIZE_CLASSES: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-12 px-3 py-1.5 gap-0.5',
  md: 'h-14 px-3 py-2 gap-0.5',
  lg: 'h-16 px-4 py-2.5 gap-1',
}

const INPUT_TEXT_SIZE_CLASSES: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const INPUT_TEXT_COLOR_CLASSES: Record<NonNullable<InputProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground) placeholder:text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark) placeholder:text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark) placeholder:text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark) placeholder:text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark) placeholder:text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark) placeholder:text-(--easyui-color-error-dark)',
}

const CONTENT_TEXT_COLOR_CLASSES: Record<NonNullable<InputProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)/60',
  primary: 'text-(--easyui-color-primary-dark)/60',
  secondary: 'text-(--easyui-color-secondary-dark)/60',
  success: 'text-(--easyui-color-success-dark)/60',
  warning: 'text-(--easyui-color-warning-dark)/60',
  error: 'text-(--easyui-color-error-dark)/60',
}

const WRAPPER_VARIANT_COLOR_CLASSES: Record<
  NonNullable<InputProps['variant']>,
  Record<NonNullable<InputProps['color']>, string>
> = {
  // gray border in default state, color only on focus
  bordered: {
    default:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-default)',
    primary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-primary)',
    secondary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-secondary)',
    success:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-success)',
    warning:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-warning)',
    error:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-error)',
  },
  // colored border + tinted bg
  faded: {
    default:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) bg-(--easyui-color-default)/40 focus-within:border-(--easyui-color-default)',
    primary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) bg-(--easyui-color-primary)/30 focus-within:border-(--easyui-color-primary)',
    secondary:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) bg-(--easyui-color-secondary)/30 focus-within:border-(--easyui-color-secondary)',
    success:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) bg-(--easyui-color-success)/30 focus-within:border-(--easyui-color-success)',
    warning:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) bg-(--easyui-color-warning)/30 focus-within:border-(--easyui-color-warning)',
    error:
      'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) bg-(--easyui-color-error)/30 focus-within:border-(--easyui-color-error)',
  },
  // tinted bg, no border
  flat: {
    default: 'bg-(--easyui-color-default)/40 focus-within:bg-(--easyui-color-default)/50',
    primary: 'bg-(--easyui-color-primary)/30 focus-within:bg-(--easyui-color-primary)/20',
    secondary: 'bg-(--easyui-color-secondary)/30 focus-within:bg-(--easyui-color-secondary)/20',
    success: 'bg-(--easyui-color-success)/30 focus-within:bg-(--easyui-color-success)/20',
    warning: 'bg-(--easyui-color-warning)/30 focus-within:bg-(--easyui-color-warning)/20',
    error: 'bg-(--easyui-color-error)/30 focus-within:bg-(--easyui-color-error)/20',
  },
  // colored bottom border
  underlined: {
    default:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-within:border-(--easyui-color-default)',
    primary:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) focus-within:border-(--easyui-color-primary)',
    secondary:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) focus-within:border-(--easyui-color-secondary)',
    success:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) focus-within:border-(--easyui-color-success)',
    warning:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) focus-within:border-(--easyui-color-warning)',
    error:
      'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) focus-within:border-(--easyui-color-error)',
  },
}

const ERROR_WRAPPER_CLASSES: Record<NonNullable<InputProps['variant']>, string> = {
  bordered: 'border-(--easyui-color-error) focus-within:border-(--easyui-color-error)',
  faded: 'border-(--easyui-color-error) bg-(--easyui-color-error)/10 focus-within:border-(--easyui-color-error)',
  flat: 'bg-(--easyui-color-error)/15 focus-within:bg-(--easyui-color-error)/20',
  underlined: 'border-(--easyui-color-error) focus-within:border-(--easyui-color-error)',
}

const LABEL_COLOR_CLASSES: Record<NonNullable<InputProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark)',
}

const ERROR_TEXT_COLOR = 'text-(--easyui-color-error-dark) placeholder:text-(--easyui-color-error-dark)/40'
const ERROR_CONTENT_COLOR = 'text-(--easyui-color-error-dark)/60'

export const Input = forwardRef<HTMLInputElement, InputProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('input', preset)

  const {
    id: idProp,
    className,
    classNames,
    label,
    description,
    descriptionPlacement = 'element',
    labelPlacement = 'outside',
    error,
    size = 'md',
    variant = 'flat',
    color = 'default',
    radius = 'md',
    isDisabled = false,
    isRequired = false,
    isLoading = false,
    isReadOnly = false,
    isFullWidth = false,
    startContent,
    endContent,
    startContentPlacement = 'inside',
    endContentPlacement = 'inside',
    onChange,
    onBlur,
    onValueChange,
    validations,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const generatedId = useId()
  const inputId = idProp ?? generatedId

  const [validationError, setValidationError] = useState<string | null>(null)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('input', classNames, presetClassNames, presetConfig?.className)

  const isInputDisabled = isDisabled || isLoading
  const displayedError = error ?? validationError
  const hasError = !!displayedError

  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`
  const showsDescription = !!description && (descriptionPlacement === 'label' || !hasError)
  const ariaDescribedBy = [showsDescription && descriptionId, hasError && errorId].filter(Boolean).join(' ') || undefined

  const coloredVariant = variant !== 'bordered'
  const effectiveTextColor = hasError ? ERROR_TEXT_COLOR : INPUT_TEXT_COLOR_CLASSES[coloredVariant ? color : 'default']
  const effectiveContentColor = hasError ? ERROR_CONTENT_COLOR : CONTENT_TEXT_COLOR_CLASSES[coloredVariant ? color : 'default']
  const effectiveLabelColor = hasError ? 'text-(--easyui-color-error-dark)' : LABEL_COLOR_CLASSES[coloredVariant ? color : 'default']

  const hasOutsideContent =
    (!!startContent && startContentPlacement === 'outside') ||
    (!!endContent && endContentPlacement === 'outside')

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    if (!validations?.length) return
    for (const validate of validations) {
      const result = validate(e.target.value)
      if (result !== null) {
        setValidationError(result)
        return
      }
    }
    setValidationError(null)
  }

  const usesInsideLabel = labelPlacement === 'inside' && !!label

  const inputContent = (
    <>
      {startContent && startContentPlacement === 'inside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('startContent'))}>
          {startContent}
        </span>
      )}
      <input
        ref={ref}
        id={inputId}
        disabled={isInputDisabled}
        required={isRequired}
        readOnly={isReadOnly}
        aria-invalid={hasError || undefined}
        aria-required={isRequired || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'flex-1 bg-transparent outline-none min-w-0',
          INPUT_TEXT_SIZE_CLASSES[size],
          effectiveTextColor,
          isInputDisabled && 'cursor-not-allowed',
          isReadOnly && 'cursor-default',
          slotClassName('input'),
        )}
        onChange={(e) => {
          onChange?.(e)
          onValueChange?.(e.target.value)
        }}
        onBlur={handleBlur}
        {...nativeProps}
      />
      {isLoading && <Spinner size={size} className={cn('shrink-0', slotClassName('spinner'))} />}
      {endContent && endContentPlacement === 'inside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('endContent'))}>
          {endContent}
        </span>
      )}
    </>
  )

  const inputWrapper = (
    <div
      className={cn(
        'flex overflow-hidden transition-[border-color,background-color,box-shadow] duration-150',
        usesInsideLabel
          ? cn('flex-col', WRAPPER_INSIDE_LABEL_SIZE_CLASSES[size])
          : cn('items-center', WRAPPER_SIZE_CLASSES[size]),
        variant !== 'underlined' && RADIUS_CLASSES[radius],
        WRAPPER_VARIANT_COLOR_CLASSES[variant][color],
        hasError && ERROR_WRAPPER_CLASSES[variant],
        isInputDisabled && 'opacity-50 cursor-not-allowed',
        !hasOutsideContent && isFullWidth && 'w-full',
        hasOutsideContent && 'flex-1',
        slotClassName('inputWrapper'),
      )}
    >
      {usesInsideLabel && (
        <label
          htmlFor={inputId}
          className={cn('text-xs font-medium leading-none', effectiveLabelColor, slotClassName('label'))}
        >
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
              *
            </span>
          )}
        </label>
      )}
      {usesInsideLabel ? (
        <div className="flex items-center flex-1 min-h-0 gap-2">{inputContent}</div>
      ) : (
        inputContent
      )}
    </div>
  )

  const inputRow = !hasOutsideContent ? (
    inputWrapper
  ) : (
    <span className={cn('flex items-center gap-2', isFullWidth && 'w-full')}>
      {startContent && startContentPlacement === 'outside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('startContent'))}>
          {startContent}
        </span>
      )}
      {inputWrapper}
      {endContent && endContentPlacement === 'outside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('endContent'))}>
          {endContent}
        </span>
      )}
    </span>
  )

  const descriptionElement = description && (
    <span
      id={descriptionId}
      className={cn('text-xs text-(--easyui-color-default-foreground)/60', slotClassName('description'))}
    >
      {description}
    </span>
  )

  return (
    <div className={cn('flex flex-col gap-1', isFullWidth ? 'w-full' : 'w-80', slotClassName('base'), className)}>
      {labelPlacement === 'outside' && label && (
        <label
          htmlFor={inputId}
          className={cn('text-sm font-medium', effectiveLabelColor, slotClassName('label'))}
        >
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
              *
            </span>
          )}
        </label>
      )}
      {descriptionPlacement === 'label' && descriptionElement}
      {inputRow}
      {displayedError ? (
        <span id={errorId} role="alert" className={cn('text-xs text-(--easyui-color-error)', slotClassName('error'))}>
          {displayedError}
        </span>
      ) : (
        descriptionPlacement === 'element' && descriptionElement
      )}
    </div>
  )
})

Input.displayName = 'Input'
