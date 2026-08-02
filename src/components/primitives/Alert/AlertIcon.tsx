import type { ComponentType, ReactNode } from 'react'
import type { WithVariantProps } from '../../../types/base'
import {
  InfoCircleIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  HexagonExclamationIcon,
} from '../../internal/icons'

const STATUS_ICONS: Record<
  NonNullable<WithVariantProps['color']>,
  ComponentType<{ className?: string }>
> = {
  default: InfoCircleIcon,
  primary: InfoCircleIcon,
  secondary: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: ShieldExclamationIcon,
  error: HexagonExclamationIcon,
}

interface AlertIconProps {
  color: NonNullable<WithVariantProps['color']>
  icon?: ReactNode
  wrapperClassName: string
  iconClassName: string
}

export function AlertIcon({ color, icon, wrapperClassName, iconClassName }: AlertIconProps) {
  const StatusIcon = STATUS_ICONS[color]

  return (
    <span className={wrapperClassName}>
      <span className={iconClassName}>{icon ?? <StatusIcon className="size-full" />}</span>
    </span>
  )
}
