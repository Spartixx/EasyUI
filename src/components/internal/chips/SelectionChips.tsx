import { cn } from '../../../utils/cn'
import { CloseIcon } from '../icons'
import type { EasyUIBaseProps } from '../../../types/base'
import type { ListboxOption } from '../listbox'

const CHIP_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'gap-1 px-1.5 py-0.5 text-xs',
  md: 'gap-1 px-2 py-0.5 text-xs',
  lg: 'gap-1.5 px-2 py-1 text-sm',
}

const CHIP_REMOVE_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-3',
  lg: 'size-3.5',
}

interface SelectionChipsProps {
  options: ListboxOption[]
  selectedValues: string[]
  size: NonNullable<EasyUIBaseProps['size']>
  isDisabled: boolean
  onRemove: (optionValue: string) => void
  className?: string
  chipClassName?: string
  chipLabelClassName?: string
  chipRemoveButtonClassName?: string
}

export function SelectionChips({
  options,
  selectedValues,
  size,
  isDisabled,
  onRemove,
  className,
  chipClassName,
  chipLabelClassName,
  chipRemoveButtonClassName,
}: SelectionChipsProps) {
  return (
    <span className={cn('flex flex-wrap items-center gap-1 min-w-0', className)}>
      {selectedValues.map((selectedValue) => {
        const label = options.find((option) => option.value === selectedValue)?.label ?? selectedValue
        return (
          <span
            key={selectedValue}
            className={cn(
              'flex items-center max-w-full rounded-(--easyui-radius-sm) bg-(--easyui-color-default)/60',
              CHIP_SIZE_CLASSES[size],
              chipClassName,
            )}
          >
            <span className={cn('truncate', chipLabelClassName)}>{label}</span>
            {!isDisabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${label}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(selectedValue)
                }}
                className={cn(
                  'shrink-0 flex items-center cursor-pointer opacity-60 hover:opacity-100',
                  CHIP_REMOVE_SIZE_CLASSES[size],
                  chipRemoveButtonClassName,
                )}
              >
                <CloseIcon className="size-full" />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
