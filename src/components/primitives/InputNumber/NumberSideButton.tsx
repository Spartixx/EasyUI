import type { MouseEvent } from 'react'
import { cn } from '../../../utils/cn'
import { PlusIcon, MinusIcon } from '../../internal/icons'
import type { EasyUIBaseProps } from '../../../types/base'
import type { NumberStepDirection } from '../../internal/field'

const SIDE_BUTTON_ICON_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
}

const SIDE_BUTTON_PADDING_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'px-2.5',
  md: 'px-3',
  lg: 'px-3.5',
}

const SIDE_BUTTON_EDGE_OFFSET_CLASSES: Record<'start' | 'end', Record<NonNullable<EasyUIBaseProps['size']>, string>> = {
  start: { sm: '-ml-3', md: '-ml-3', lg: '-ml-4' },
  end: { sm: '-mr-3', md: '-mr-3', lg: '-mr-4' },
}

interface NumberSideButtonProps {
  direction: NumberStepDirection
  placement: 'start' | 'end'
  size: NonNullable<EasyUIBaseProps['size']>
  colorClass: string
  dividerClass: string
  isDisabled?: boolean
  isStepDisabled?: boolean
  onStep: (direction: NumberStepDirection) => void
  className?: string
}

export function NumberSideButton({
  direction,
  placement,
  size,
  colorClass,
  dividerClass,
  isDisabled,
  isStepDisabled,
  onStep,
  className,
}: NumberSideButtonProps) {
  const preventFocusSteal = (e: MouseEvent) => e.preventDefault()
  const isButtonDisabled = !!isDisabled || !!isStepDisabled
  const Icon = direction === 'increment' ? PlusIcon : MinusIcon

  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={isButtonDisabled}
      onMouseDown={preventFocusSteal}
      onClick={() => onStep(direction)}
      aria-hidden="true"
      className={cn(
        'group shrink-0 flex items-center justify-center self-stretch cursor-pointer disabled:cursor-not-allowed',
        'border-solid',
        dividerClass,
        placement === 'start'
          ? cn('border-r-(length:--easyui-border-width-md)', SIDE_BUTTON_EDGE_OFFSET_CLASSES.start[size])
          : cn('border-l-(length:--easyui-border-width-md)', SIDE_BUTTON_EDGE_OFFSET_CLASSES.end[size]),
        SIDE_BUTTON_PADDING_CLASSES[size],
        isDisabled && 'pointer-events-none',
        colorClass,
        className,
      )}
    >
      <Icon
        className={cn(
          SIDE_BUTTON_ICON_SIZE_CLASSES[size],
          'transition-[opacity,scale] duration-150',
          isButtonDisabled ? 'opacity-30' : 'opacity-60 group-hover:opacity-100 group-hover:scale-125',
        )}
      />
    </button>
  )
}
