import { cn } from '../../../utils/cn'
import type { SelectorOption as SelectorOptionData } from './Selector.types'

interface SelectorOptionProps {
  id: string
  option: SelectorOptionData
  isSelected: boolean
  isActive: boolean
  className?: string
  onSelect: () => void
  onActivate: () => void
}

export function SelectorOption({ id, option, isSelected, isActive, className, onSelect, onActivate }: SelectorOptionProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.isDisabled || undefined}
      onMouseMove={() => !option.isDisabled && onActivate()}
      onClick={() => !option.isDisabled && onSelect()}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none',
        isActive && !option.isDisabled && 'bg-(--easyui-color-primary)/10',
        isSelected && 'font-medium',
        option.isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {option.startContent && <span className="shrink-0 flex items-center">{option.startContent}</span>}
      <span className="flex flex-col flex-1 min-w-0">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="text-xs text-(--easyui-color-default-foreground)/60 truncate">{option.description}</span>
        )}
      </span>
      {option.endContent && <span className="shrink-0 flex items-center">{option.endContent}</span>}
    </li>
  )
}
