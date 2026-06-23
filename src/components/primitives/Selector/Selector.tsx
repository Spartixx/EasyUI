import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { SelectorOption as SelectorOptionData, SelectorProps } from './Selector.types'
import { cn } from '../../../utils/cn'
import { RADIUS_CLASSES } from '../../../utils/variants'
import { useSlotClassNames } from '../../../hooks'
import { usePreset } from '../../../hooks'
import { Spinner } from '../spinners/Spinner'
import { SelectorListbox } from './SelectorListbox'
import { SelectorOption } from './SelectorOption'

const TRIGGER_SIZE_CLASSES: Record<NonNullable<SelectorProps['size']>, string> = {
  sm: 'h-8 px-3 gap-1.5 text-xs',
  md: 'h-10 px-3 gap-2 text-sm',
  lg: 'h-12 px-4 gap-2 text-base',
}

const ARROW_SIZE_CLASSES: Record<NonNullable<SelectorProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-6',
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const VALUE_TEXT_COLOR_CLASSES: Record<NonNullable<SelectorProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark)',
}

const CONTENT_TEXT_COLOR_CLASSES: Record<NonNullable<SelectorProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)/60',
  primary: 'text-(--easyui-color-primary-dark)/60',
  secondary: 'text-(--easyui-color-secondary-dark)/60',
  success: 'text-(--easyui-color-success-dark)/60',
  warning: 'text-(--easyui-color-warning-dark)/60',
  error: 'text-(--easyui-color-error-dark)/60',
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

const LABEL_COLOR_CLASSES: Record<NonNullable<SelectorProps['color']>, string> = {
  default: 'text-(--easyui-color-default-foreground)',
  primary: 'text-(--easyui-color-primary-dark)',
  secondary: 'text-(--easyui-color-secondary-dark)',
  success: 'text-(--easyui-color-success-dark)',
  warning: 'text-(--easyui-color-warning-dark)',
  error: 'text-(--easyui-color-error-dark)',
}

const ERROR_TEXT_COLOR = 'text-(--easyui-color-error-dark)'
const ERROR_CONTENT_COLOR = 'text-(--easyui-color-error-dark)/60'

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

  const generatedId = useId()
  const triggerId = idProp ?? generatedId
  const listboxId = `${triggerId}-listbox`
  const descriptionId = `${triggerId}-description`
  const errorId = `${triggerId}-error`
  const optionId = (index: number) => `${listboxId}-option-${index}`

  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
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
  const showsDescription = !!description && (descriptionPlacement === 'label' || !hasError)
  const ariaDescribedBy =
    [showsDescription && descriptionId, hasError && errorId].filter(Boolean).join(' ') || undefined

  const enabledIndexes = options.reduce<number[]>((acc, option, index) => {
    if (!option.isDisabled) acc.push(index)
    return acc
  }, [])

  const openListbox = () => {
    const selectedIndex = options.findIndex((option) => option.value === currentValue)
    setActiveIndex(selectedIndex !== -1 ? selectedIndex : (enabledIndexes[0] ?? -1))
    setIsOpen(true)
  }

  const closeListbox = () => {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const selectOption = (option: SelectorOptionData) => {
    if (value === undefined) setInternalValue(option.value)
    onValueChange?.(option.value)
    setAnnouncement(`Selected: ${option.label}`)
    closeListbox()
  }

  const moveActiveIndex = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return
    const currentPos = enabledIndexes.indexOf(activeIndex)
    const nextPos = Math.min(Math.max(currentPos + direction, 0), enabledIndexes.length - 1)
    setActiveIndex(enabledIndexes[nextPos])
  }

  useEffect(() => {
    if (!isOpen || activeIndex === -1) return
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (listboxRef.current?.contains(target)) return
      closeListbox()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

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
    if (!isOpen) setIsOpen(true)
    setActiveIndex(matchIndex)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    if (isSelectorDisabled) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (isOpen) moveActiveIndex(1)
        else openListbox()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) moveActiveIndex(-1)
        else openListbox()
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

  const coloredVariant = variant !== 'bordered'
  const effectiveTextColor = hasError ? ERROR_TEXT_COLOR : VALUE_TEXT_COLOR_CLASSES[coloredVariant ? color : 'default']
  const effectiveContentColor = hasError ? ERROR_CONTENT_COLOR : CONTENT_TEXT_COLOR_CLASSES[coloredVariant ? color : 'default']
  const effectiveLabelColor = hasError ? 'text-(--easyui-color-error-dark)' : LABEL_COLOR_CLASSES[coloredVariant ? color : 'default']

  const hasOutsideContent =
    (!!startContent && startContentPlacement === 'outside') || (!!endContent && endContentPlacement === 'outside')

  const arrowElement = !isArrowHidden && (
    <span
      className={cn(
        'shrink-0 flex items-center transition-transform duration-150',
        isOpen && 'rotate-180',
        effectiveContentColor,
        slotClassName('arrow'),
      )}
    >
      {arrow ?? <ChevronDownIcon className={ARROW_SIZE_CLASSES[size]} />}
    </span>
  )

  const triggerContent = (
    <>
      {arrowPlacement === 'start' && arrowElement}
      {startContent && startContentPlacement === 'inside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('startContent'))}>
          {startContent}
        </span>
      )}
      <span className={cn('flex-1 truncate', !selectedOption && 'opacity-60', slotClassName('value'))}>
        {selectedOption?.label ?? placeholder}
      </span>
      {isLoading && <Spinner size={size} className={cn('shrink-0', slotClassName('spinner'))} />}
      {endContent && endContentPlacement === 'inside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('endContent'))}>
          {endContent}
        </span>
      )}
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
        <SelectorListbox
          id={listboxId}
          listboxRef={listboxRef}
          className={cn(RADIUS_CLASSES[radius], slotClassName('listbox'))}
        >
          {options.map((option, index) => (
            <SelectorOption
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
        </SelectorListbox>
      )}
    </div>
  )

  const row = !hasOutsideContent ? (
    wrapper
  ) : (
    <span className={cn('flex items-center gap-2', isFullWidth && 'w-full')}>
      {startContent && startContentPlacement === 'outside' && (
        <span className={cn('shrink-0 flex items-center', effectiveContentColor, slotClassName('startContent'))}>
          {startContent}
        </span>
      )}
      {wrapper}
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
      {label && (
        <label htmlFor={triggerId} className={cn('text-sm font-medium', effectiveLabelColor, slotClassName('label'))}>
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
              *
            </span>
          )}
        </label>
      )}
      {descriptionPlacement === 'label' && descriptionElement}
      {row}
      {error ? (
        <span id={errorId} role="alert" className={cn('text-xs text-(--easyui-color-error)', slotClassName('error'))}>
          {error}
        </span>
      ) : (
        descriptionPlacement === 'element' && descriptionElement
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  )
})

Selector.displayName = 'Selector'
