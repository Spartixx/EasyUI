import type { MouseEvent } from 'react'
import { cn } from '../../../utils/cn'
import { ChevronDownIcon } from '../icons'
import type { EasyUIBaseProps } from '../../../types/base'

export type NumberStepDirection = 'increment' | 'decrement'

const STEPPER_ICON_SIZE_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
}

const STEPPER_EDGE_OFFSET_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: '-mr-3',
  md: '-mr-3',
  lg: '-mr-4',
}

const STEPPER_BUTTON_PADDING_CLASSES: Record<NonNullable<EasyUIBaseProps['size']>, string> = {
  sm: 'pl-1.5 pr-3',
  md: 'pl-1.5 pr-3',
  lg: 'pl-2 pr-4',
}

interface NumberStepperProps {
  size: NonNullable<EasyUIBaseProps['size']>
  colorClass: string
  isDisabled?: boolean
  isIncrementDisabled?: boolean
  isDecrementDisabled?: boolean
  onStep: (direction: NumberStepDirection) => void
  className?: string
  incrementClassName?: string
  decrementClassName?: string
}

export function NumberStepper({
  size,
  colorClass,
  isDisabled,
  isIncrementDisabled,
  isDecrementDisabled,
  onStep,
  className,
  incrementClassName,
  decrementClassName,
}: NumberStepperProps) {
  const preventFocusSteal = (e: MouseEvent) => e.preventDefault()

  const renderButton = (direction: NumberStepDirection, iconTransform: string, isButtonDisabled: boolean, slotClassName?: string) => (
    <button
      type="button"
      tabIndex={-1}
      disabled={isButtonDisabled}
      onMouseDown={preventFocusSteal}
      onClick={() => onStep(direction)}
      className={cn(
        'group flex flex-1 items-center justify-center min-h-0 cursor-pointer disabled:cursor-not-allowed',
        STEPPER_BUTTON_PADDING_CLASSES[size],
        slotClassName,
      )}
    >
      <ChevronDownIcon
        className={cn(
          iconTransform,
          STEPPER_ICON_SIZE_CLASSES[size],
          'transition-[opacity,scale] duration-150',
          isButtonDisabled ? 'opacity-30' : 'opacity-60 group-hover:opacity-100 group-hover:scale-125',
        )}
      />
    </button>
  )

  return (
    <span
      aria-hidden="true"
      className={cn(
        'shrink-0 flex flex-col self-stretch justify-center',
        STEPPER_EDGE_OFFSET_CLASSES[size],
        isDisabled && 'pointer-events-none',
        colorClass,
        className,
      )}
    >
      {renderButton('increment', 'rotate-180 translate-y-1', !!isDisabled || !!isIncrementDisabled, incrementClassName)}
      {renderButton('decrement', '-translate-y-1', !!isDisabled || !!isDecrementDisabled, decrementClassName)}
    </span>
  )
}
