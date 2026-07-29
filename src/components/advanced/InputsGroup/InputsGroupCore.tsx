import { useId, useRef, useState } from 'react'
import type { ReactNode, Ref } from 'react'
import { cn } from '../../../utils/cn'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Button } from '../../primitives'
import type { ButtonProps } from '../../primitives'
import { PlusIcon, CloseIcon } from '../../internal/icons'
import type { EasyUIBaseProps } from '../../../types/base'
import type { InputsGroupSlots, RenderRemoveButtonParams } from './InputsGroup.types'

interface RenderInputParams<TValue> {
  id?: string
  value: TValue
  onValueChange: (value: TValue) => void
  isRequired: boolean
  isRequiredMessage?: string
  validations?: Array<(value: TValue) => string | null>
  isDisabled: boolean
  size: NonNullable<EasyUIBaseProps['size']>
  error?: string
  className: string
}

interface InputsGroupCoreProps<TValue, TNonEmpty extends TValue>
  extends EasyUIBaseProps<InputsGroupSlots> {
  containerRef?: Ref<HTMLDivElement>
  emptyValue: TValue
  isNonEmpty: (value: TValue) => value is TNonEmpty
  renderInput: (params: RenderInputParams<TValue>) => ReactNode
  initialValues?: Array<{ isRequired?: boolean; value: TValue }>
  onValuesChange?: (values: TValue[]) => void
  onNonEmptyValuesChange?: (values: TNonEmpty[]) => void
  validations?: Array<(value: TValue) => string | null>
  label?: string
  description?: string
  error?: string
  isRequiredMessage?: string
  removeButtonPlacement?: 'left' | 'right'
  maxItems?: number
  addButtonLabel?: string
  addButtonPlacement?: 'left' | 'right' | 'full-width'
  isAddButtonHidden?: boolean
  addButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>
  removeButtonProps?: Omit<ButtonProps, 'onClick'>
  renderRemoveButton?: (params: RenderRemoveButtonParams) => ReactNode
}

interface Line<TValue> {
  id: string
  value: TValue
  isProtected: boolean
}

export function InputsGroupCore<TValue, TNonEmpty extends TValue>(
  rawProps: InputsGroupCoreProps<TValue, TNonEmpty>,
) {
  const { preset, ...restProps } = rawProps
  const presetConfig = usePreset('inputsGroup', preset)
  const merged = { ...presetConfig?.props, ...restProps } as InputsGroupCoreProps<TValue, TNonEmpty>

  const {
    containerRef,
    emptyValue,
    isNonEmpty,
    renderInput,
    initialValues,
    onValuesChange,
    onNonEmptyValuesChange,
    validations,
    label,
    description,
    error,
    isRequiredMessage,
    size = 'md',
    isDisabled = false,
    isFullWidth = false,
    className,
    classNames,
    removeButtonPlacement = 'right',
    maxItems,
    addButtonLabel,
    addButtonPlacement = 'full-width',
    isAddButtonHidden = false,
    addButtonProps,
    removeButtonProps,
    renderRemoveButton,
  } = merged

  const { defaults } = useEasyUIConfig()
  const resolvedAddLabel = addButtonLabel ?? defaults?.inputsGroup?.addLabel ?? 'Add'

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('inputsGroup', classNames, presetClassNames, presetConfig?.className)

  const generatedId = useId()
  const addedCounter = useRef(0)
  const [lines, setLines] = useState<Line<TValue>[]>(() =>
    (initialValues ?? []).map((entry, index) => ({
      id: `initial-${index}`,
      value: entry.value,
      isProtected: !!entry.isRequired,
    })),
  )

  const emit = (nextLines: Line<TValue>[]) => {
    const rawValues = nextLines.map((line) => line.value)
    onValuesChange?.(rawValues)
    onNonEmptyValuesChange?.(rawValues.filter(isNonEmpty))
  }

  const setLineValue = (id: string, value: TValue) => {
    const nextLines = lines.map((line) => (line.id === id ? { ...line, value } : line))
    setLines(nextLines)
    emit(nextLines)
  }

  const addLine = () => {
    if (maxItems !== undefined && lines.length >= maxItems) return
    const nextLines = [
      ...lines,
      { id: `added-${addedCounter.current++}`, value: emptyValue, isProtected: false },
    ]
    setLines(nextLines)
    emit(nextLines)
  }

  const removeLine = (id: string) => {
    const nextLines = lines.filter((line) => line.id !== id)
    setLines(nextLines)
    emit(nextLines)
  }

  const isAtMax = maxItems !== undefined && lines.length >= maxItems
  const firstInputId = lines.length > 0 ? `${generatedId}-0` : undefined
  const isFirstLineRequired = lines[0]?.isProtected ?? false
  const protectedCount = lines.filter((line) => line.isProtected).length
  const isFixedList = maxItems !== undefined && protectedCount >= maxItems
  const showAddButton = !isAddButtonHidden && !isFixedList

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-3', isFullWidth && 'w-full', slotClassName('base'), className)}
    >
      {(label || description) && (
        <div className={cn('flex flex-col gap-1', slotClassName('header'))}>
          {label && (
            <label
              htmlFor={firstInputId}
              className={cn('text-sm font-medium text-(--easyui-color-foreground)', slotClassName('label'))}
            >
              {label}
              {isFirstLineRequired && (
                <span aria-hidden="true" className="text-(--easyui-color-error) ml-0.5">
                  *
                </span>
              )}
            </label>
          )}
          {description && (
            <p className={cn('text-xs text-(--easyui-color-foreground)/60', slotClassName('description'))}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn('flex flex-col gap-3', slotClassName('items'))}>
        {lines.map((line, index) => {
          const removeButton = line.isProtected ? null : renderRemoveButton ? (
            renderRemoveButton({
              onRemove: () => removeLine(line.id),
              index,
              isDisabled,
            })
          ) : (
            <Button
              type="button"
              size={size}
              variant="outlined"
              color="default"
              isDisabled={isDisabled}
              onClick={() => removeLine(line.id)}
              aria-label="Remove"
              className={cn('shrink-0', slotClassName('removeButton'))}
              {...removeButtonProps}
            >
              <CloseIcon className="size-4" />
            </Button>
          )

          return (
            <div key={line.id} className={cn('flex items-start gap-2', slotClassName('item'))}>
              {removeButtonPlacement === 'left' && removeButton}
              <div className="flex-1 min-w-0">
                {renderInput({
                  id: index === 0 ? firstInputId : undefined,
                  value: line.value,
                  onValueChange: (value) => setLineValue(line.id, value),
                  isRequired: line.isProtected,
                  isRequiredMessage,
                  validations,
                  isDisabled,
                  size,
                  error: index === 0 ? error : undefined,
                  className: slotClassName('input'),
                })}
              </div>
              {removeButtonPlacement === 'right' && removeButton}
            </div>
          )
        })}
      </div>
      {showAddButton && (
        <div className={cn('flex', addButtonPlacement === 'right' && 'justify-end')}>
          <Button
            type="button"
            size={size}
            variant="outlined"
            color="default"
            isDisabled={isDisabled || isAtMax}
            isFullWidth={addButtonPlacement === 'full-width'}
            onClick={addLine}
            startContent={<PlusIcon className="size-4" />}
            className={slotClassName('addButton')}
            {...addButtonProps}
          >
            {resolvedAddLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
