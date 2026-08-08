import React, { forwardRef, useEffect, useRef } from 'react'
import type { CheckboxProps } from './Checkbox.types'
import { cn } from '../../../utils/cn'
import { mergePresetProps } from '../../../utils/mergePresetProps'
import {
  RADIUS_CLASSES,
  SURFACE_VARIANT_COLOR_CLASSES,
  PEER_FOCUS_OUTLINE_CLASSES,
} from '../../../utils/class-maps'
import { useSlotClassNames, usePreset, useMergedRefs } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { CheckIcon, MinusIcon } from '../../internal/icons'
import { useControllableValue, useFieldIds, useFieldValidation } from '../../internal/field'
import type { EasyUIBaseProps } from '../../../types/base'

type CheckboxSize = NonNullable<EasyUIBaseProps['size']>

const CHECKBOX_BOX_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

const CHECKBOX_ICON_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
}

const CHECKBOX_LABEL_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const CHECKBOX_UNCHECKED_CLASSES =
  'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default)'

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('checkbox', preset)

  const {
    id: idProp,
    className,
    classNames,
    label,
    description,
    descriptionPlacement = 'label',
    error,
    size = 'md',
    color = 'primary',
    radius = 'sm',
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isRequiredMessage,
    isFormControlled = false,
    isFullWidth = false,
    isSelected,
    defaultSelected,
    isIndeterminate = false,
    onValueChange,
    onChange,
    onBlur,
    validations,
    icon,
    indeterminateIcon,
    ...nativeProps
  } = mergePresetProps(presetConfig?.props, rest)

  const { fieldId: checkboxId, descriptionId, errorId } = useFieldIds(idProp)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('checkbox', classNames, presetClassNames, presetConfig?.className)

  const { defaults } = useEasyUIConfig()

  const [currentValue, setValue] = useControllableValue<boolean>(isSelected, defaultSelected ?? false)
  const checked = currentValue ?? false

  const fieldValidation = useFieldValidation<boolean>({
    isRequired,
    isRequiredMessage,
    isFormControlled,
    isEmpty: (value) => !value,
    validations,
  })

  const inputElementRef = useRef<HTMLInputElement | null>(null)
  const assignInputRef = useMergedRefs(inputElementRef, ref)

  // `indeterminate` is a DOM property with no HTML attribute counterpart, so it cannot be set through JSX.
  useEffect(() => {
    if (inputElementRef.current) inputElementRef.current.indeterminate = isIndeterminate
  }, [isIndeterminate])

  const displayedError = error ?? fieldValidation.error
  const hasError = !!displayedError
  const isInteractionBlocked = isDisabled || isReadOnly

  const describedBy = [description ? descriptionId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      event.preventDefault()
      return
    }
    const nextSelected = event.target.checked
    setValue(nextSelected)
    onChange?.(event)
    onValueChange?.(nextSelected)
    fieldValidation.revalidate(nextSelected)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    fieldValidation.validate(event.target.checked)
  }

  const isBoxFilled = checked || isIndeterminate
  const resolvedIcon = icon ?? defaults?.checkbox?.icon ?? <CheckIcon />
  const resolvedIndeterminateIcon =
    indeterminateIcon ?? defaults?.checkbox?.indeterminateIcon ?? <MinusIcon />

  const descriptionElement = description && (
    <span
      id={descriptionId}
      className={cn(
        'text-xs text-(--easyui-color-default-foreground)/60',
        slotClassName('description'),
      )}
    >
      {description}
    </span>
  )

  return (
    <div
      className={cn('flex flex-col gap-1', isFullWidth && 'w-full', slotClassName('base'), className)}
    >
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-2',
          isInteractionBlocked ? 'cursor-not-allowed' : 'cursor-pointer',
          isDisabled && 'opacity-50',
        )}
      >
        <input
          ref={assignInputRef}
          id={checkboxId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={isDisabled}
          required={isRequired}
          aria-checked={isIndeterminate ? 'mixed' : checked}
          aria-invalid={hasError || undefined}
          aria-required={isRequired || undefined}
          aria-readonly={isReadOnly || undefined}
          aria-describedby={describedBy || undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          {...nativeProps}
        />
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 flex items-center justify-center transition-[background-color,border-color] duration-150',
            CHECKBOX_BOX_SIZE_CLASSES[size],
            RADIUS_CLASSES[radius],
            isBoxFilled
              ? cn('border-transparent', SURFACE_VARIANT_COLOR_CLASSES.solid[color])
              : CHECKBOX_UNCHECKED_CLASSES,
            hasError && 'border-(--easyui-color-error)',
            PEER_FOCUS_OUTLINE_CLASSES,
            slotClassName('wrapper'),
          )}
        >
          {isBoxFilled && (
            <span className={cn(CHECKBOX_ICON_SIZE_CLASSES[size], slotClassName('icon'))}>
              {isIndeterminate ? resolvedIndeterminateIcon : resolvedIcon}
            </span>
          )}
        </span>
        {(label || (descriptionPlacement === 'label' && description)) && (
          <span className={cn('flex flex-col gap-0.5', slotClassName('content'))}>
            {label && (
              <span
                className={cn(
                  'leading-tight text-(--easyui-color-default-foreground)',
                  CHECKBOX_LABEL_SIZE_CLASSES[size],
                  slotClassName('label'),
                )}
              >
                {label}
                {isRequired && (
                  <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
                    *
                  </span>
                )}
              </span>
            )}
            {descriptionPlacement === 'label' && descriptionElement}
          </span>
        )}
      </label>
      {hasError ? (
        <span id={errorId} role="alert" className={cn('text-xs text-(--easyui-color-error)', slotClassName('error'))}>
          {displayedError}
        </span>
      ) : (
        descriptionPlacement === 'element' && descriptionElement
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'
