import React, { forwardRef, useEffect, useRef, useState } from 'react'
import type { InputNumberProps } from './InputNumber.types'
import { cn } from '../../../utils/cn'
import {
  RADIUS_CLASSES,
  TEXT_FIELD_WRAPPER_SIZE_CLASSES,
  TEXT_FIELD_TEXT_SIZE_CLASSES,
  TEXT_FIELD_TEXT_COLOR_CLASSES,
  TEXT_FIELD_ERROR_TEXT_COLOR,
  TEXT_FIELD_WRAPPER_VARIANT_COLOR_CLASSES,
  TEXT_FIELD_ERROR_WRAPPER_CLASSES,
} from '../../../utils/class-maps'
import { useSlotClassNames, usePreset, useMergedRefs } from '../../../hooks'
import { Spinner } from '../spinners/Spinner'
import { ContentSlot, OutsideContentRow, hasOutsideContent as computeHasOutsideContent } from '../../internal/content'
import {
  useFieldIds,
  useFieldDescribedBy,
  useFieldColors,
  useControllableValue,
  FieldLayout,
  NumberStepper,
  type NumberStepDirection,
} from '../../internal/field'
import { NumberSideButton } from './NumberSideButton'
import { sanitizeNumericText, parseNumericText, formatNumericValue, clampToRange, stepNumericValue } from './numberValue'

const WRAPPER_INSIDE_LABEL_SIZE_CLASSES: Record<NonNullable<InputNumberProps['size']>, string> = {
  sm: 'h-12 px-3 py-1.5 gap-0.5',
  md: 'h-14 px-3 py-2 gap-0.5',
  lg: 'h-16 px-4 py-2.5 gap-1',
}

const DIVIDER_BORDER_COLOR_CLASSES: Record<NonNullable<InputNumberProps['color']>, string> = {
  default: 'border-(--easyui-color-default)/60',
  primary: 'border-(--easyui-color-primary)/40',
  secondary: 'border-(--easyui-color-secondary)/40',
  success: 'border-(--easyui-color-success)/40',
  warning: 'border-(--easyui-color-warning)/40',
  error: 'border-(--easyui-color-error)/40',
}

const DIVIDER_ERROR_BORDER_COLOR = 'border-(--easyui-color-error)/40'

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('inputNumber', preset)

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
    stepperPlacement = 'end',
    prefix,
    suffix,
    value,
    defaultValue,
    min,
    max,
    step = 1,
    isWheelStepEnabled = true,
    startContent,
    endContent,
    startContentPlacement = 'inside',
    endContentPlacement = 'inside',
    onBlur,
    onFocus,
    onKeyDown,
    onValueChange,
    validations,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const { fieldId: inputId, descriptionId, errorId } = useFieldIds(idProp)

  const [validationError, setValidationError] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [committedValue, setCommittedValue] = useControllableValue<number | null>(value, defaultValue ?? null)

  const inputElementRef = useRef<HTMLInputElement | null>(null)
  const inputWrapperRef = useRef<HTMLDivElement | null>(null)
  const assignInputRef = useMergedRefs(inputElementRef, ref)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('inputNumber', classNames, presetClassNames, presetConfig?.className)

  const currentValue = committedValue ?? null
  const isInputDisabled = isDisabled || isLoading
  const displayedError = error ?? validationError
  const hasError = !!displayedError

  const { ariaDescribedBy } = useFieldDescribedBy({ hasError, description, descriptionPlacement, descriptionId, errorId })

  const { resolvedColor, effectiveTextColor, effectiveContentColor, effectiveStrongContentColor, effectiveLabelColor } =
    useFieldColors({
      hasError,
      color,
      variant,
      textColorClasses: TEXT_FIELD_TEXT_COLOR_CLASSES,
      errorTextColor: TEXT_FIELD_ERROR_TEXT_COLOR,
    })

  const hasOutsideContent = computeHasOutsideContent({
    startContent,
    startContentPlacement,
    endContent,
    endContentPlacement,
  })

  const displayedValue = isEditing ? displayText : formatNumericValue(currentValue)

  const commitValue = (next: number | null) => {
    setCommittedValue(next)
    onValueChange?.(next)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumericText(e.target.value)
    setDisplayText(sanitized)
    setIsEditing(true)
    commitValue(parseNumericText(sanitized))
  }

  const clampCurrentValue = (): number | null => {
    if (currentValue === null) return null
    const clamped = clampToRange(currentValue, min, max)
    if (clamped !== currentValue) commitValue(clamped)
    return clamped
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false)
    onBlur?.(e)
    const effectiveValue = clampCurrentValue()
    if (!validations?.length) return
    for (const validate of validations) {
      const result = validate(effectiveValue)
      if (result !== null) {
        setValidationError(result)
        return
      }
    }
    setValidationError(null)
  }

  const stepInDirection = (direction: NumberStepDirection) => {
    setIsEditing(false)
    commitValue(stepNumericValue(currentValue, direction, step, min, max))
  }

  const stepInDirectionRef = useRef(stepInDirection)
  useEffect(() => {
    stepInDirectionRef.current = stepInDirection
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (isInputDisabled || isReadOnly) return
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      stepInDirection('increment')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      stepInDirection('decrement')
    } else if (event.key === 'Enter') {
      setIsEditing(false)
      clampCurrentValue()
    }
  }

  const isWheelActive = isWheelStepEnabled && !isInputDisabled && !isReadOnly
  useEffect(() => {
    const wrapperElement = inputWrapperRef.current
    if (!wrapperElement || !isWheelActive) return
    const handleWheel = (event: WheelEvent) => {
      if (document.activeElement !== inputElementRef.current) return
      event.preventDefault()
      stepInDirectionRef.current(event.deltaY < 0 ? 'increment' : 'decrement')
    }
    wrapperElement.addEventListener('wheel', handleWheel, { passive: false })
    return () => wrapperElement.removeEventListener('wheel', handleWheel)
  }, [isWheelActive])

  const isAtMax = currentValue !== null && max !== undefined && currentValue >= max
  const isAtMin = currentValue !== null && min !== undefined && currentValue <= min
  const showControls = !isReadOnly
  const dividerClass = hasError ? DIVIDER_ERROR_BORDER_COLOR : DIVIDER_BORDER_COLOR_CLASSES[resolvedColor]
  const usesInsideLabel = labelPlacement === 'inside' && !!label

  const placeholderText = typeof nativeProps.placeholder === 'string' ? nativeProps.placeholder : ''
  const inputSize = Math.max(displayedValue.length, placeholderText.length, 1)

  const focusInput = (event: React.MouseEvent) => {
    if (event.target === inputElementRef.current) return
    event.preventDefault()
    inputElementRef.current?.focus()
  }

  const numberInput = (
    <input
      ref={assignInputRef}
      id={inputId}
      type="text"
      inputMode="decimal"
      size={inputSize}
      value={displayedValue}
      disabled={isInputDisabled}
      required={isRequired}
      readOnly={isReadOnly}
      aria-invalid={hasError || undefined}
      aria-required={isRequired || undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        'bg-transparent outline-none min-w-0 field-sizing-content',
        TEXT_FIELD_TEXT_SIZE_CLASSES[size],
        effectiveTextColor,
        isInputDisabled && 'cursor-not-allowed',
        isReadOnly && 'cursor-default',
        slotClassName('input'),
      )}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      {...nativeProps}
    />
  )

  const valueGroup = (
    <span
      onMouseDown={focusInput}
      className={cn('flex items-center min-w-0 flex-1', isInputDisabled ? 'cursor-not-allowed' : 'cursor-text')}
    >
      {prefix ? (
        <span
          aria-hidden="true"
          className={cn('shrink-0 whitespace-pre', TEXT_FIELD_TEXT_SIZE_CLASSES[size], effectiveContentColor, slotClassName('prefix'))}
        >
          {`${prefix} `}
        </span>
      ) : null}
      {numberInput}
      {suffix ? (
        <span
          aria-hidden="true"
          className={cn('shrink-0 whitespace-pre', TEXT_FIELD_TEXT_SIZE_CLASSES[size], effectiveContentColor, slotClassName('suffix'))}
        >
          {` ${suffix}`}
        </span>
      ) : null}
    </span>
  )

  const startContentInside = (
    <ContentSlot
      content={startContent}
      placement={startContentPlacement}
      show="inside"
      className={cn(effectiveContentColor, slotClassName('startContent'))}
    />
  )
  const endContentInside = (
    <ContentSlot
      content={endContent}
      placement={endContentPlacement}
      show="inside"
      className={cn(effectiveContentColor, slotClassName('endContent'))}
    />
  )
  const spinner = isLoading ? <Spinner size={size} className={cn('shrink-0', slotClassName('spinner'))} /> : null

  const contentRow = (
    <div className="flex items-center min-w-0 flex-1 gap-2">
      {startContentInside}
      {valueGroup}
      {spinner}
      {endContentInside}
    </div>
  )

  const centerColumn = usesInsideLabel ? (
    <div className="flex flex-col justify-center min-w-0 flex-1 gap-0.5">
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
      {contentRow}
    </div>
  ) : (
    contentRow
  )

  const inputWrapper = (
    <div
      ref={inputWrapperRef}
      className={cn(
        'flex items-stretch overflow-hidden transition-[border-color,background-color,box-shadow] duration-150',
        usesInsideLabel ? WRAPPER_INSIDE_LABEL_SIZE_CLASSES[size] : TEXT_FIELD_WRAPPER_SIZE_CLASSES[size],
        variant !== 'underlined' && RADIUS_CLASSES[radius],
        TEXT_FIELD_WRAPPER_VARIANT_COLOR_CLASSES[variant][color],
        hasError && TEXT_FIELD_ERROR_WRAPPER_CLASSES[variant],
        isInputDisabled && 'opacity-50 cursor-not-allowed',
        !hasOutsideContent && isFullWidth && 'w-full',
        hasOutsideContent && 'flex-1',
        slotClassName('inputWrapper'),
      )}
    >
      {showControls && stepperPlacement === 'sides' && (
        <NumberSideButton
          direction="decrement"
          placement="start"
          size={size}
          colorClass={effectiveStrongContentColor}
          dividerClass={dividerClass}
          isDisabled={isInputDisabled}
          isStepDisabled={isAtMin}
          onStep={stepInDirection}
          className={slotClassName('decrementButton')}
        />
      )}
      {centerColumn}
      {showControls && stepperPlacement === 'end' && (
        <NumberStepper
          size={size}
          colorClass={effectiveStrongContentColor}
          isDisabled={isInputDisabled}
          isIncrementDisabled={isAtMax}
          isDecrementDisabled={isAtMin}
          onStep={stepInDirection}
          className={slotClassName('stepper')}
          incrementClassName={slotClassName('incrementButton')}
          decrementClassName={slotClassName('decrementButton')}
        />
      )}
      {showControls && stepperPlacement === 'sides' && (
        <NumberSideButton
          direction="increment"
          placement="end"
          size={size}
          colorClass={effectiveStrongContentColor}
          dividerClass={dividerClass}
          isDisabled={isInputDisabled}
          isStepDisabled={isAtMax}
          onStep={stepInDirection}
          className={slotClassName('incrementButton')}
        />
      )}
    </div>
  )

  return (
    <FieldLayout
      className={className}
      baseClassName={slotClassName('base')}
      isFullWidth={isFullWidth}
      label={labelPlacement === 'outside' ? label : undefined}
      labelHtmlFor={inputId}
      labelClassName={cn(effectiveLabelColor, slotClassName('label'))}
      isRequired={isRequired}
      description={description}
      descriptionId={descriptionId}
      descriptionClassName={slotClassName('description')}
      descriptionPlacement={descriptionPlacement}
      error={displayedError ?? undefined}
      errorId={errorId}
      errorClassName={slotClassName('error')}
    >
      <OutsideContentRow
        startContent={startContent}
        startContentPlacement={startContentPlacement}
        startClassName={cn(effectiveContentColor, slotClassName('startContent'))}
        endContent={endContent}
        endContentPlacement={endContentPlacement}
        endClassName={cn(effectiveContentColor, slotClassName('endContent'))}
        isFullWidth={isFullWidth}
      >
        {inputWrapper}
      </OutsideContentRow>
    </FieldLayout>
  )
})

InputNumber.displayName = 'InputNumber'
