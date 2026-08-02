import { forwardRef, useState } from 'react'
import type { AlertProps, AlertVariant } from './Alert.types'
import { cn } from '../../../utils/cn'
import { RADIUS_CLASSES, SURFACE_VARIANT_COLOR_CLASSES } from '../../../utils/class-maps'
import { useSlotClassNames } from '../../../hooks/useSlotClassNames'
import { usePreset } from '../../../hooks/usePreset'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import type { EasyUIBaseProps } from '../../../types/base'
import { AlertIcon } from './AlertIcon'
import { AlertCloseButton } from './AlertCloseButton'

type AlertSize = NonNullable<EasyUIBaseProps['size']>
type AlertColor = NonNullable<AlertProps['color']>

const ALERT_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'px-3 py-2 gap-x-2 gap-y-0.5',
  md: 'px-4 py-3 gap-x-3 gap-y-1',
  lg: 'px-5 py-4 gap-x-4 gap-y-1.5',
}

const ALERT_TITLE_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const ALERT_DESCRIPTION_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const ALERT_ICON_WRAPPER_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}

const ALERT_STATUS_ICON_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-7',
}

const ALERT_CLOSE_ICON_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const ALERT_ICON_BORDER_CLASSES: Record<AlertColor, string> = {
  default: 'border-(--easyui-color-default-dark)/10',
  primary: 'border-(--easyui-color-primary-dark)/10',
  secondary: 'border-(--easyui-color-secondary-dark)/10',
  success: 'border-(--easyui-color-success-dark)/10',
  warning: 'border-(--easyui-color-warning-dark)/10',
  error: 'border-(--easyui-color-error-dark)/10',
}

const ALERT_FLAT_CLASSES: Record<AlertColor, string> = {
  default: 'bg-(--easyui-color-default)/20 text-(--easyui-color-default-foreground)',
  primary: 'bg-(--easyui-color-primary)/10 text-(--easyui-color-primary-dark)',
  secondary: 'bg-(--easyui-color-secondary)/10 text-(--easyui-color-secondary-dark)',
  success: 'bg-(--easyui-color-success)/10 text-(--easyui-color-success-dark)',
  warning: 'bg-(--easyui-color-warning)/10 text-(--easyui-color-warning-dark)',
  error: 'bg-(--easyui-color-error)/10 text-(--easyui-color-error-dark)',
}

const RING = 'inset-ring-[length:var(--easyui-border-width-md)]'

const ALERT_OUTLINED_CLASSES: Record<AlertColor, string> = {
  default: `${RING} inset-ring-(--easyui-color-default) text-(--easyui-color-default-foreground)`,
  primary: `${RING} inset-ring-(--easyui-color-primary) text-(--easyui-color-primary)`,
  secondary: `${RING} inset-ring-(--easyui-color-secondary) text-(--easyui-color-secondary)`,
  success: `${RING} inset-ring-(--easyui-color-success) text-(--easyui-color-success)`,
  warning: `${RING} inset-ring-(--easyui-color-warning) text-(--easyui-color-warning)`,
  error: `${RING} inset-ring-(--easyui-color-error) text-(--easyui-color-error)`,
}

const ALERT_FADED_CLASSES: Record<AlertColor, string> = {
  default: `${RING} inset-ring-(--easyui-color-default)/40 bg-(--easyui-color-default)/20 text-(--easyui-color-default-foreground)`,
  primary: `${RING} inset-ring-(--easyui-color-primary)/40 bg-(--easyui-color-primary)/10 text-(--easyui-color-primary-dark)`,
  secondary: `${RING} inset-ring-(--easyui-color-secondary)/40 bg-(--easyui-color-secondary)/10 text-(--easyui-color-secondary-dark)`,
  success: `${RING} inset-ring-(--easyui-color-success)/40 bg-(--easyui-color-success)/10 text-(--easyui-color-success-dark)`,
  warning: `${RING} inset-ring-(--easyui-color-warning)/40 bg-(--easyui-color-warning)/10 text-(--easyui-color-warning-dark)`,
  error: `${RING} inset-ring-(--easyui-color-error)/40 bg-(--easyui-color-error)/10 text-(--easyui-color-error-dark)`,
}

const ALERT_ICON_BACKGROUND_CLASSES: Record<AlertColor, string> = {
  default: 'bg-(--easyui-color-default)/20',
  primary: 'bg-(--easyui-color-primary)/10',
  secondary: 'bg-(--easyui-color-secondary)/10',
  success: 'bg-(--easyui-color-success)/10',
  warning: 'bg-(--easyui-color-warning)/10',
  error: 'bg-(--easyui-color-error)/10',
}

const ALERT_SURFACE_CLASSES: Record<AlertVariant, Record<AlertColor, string>> = {
  solid: SURFACE_VARIANT_COLOR_CLASSES.solid,
  outlined: ALERT_OUTLINED_CLASSES,
  flat: ALERT_FLAT_CLASSES,
  faded: ALERT_FADED_CLASSES,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>((rawProps, ref) => {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('alert', preset)

  const {
    title,
    description,
    className,
    classNames,
    size = 'md',
    variant = 'flat',
    color = 'default',
    radius = 'md',
    isClosable = false,
    onClose,
    icon,
    closeIcon,
    closeButtonLabel,
    isIconHidden = false,
    isIconWrapperHidden = false,
    endContent,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('alert', classNames, presetClassNames, presetConfig?.className)

  const { defaults } = useEasyUIConfig()
  const resolvedCloseLabel = closeButtonLabel ?? defaults?.alert?.closeButtonLabel ?? 'Close'

  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const hasIconColumn = !isIconHidden
  const hasTrailingColumn = !!endContent || isClosable
  const hasIconWrapperBox = !isIconWrapperHidden
  const hasIconRing = hasIconWrapperBox && variant !== 'solid'

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'w-full grid items-center',
        hasIconColumn && hasTrailingColumn && 'grid-cols-[auto_1fr_auto]',
        hasIconColumn && !hasTrailingColumn && 'grid-cols-[auto_1fr]',
        !hasIconColumn && hasTrailingColumn && 'grid-cols-[1fr_auto]',
        !hasIconColumn && !hasTrailingColumn && 'grid-cols-[1fr]',
        ALERT_SIZE_CLASSES[size],
        RADIUS_CLASSES[radius],
        ALERT_SURFACE_CLASSES[variant][color],
        slotClassName('base'),
        className,
      )}
      {...nativeProps}
    >
      {hasIconColumn && (
        <AlertIcon
          color={color}
          icon={icon}
          wrapperClassName={cn(
            'shrink-0 flex items-center justify-center',
            hasIconRing &&
              'rounded-full border-solid border-[length:var(--easyui-border-width-md)] shadow-sm',
            hasIconRing && ALERT_ICON_BORDER_CLASSES[color],
            hasIconRing && variant === 'outlined' && ALERT_ICON_BACKGROUND_CLASSES[color],
            hasIconWrapperBox && ALERT_ICON_WRAPPER_SIZE_CLASSES[size],
            slotClassName('iconWrapper'),
          )}
          iconClassName={cn(
            'flex items-center justify-center',
            ALERT_STATUS_ICON_SIZE_CLASSES[size],
            slotClassName('icon'),
          )}
        />
      )}
      <span className={cn('font-medium', ALERT_TITLE_SIZE_CLASSES[size], slotClassName('title'))}>
        {title}
      </span>
      {hasTrailingColumn && (
        <span className="flex items-center gap-2">
          {endContent && (
            <span className={cn('flex items-center', slotClassName('endContent'))}>{endContent}</span>
          )}
          {isClosable && (
            <AlertCloseButton
              label={resolvedCloseLabel}
              icon={closeIcon}
              iconClassName={ALERT_CLOSE_ICON_SIZE_CLASSES[size]}
              className={slotClassName('closeButton')}
              onClose={handleClose}
            />
          )}
        </span>
      )}
      {description && (
        <div
          className={cn(
            hasIconColumn && 'col-start-2',
            'opacity-80',
            ALERT_DESCRIPTION_SIZE_CLASSES[size],
            slotClassName('description'),
          )}
        >
          {description}
        </div>
      )}
    </div>
  )
})

Alert.displayName = 'Alert'
