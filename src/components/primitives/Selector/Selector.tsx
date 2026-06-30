import { forwardRef, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { SelectorOption as SelectorOptionData, SelectorProps } from './Selector.types'
import { cn } from '../../../utils/cn'
import { RADIUS_CLASSES, LABEL_COLOR_CLASSES } from '../../../utils/class-maps'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { Spinner } from '../spinners/Spinner'
import { ArrowIcon } from '../../internal/icons'
import { Listbox, OptionItem, useListboxNavigation } from '../../internal/listbox'
import { ContentSlot, OutsideContentRow, hasOutsideContent as computeHasOutsideContent } from '../../internal/content'
import { useControllableValue, useFieldIds, useFieldDescribedBy, useFieldColors, FieldLayout } from '../../internal/field'

const TRIGGER_SIZE_CLASSES: Record<NonNullable<SelectorProps['size']>, string> = {
  sm: 'h-8 px-3 gap-1.5 text-xs',
  md: 'h-10 px-3 gap-2 text-sm',
  lg: 'h-12 px-4 gap-2 text-base',
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

export const Selector = forwardRef<HTMLButtonElement, SelectorProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('selector', preset)

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
    arrow,
    arrowPlacement = 'end',
    isArrowHidden = false,
    onKeyDown,
    onClick,
    onBlur,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const { fieldId: triggerId, listboxId, descriptionId, errorId, optionId } = useFieldIds(idProp)

  const [currentValue, setValue] = useControllableValue(value, defaultValue)

  const [announcement, setAnnouncement] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const typeaheadRef = useRef('')
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('selector', classNames, presetClassNames, presetConfig?.className)

  const isSelectorDisabled = isDisabled || isLoading

  const selectedOption = options.find((option) => option.value === currentValue)
  const hasError = !!error
  const { ariaDescribedBy } = useFieldDescribedBy({ hasError, description, descriptionPlacement, descriptionId, errorId })

  const { isOpen, activeIndex, setActiveIndex, enabledIndexes, openListbox, closeListbox, handleArrowKey } =
    useListboxNavigation({ options, currentValue, triggerRef, listboxRef, optionId })

  const selectOption = (option: SelectorOptionData) => {
    setValue(option.value)
    onValueChange?.(option.value)
    setAnnouncement(`Selected: ${option.label}`)
    closeListbox()
  }

  const handleTypeahead = (char: string) => {
    typeaheadRef.current += char.toLowerCase()
    clearTimeout(typeaheadTimeoutRef.current)
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadRef.current = ''
    }, 500)

    const matchIndex = options.findIndex(
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
        else if (activeIndex !== -1) selectOption(options[activeIndex])
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
    if (isSelectorDisabled) return
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

  const triggerContent = (
    <>
      {arrowPlacement === 'start' && arrowElement}
      <ContentSlot
        content={startContent}
        placement={startContentPlacement}
        show="inside"
        className={cn(effectiveContentColor, slotClassName('startContent'))}
      />
      <span className={cn('flex-1 truncate', !selectedOption && 'opacity-60', slotClassName('value'))}>
        {selectedOption?.label ?? placeholder}
      </span>
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
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      type="button"
      id={triggerId}
      disabled={isSelectorDisabled}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={isOpen ? listboxId : undefined}
      aria-activedescendant={isOpen && activeIndex !== -1 ? optionId(activeIndex) : undefined}
      aria-required={isRequired || undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={ariaDescribedBy}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      className={cn(
        'flex w-full items-center text-left cursor-pointer transition-[border-color,background-color,box-shadow] duration-150',
        TRIGGER_SIZE_CLASSES[size],
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
          className={cn(RADIUS_CLASSES[radius], slotClassName('listbox'))}
        >
          {options.map((option, index) => (
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
      labelHtmlFor={triggerId}
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

Selector.displayName = 'Selector'
