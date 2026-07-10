import React, { forwardRef, useRef, useState } from 'react'
import type { InputProps } from './Input.types'
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
import { useSlotClassNames } from '../../../hooks'
import { usePreset } from '../../../hooks'
import { useMergedRefs } from '../../../hooks'
import { Spinner } from '../spinners/Spinner'
import { ContentSlot, OutsideContentRow, hasOutsideContent as computeHasOutsideContent } from '../../internal/content'
import {
  useFieldIds,
  useFieldDescribedBy,
  useFieldColors,
  FieldLayout,
  NumberStepper,
  type NumberStepDirection,
} from '../../internal/field'

const WRAPPER_INSIDE_LABEL_SIZE_CLASSES: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-12 px-3 py-1.5 gap-0.5',
  md: 'h-14 px-3 py-2 gap-0.5',
  lg: 'h-16 px-4 py-2.5 gap-1',
}

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
    showStepper = true,
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

  const { fieldId: inputId, descriptionId, errorId } = useFieldIds(idProp)

  const [validationError, setValidationError] = useState<string | null>(null)

  const [trackedNumberValue, setTrackedNumberValue] = useState(() => String(nativeProps.defaultValue ?? ''))

  const inputElementRef = useRef<HTMLInputElement | null>(null)
  const assignInputRef = useMergedRefs(inputElementRef, ref)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('input', classNames, presetClassNames, presetConfig?.className)

  const isInputDisabled = isDisabled || isLoading
  const displayedError = error ?? validationError
  const hasError = !!displayedError

  const { ariaDescribedBy } = useFieldDescribedBy({ hasError, description, descriptionPlacement, descriptionId, errorId })

  const { effectiveTextColor, effectiveContentColor, effectiveStrongContentColor, effectiveLabelColor } = useFieldColors({
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

  const isNumberField = nativeProps.type === 'number'
  const showsStepper = isNumberField && showStepper && !isReadOnly

  const currentValue = nativeProps.value ?? trackedNumberValue
  const numericValue = currentValue === '' ? NaN : Number(currentValue)
  const isAtMax = numericValue >= Number(nativeProps.max)
  const isAtMin = numericValue <= Number(nativeProps.min)

  const stepValue = (direction: NumberStepDirection) => {
    const inputElement = inputElementRef.current
    if (!inputElement) return
    try {
      if (direction === 'increment') inputElement.stepUp()
      else inputElement.stepDown()
    } catch {
      return
    }
    inputElement.dispatchEvent(new Event('input', { bubbles: true }))
  }

  const usesInsideLabel = labelPlacement === 'inside' && !!label

  const inputContent = (
    <>
      <ContentSlot
        content={startContent}
        placement={startContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('startContent'))}
      />
      <input
        ref={assignInputRef}
        id={inputId}
        disabled={isInputDisabled}
        required={isRequired}
        readOnly={isReadOnly}
        aria-invalid={hasError || undefined}
        aria-required={isRequired || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'flex-1 bg-transparent outline-none min-w-0',
          TEXT_FIELD_TEXT_SIZE_CLASSES[size],
          effectiveTextColor,
          isInputDisabled && 'cursor-not-allowed',
          isReadOnly && 'cursor-default',
          isNumberField &&
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0',
          slotClassName('input'),
        )}
        onChange={(e) => {
          if (isNumberField && nativeProps.value == null) setTrackedNumberValue(e.target.value)
          onChange?.(e)
          onValueChange?.(e.target.value)
        }}
        onBlur={handleBlur}
        {...nativeProps}
      />
      {isLoading && <Spinner size={size} className={cn('shrink-0', slotClassName('spinner'))} />}
      <ContentSlot
        content={endContent}
        placement={endContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('endContent'))}
      />
      {showsStepper && (
        <NumberStepper
          size={size}
          colorClass={effectiveStrongContentColor}
          isDisabled={isInputDisabled}
          isIncrementDisabled={isAtMax}
          isDecrementDisabled={isAtMin}
          onStep={stepValue}
          className={slotClassName('stepper')}
          incrementClassName={slotClassName('incrementButton')}
          decrementClassName={slotClassName('decrementButton')}
        />
      )}
    </>
  )

  const inputWrapper = (
    <div
      className={cn(
        'flex overflow-hidden transition-[border-color,background-color,box-shadow] duration-150',
        usesInsideLabel
          ? cn('flex-col', WRAPPER_INSIDE_LABEL_SIZE_CLASSES[size])
          : cn('items-center', TEXT_FIELD_WRAPPER_SIZE_CLASSES[size]),
        variant !== 'underlined' && RADIUS_CLASSES[radius],
        TEXT_FIELD_WRAPPER_VARIANT_COLOR_CLASSES[variant][color],
        hasError && TEXT_FIELD_ERROR_WRAPPER_CLASSES[variant],
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

  const inputRow = (
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
      {inputRow}
    </FieldLayout>
  )
})

Input.displayName = 'Input'
