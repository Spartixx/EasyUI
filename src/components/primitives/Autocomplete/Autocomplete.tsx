import { forwardRef, useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import type { AutocompleteOption as AutocompleteOptionData, AutocompleteProps } from './Autocomplete.types'
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
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Spinner } from '../spinners/Spinner'
import { ArrowIcon } from '../../internal/icons'
import { Listbox, OptionItem, useListboxNavigation } from '../../internal/listbox'
import { ContentSlot, OutsideContentRow, hasOutsideContent as computeHasOutsideContent } from '../../internal/content'
import { useControllableValue, useFieldIds, useFieldDescribedBy, useFieldColors, FieldLayout } from '../../internal/field'

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('autocomplete', preset)

  const {
    id: idProp,
    className,
    classNames,
    label,
    description,
    descriptionPlacement = 'element',
    error,
    options,
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
    isLoading = false,
    isFullWidth = false,
    startContent,
    endContent,
    startContentPlacement = 'inside',
    endContentPlacement = 'inside',
    noResultsMessage,
    arrow,
    arrowPlacement = 'end',
    isArrowHidden = false,
    onKeyDown,
    onFocus,
    onBlur,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const { fieldId: inputId, listboxId, descriptionId, errorId, optionId } = useFieldIds(idProp)

  const [currentValue, setValue] = useControllableValue(value, defaultValue)
  const committedOption = options.find((option) => option.value === currentValue)

  const [typedText, setTypedText] = useState('')
  const [isUserTyping, setIsUserTyping] = useState(false)
  const displayedValue = isUserTyping ? typedText : (committedOption?.label ?? '')
  const [announcement, setAnnouncement] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)

  const { defaults } = useEasyUIConfig()

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('autocomplete', classNames, presetClassNames, presetConfig?.className)

  const resolvedNoResultsMessage = noResultsMessage ?? defaults?.autocomplete?.noResultsMessage

  const isAutocompleteDisabled = isDisabled || isLoading

  const hasError = !!error
  const { ariaDescribedBy } = useFieldDescribedBy({ hasError, description, descriptionPlacement, descriptionId, errorId })

  const filteredOptions = isUserTyping
    ? options.filter((option) => option.label.toLowerCase().includes(typedText.toLowerCase().trim()))
    : options

  const revertInputText = () => {
    setIsUserTyping(false)
  }

  const { isOpen, activeIndex, setActiveIndex, enabledIndexes, openListbox, closeListbox, handleArrowKey } =
    useListboxNavigation({
      options: filteredOptions,
      currentValue,
      triggerRef: inputRef,
      listboxRef,
      optionId,
      onOutsideClose: revertInputText,
    })

  const selectOption = (option: AutocompleteOptionData) => {
    setValue(option.value)
    onValueChange?.(option.value)
    setIsUserTyping(false)
    setAnnouncement(`Selected: ${option.label}`)
    closeListbox()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypedText(e.target.value)
    setIsUserTyping(true)
    if (!isOpen) openListbox()
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (isAutocompleteDisabled) return
    switch (e.key) {
      case 'ArrowDown':
        handleArrowKey(e, 1)
        break
      case 'ArrowUp':
        handleArrowKey(e, -1)
        break
      case 'Home':
        if (isOpen) setActiveIndex(enabledIndexes[0] ?? -1)
        break
      case 'End':
        if (isOpen) setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1)
        break
      case 'Enter':
        if (isOpen && activeIndex !== -1) {
          e.preventDefault()
          selectOption(filteredOptions[activeIndex])
        }
        break
      case 'Escape':
        if (isOpen || isUserTyping) {
          e.preventDefault()
          revertInputText()
          closeListbox()
        }
        break
      default:
        break
    }
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
    if (!isAutocompleteDisabled) openListbox()
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    if (isAutocompleteDisabled) return
    revertInputText()
    closeListbox()
  }

  const { effectiveTextColor, effectiveContentColor, effectiveLabelColor } = useFieldColors({
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

  const arrowElement = !isArrowHidden && (
    <ArrowIcon
      isOpen={isOpen}
      size={size}
      colorClass={effectiveContentColor}
      className={slotClassName('arrow')}
      cursorPointer={!isAutocompleteDisabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => !isAutocompleteDisabled && inputRef.current?.focus()}
    >
      {arrow}
    </ArrowIcon>
  )

  const inputContent = (
    <>
      {arrowPlacement === 'start' && arrowElement}
      <ContentSlot
        content={startContent}
        placement={startContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('startContent'))}
      />
      <input
        ref={(node) => {
          inputRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        id={inputId}
        disabled={isAutocompleteDisabled}
        required={isRequired}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen && activeIndex !== -1 ? optionId(activeIndex) : undefined}
        aria-required={isRequired || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={ariaDescribedBy}
        value={displayedValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 bg-transparent outline-none min-w-0',
          TEXT_FIELD_TEXT_SIZE_CLASSES[size],
          effectiveTextColor,
          isAutocompleteDisabled && 'cursor-not-allowed',
          slotClassName('input'),
        )}
        {...nativeProps}
      />
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

  const inputWrapper = (
    <div
      className={cn(
        'flex items-center overflow-hidden transition-[border-color,background-color,box-shadow] duration-150',
        TEXT_FIELD_WRAPPER_SIZE_CLASSES[size],
        variant !== 'underlined' && RADIUS_CLASSES[radius],
        TEXT_FIELD_WRAPPER_VARIANT_COLOR_CLASSES[variant][color],
        hasError && TEXT_FIELD_ERROR_WRAPPER_CLASSES[variant],
        isAutocompleteDisabled && 'opacity-50 cursor-not-allowed',
        !hasOutsideContent && isFullWidth && 'w-full',
        hasOutsideContent && 'flex-1',
        slotClassName('inputWrapper'),
      )}
    >
      {inputContent}
    </div>
  )

  const wrapper = (
    <div className={cn('relative', hasOutsideContent && 'flex-1')}>
      {inputWrapper}
      {isOpen && (
        <Listbox
          id={listboxId}
          listboxRef={listboxRef}
          isEmpty={filteredOptions.length === 0}
          noResultsMessage={resolvedNoResultsMessage}
          className={cn(RADIUS_CLASSES[radius], slotClassName('listbox'))}
        >
          {filteredOptions.map((option, index) => (
            <OptionItem
              key={option.value}
              id={optionId(index)}
              option={option}
              isSelected={option.value === currentValue}
              isActive={index === activeIndex}
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
      labelHtmlFor={inputId}
      labelClassName={cn(effectiveLabelColor, slotClassName('label'))}
      isRequired={isRequired}
      description={description}
      descriptionId={descriptionId}
      descriptionClassName={slotClassName('description')}
      descriptionPlacement={descriptionPlacement}
      error={error}
      errorId={errorId}
      errorClassName={slotClassName('error')}
      liveRegionText={announcement}
    >
      {row}
    </FieldLayout>
  )
})

Autocomplete.displayName = 'Autocomplete'
