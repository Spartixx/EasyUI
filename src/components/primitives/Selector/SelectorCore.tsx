import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, MouseEvent, RefObject } from 'react'
import type { SelectorOption as SelectorOptionData, SelectorCommonProps, SelectorProps } from './Selector.types'
import { cn } from '../../../utils/cn'
import { RADIUS_CLASSES, LABEL_COLOR_CLASSES } from '../../../utils/class-maps'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Spinner } from '../spinners/Spinner'
import { ArrowIcon } from '../../internal/icons'
import { SelectionChips } from '../../internal/chips'
import { Listbox, OptionItem, useListboxNavigation, applyOptionValidations, getOptionValidationError } from '../../internal/listbox'
import { ContentSlot, OutsideContentRow, hasOutsideContent as computeHasOutsideContent } from '../../internal/content'
import {
  useControllableValue,
  useFieldIds,
  useFieldDescribedBy,
  useFieldColors,
  useFieldValidation,
  FieldLayout,
} from '../../internal/field'
import type { SelectionBehavior } from '../../internal/field'

const TRIGGER_SIZE_CLASSES: Record<NonNullable<SelectorProps['size']>, string> = {
  sm: 'h-8 px-3 gap-1.5 text-xs',
  md: 'h-10 px-3 gap-2 text-sm',
  lg: 'h-12 px-4 gap-2 text-base',
}

const MULTIPLE_TRIGGER_SIZE_CLASSES: Record<NonNullable<SelectorProps['size']>, string> = {
  sm: 'min-h-8 py-1 px-3 gap-1.5 text-xs',
  md: 'min-h-10 py-1.5 px-3 gap-2 text-sm',
  lg: 'min-h-12 py-2 px-4 gap-2 text-base',
}

const TRIGGER_VARIANT_COLOR_CLASSES: Record<
  NonNullable<SelectorProps['variant']>,
  Record<NonNullable<SelectorProps['color']>, string>
> = {
  bordered: {
    default: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-default)',
    primary: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-primary)',
    secondary: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-secondary)',
    success: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-success)',
    warning: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-warning)',
    error: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-error)',
  },
  faded: {
    default: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) bg-(--easyui-color-default)/40 focus-visible:border-(--easyui-color-default)',
    primary: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) bg-(--easyui-color-primary)/30 focus-visible:border-(--easyui-color-primary)',
    secondary: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) bg-(--easyui-color-secondary)/30 focus-visible:border-(--easyui-color-secondary)',
    success: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) bg-(--easyui-color-success)/30 focus-visible:border-(--easyui-color-success)',
    warning: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) bg-(--easyui-color-warning)/30 focus-visible:border-(--easyui-color-warning)',
    error: 'border-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) bg-(--easyui-color-error)/30 focus-visible:border-(--easyui-color-error)',
  },
  flat: {
    default: 'bg-(--easyui-color-default)/40 focus-visible:bg-(--easyui-color-default)/50',
    primary: 'bg-(--easyui-color-primary)/30 focus-visible:bg-(--easyui-color-primary)/20',
    secondary: 'bg-(--easyui-color-secondary)/30 focus-visible:bg-(--easyui-color-secondary)/20',
    success: 'bg-(--easyui-color-success)/30 focus-visible:bg-(--easyui-color-success)/20',
    warning: 'bg-(--easyui-color-warning)/30 focus-visible:bg-(--easyui-color-warning)/20',
    error: 'bg-(--easyui-color-error)/30 focus-visible:bg-(--easyui-color-error)/20',
  },
  underlined: {
    default: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-default) focus-visible:border-(--easyui-color-default)',
    primary: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-primary) focus-visible:border-(--easyui-color-primary)',
    secondary: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-secondary) focus-visible:border-(--easyui-color-secondary)',
    success: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-success) focus-visible:border-(--easyui-color-success)',
    warning: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-warning) focus-visible:border-(--easyui-color-warning)',
    error: 'border-b-[length:var(--easyui-border-width-md)] border-solid border-(--easyui-color-error) focus-visible:border-(--easyui-color-error)',
  },
}

const ERROR_TRIGGER_CLASSES: Record<NonNullable<SelectorProps['variant']>, string> = {
  bordered: 'border-(--easyui-color-error) focus-visible:border-(--easyui-color-error)',
  faded: 'border-(--easyui-color-error) bg-(--easyui-color-error)/10 focus-visible:border-(--easyui-color-error)',
  flat: 'bg-(--easyui-color-error)/15 focus-visible:bg-(--easyui-color-error)/20',
  underlined: 'border-(--easyui-color-error) focus-visible:border-(--easyui-color-error)',
}

const ERROR_TEXT_COLOR = 'text-(--easyui-color-error-dark)'

export interface SelectorCoreProps<TValue> extends SelectorCommonProps {
  selectionMode?: 'single' | 'multiple'
  behavior: SelectionBehavior<TValue>
  triggerRef: RefObject<HTMLButtonElement | null>
  setTriggerNode: (node: HTMLButtonElement | null) => void
  value?: TValue
  defaultValue?: TValue
  onValueChange?: (value: TValue) => void
}

export function SelectorCore<TValue>(rawProps: SelectorCoreProps<TValue>) {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('selector', preset)

  const {
    selectionMode = 'single',
    behavior,
    triggerRef,
    setTriggerNode,
    id: idProp,
    className,
    classNames,
    label,
    description,
    descriptionPlacement = 'element',
    error,
    options,
    selectionIndicator = 'check',
    value,
    defaultValue,
    onValueChange,
    placeholder,
    size = 'md',
    variant = 'bordered',
    color = 'default',
    radius = 'md',
    isDisabled = false,
    isRequired = false,
    isRequiredMessage,
    isFormControlled = false,
    isLoading = false,
    isFullWidth = false,
    startContent,
    endContent,
    startContentPlacement = 'inside',
    endContentPlacement = 'inside',
    arrow,
    arrowPlacement = 'end',
    isArrowHidden = false,
    onKeyDown,
    onClick,
    onBlur,
    validations,
    noResultsMessage,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const isMultiple = selectionMode === 'multiple'

  const { defaults } = useEasyUIConfig()
  const resolvedNoResultsMessage = noResultsMessage ?? defaults?.selector?.noResultsMessage

  const { fieldId: triggerId, labelId, listboxId, descriptionId, errorId, optionId } = useFieldIds(idProp)

  const [currentValue, setValue] = useControllableValue<TValue>(value, defaultValue)
  const selectedValues = behavior.toSelectedValues(currentValue)

  const fieldValidation = useFieldValidation<TValue>({
    isRequired,
    isRequiredMessage,
    isFormControlled,
    isEmpty: (candidate) => behavior.toSelectedValues(candidate).length === 0,
  })

  const resolvedOptions = applyOptionValidations(options, validations)

  const commitSelection = (nextValues: string[]) => {
    const nextValue = behavior.fromSelectedValues(nextValues)
    setValue(nextValue)
    onValueChange?.(nextValue)
    return nextValue
  }
  const commitSelectionRef = useRef(commitSelection)
  useEffect(() => {
    commitSelectionRef.current = commitSelection
  })
  useEffect(() => {
    const committedValues = behavior.toSelectedValues(currentValue)
    if (committedValues.length === 0) return
    const validValues = committedValues.filter((committedValue) => {
      const option = options.find((candidate) => candidate.value === committedValue)
      return !option || getOptionValidationError(option, validations) === null
    })
    if (validValues.length !== committedValues.length) commitSelectionRef.current(validValues)
  }, [behavior, currentValue, options, validations])

  const [announcement, setAnnouncement] = useState('')

  const listboxRef = useRef<HTMLUListElement>(null)
  const typeaheadRef = useRef('')
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('selector', classNames, presetClassNames, presetConfig?.className)

  const isSelectorDisabled = isDisabled || isLoading

  const selectedOption = resolvedOptions.find((option) => option.value === selectedValues[0])
  const displayedError = error ?? fieldValidation.error
  const hasError = !!displayedError
  const { ariaDescribedBy } = useFieldDescribedBy({ hasError, description, descriptionPlacement, descriptionId, errorId })

  const { isOpen, activeIndex, setActiveIndex, enabledIndexes, openListbox, closeListbox, handleArrowKey } =
    useListboxNavigation({ options: resolvedOptions, selectedValues, triggerRef, listboxRef, optionId })

  const selectOption = (option: SelectorOptionData) => {
    const wasSelected = selectedValues.includes(option.value)
    const nextValue = commitSelection(behavior.computeNextValues(selectedValues, option.value))
    fieldValidation.revalidate(nextValue)
    setAnnouncement(`${wasSelected && isMultiple ? 'Deselected' : 'Selected'}: ${option.label}`)
    if (!isMultiple) closeListbox()
  }

  const removeValue = (optionValue: string) => {
    const nextValue = commitSelection(selectedValues.filter((selectedValue) => selectedValue !== optionValue))
    fieldValidation.revalidate(nextValue)
    const removedOption = resolvedOptions.find((option) => option.value === optionValue)
    setAnnouncement(`Deselected: ${removedOption?.label ?? optionValue}`)
  }

  const handleBlur = (e: FocusEvent<HTMLButtonElement>) => {
    onBlur?.(e)
    fieldValidation.validate(currentValue ?? behavior.emptyValue)
  }

  const handleTypeahead = (char: string) => {
    typeaheadRef.current += char.toLowerCase()
    clearTimeout(typeaheadTimeoutRef.current)
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadRef.current = ''
    }, 500)

    const matchIndex = resolvedOptions.findIndex(
      (option) => !option.isDisabled && option.label.toLowerCase().startsWith(typeaheadRef.current),
    )
    if (matchIndex === -1) return
    if (!isOpen) openListbox()
    setActiveIndex(matchIndex)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    if (isSelectorDisabled) return
    switch (e.key) {
      case 'ArrowDown':
        handleArrowKey(e, 1)
        break
      case 'ArrowUp':
        handleArrowKey(e, -1)
        break
      case 'Home':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(enabledIndexes[0] ?? -1)
        }
        break
      case 'End':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) openListbox()
        else if (activeIndex !== -1) selectOption(resolvedOptions[activeIndex])
        break
      case 'Backspace':
        if (isMultiple && selectedValues.length > 0) {
          e.preventDefault()
          removeValue(selectedValues[selectedValues.length - 1])
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          closeListbox()
        }
        break
      default:
        if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
          handleTypeahead(e.key)
        }
        break
    }
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (isOpen) closeListbox()
    else openListbox()
  }

  const { effectiveTextColor, effectiveContentColor, effectiveLabelColor } = useFieldColors({
    hasError,
    color,
    variant,
    textColorClasses: LABEL_COLOR_CLASSES,
    errorTextColor: ERROR_TEXT_COLOR,
  })

  const hasOutsideContent = computeHasOutsideContent({
    startContent,
    startContentPlacement,
    endContent,
    endContentPlacement,
  })

  const arrowElement = !isArrowHidden && (
    <ArrowIcon isOpen={isOpen} size={size} colorClass={effectiveContentColor} className={slotClassName('arrow')}>
      {arrow}
    </ArrowIcon>
  )

  const hasChips = isMultiple && selectedValues.length > 0

  const triggerContent = (
    <>
      {arrowPlacement === 'start' && arrowElement}
      <ContentSlot
        content={startContent}
        placement={startContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('startContent'))}
      />
      {hasChips ? (
        <SelectionChips
          options={resolvedOptions}
          selectedValues={selectedValues}
          size={size}
          isDisabled={isSelectorDisabled}
          onRemove={removeValue}
          className={cn('flex-1', slotClassName('chips'))}
          chipClassName={slotClassName('chip')}
          chipLabelClassName={slotClassName('chipLabel')}
          chipRemoveButtonClassName={slotClassName('chipRemoveButton')}
        />
      ) : (
        <span className={cn('flex-1 truncate', !selectedOption && 'opacity-60', slotClassName('value'))}>
          {selectedOption?.label ?? placeholder}
        </span>
      )}
      {isLoading && <Spinner size={size} className={cn('shrink-0', slotClassName('spinner'))} />}
      <ContentSlot
        content={endContent}
        placement={endContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('endContent'))}
      />
      {arrowPlacement === 'end' && arrowElement}
    </>
  )

  const trigger = (
    <button
      ref={setTriggerNode}
      type="button"
      id={triggerId}
      disabled={isSelectorDisabled}
      role="combobox"
      aria-labelledby={label ? labelId : undefined}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={isOpen ? listboxId : undefined}
      aria-activedescendant={isOpen && activeIndex !== -1 ? optionId(activeIndex) : undefined}
      aria-required={isRequired || undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={ariaDescribedBy}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={cn(
        'flex w-full items-center text-left cursor-pointer transition-[border-color,background-color,box-shadow] duration-150',
        isMultiple ? MULTIPLE_TRIGGER_SIZE_CLASSES[size] : TRIGGER_SIZE_CLASSES[size],
        variant !== 'underlined' && RADIUS_CLASSES[radius],
        TRIGGER_VARIANT_COLOR_CLASSES[variant][color],
        hasError && ERROR_TRIGGER_CLASSES[variant],
        effectiveTextColor,
        isSelectorDisabled && 'opacity-50 cursor-not-allowed',
        slotClassName('trigger'),
      )}
      {...nativeProps}
    >
      {triggerContent}
    </button>
  )

  const wrapper = (
    <div className={cn('relative', hasOutsideContent && 'flex-1')}>
      {trigger}
      {isOpen && (
        <Listbox
          id={listboxId}
          listboxRef={listboxRef}
          isEmpty={resolvedOptions.length === 0}
          isMultiSelectable={isMultiple}
          noResultsMessage={resolvedNoResultsMessage}
          className={cn(RADIUS_CLASSES[radius], slotClassName('listbox'))}
        >
          {resolvedOptions.map((option, index) => (
            <OptionItem
              key={option.value}
              id={optionId(index)}
              option={option}
              isSelected={selectedValues.includes(option.value)}
              isActive={index === activeIndex}
              selectionIndicator={selectionIndicator}
              className={slotClassName('option')}
              onSelect={() => selectOption(option)}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </Listbox>
      )}
    </div>
  )

  const row = (
    <OutsideContentRow
      startContent={startContent}
      startContentPlacement={startContentPlacement}
      startClassName={cn(effectiveContentColor, slotClassName('startContent'))}
      endContent={endContent}
      endContentPlacement={endContentPlacement}
      endClassName={cn(effectiveContentColor, slotClassName('endContent'))}
      isFullWidth={isFullWidth}
    >
      {wrapper}
    </OutsideContentRow>
  )

  return (
    <FieldLayout
      className={className}
      baseClassName={slotClassName('base')}
      isFullWidth={isFullWidth}
      label={label}
      labelAssociation={{ id: labelId }}
      labelClassName={cn(effectiveLabelColor, slotClassName('label'))}
      isRequired={isRequired}
      description={description}
      descriptionId={descriptionId}
      descriptionClassName={slotClassName('description')}
      descriptionPlacement={descriptionPlacement}
      error={displayedError ?? undefined}
      errorId={errorId}
      errorClassName={slotClassName('error')}
      liveRegionText={announcement}
    >
      {row}
    </FieldLayout>
  )
}
