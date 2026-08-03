import { forwardRef, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactElement, Ref } from 'react'
import { createPortal } from 'react-dom'
import type { ModalProps, ModalSize } from './Modal.types'
import { cn } from '../../../utils/cn'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Alert } from '../../primitives'
import { ActionsFooter } from '../../internal/actions'
import { useSubmitErrorMapping } from '../../internal/submit'
import { useEscapeToDismiss, useFocusTrap, useScrollLock } from '../../internal/overlay'
import { ModalHeader } from './ModalHeader'

const PANEL_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function ModalInner<TSubmitError>(rawProps: ModalProps<TSubmitError>, ref: Ref<HTMLDivElement>) {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('modal', preset)

  const {
    isOpen,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = 'md',
    actions,
    onSubmit,
    isClosedOnSubmit = true,
    isCloseIconHidden = false,
    closeIconButtonLabel,
    isClosedOnBackdropClick = true,
    isClosedOnEscape = true,
    variant,
    color,
    isLoading = false,
    isDisabled = false,
    error,
    submitErrorMessages,
    getSubmitErrorStatus,
    onUnhandledSubmitError,
    className,
    classNames,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('modal', classNames, presetClassNames, presetConfig?.className)

  const { defaults } = useEasyUIConfig()
  const resolvedCloseIconButtonLabel = closeIconButtonLabel ?? defaults?.modal?.closeIconButtonLabel ?? 'Close'

  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const descriptionId = `${generatedId}-description`

  const [isSubmitting, setIsSubmitting] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const setPanelNode = (node: HTMLDivElement | null) => {
    panelRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const closeModal = () => onOpenChange(false)

  useEscapeToDismiss(isOpen && isClosedOnEscape, closeModal)
  useFocusTrap(isOpen, panelRef)
  useScrollLock(isOpen)

  const { mappedError, runAndMapError } = useSubmitErrorMapping<TSubmitError>({
    submitErrorMessages,
    getSubmitErrorStatus,
    onUnhandledSubmitError,
    defaultSubmitErrorMessages: defaults?.modal?.submitErrorMessages,
    defaultGetSubmitErrorStatus: defaults?.modal?.getSubmitErrorStatus as typeof getSubmitErrorStatus,
  })

  const handleSubmitClick = async () => {
    setIsSubmitting(true)
    try {
      const hasSucceeded = await runAndMapError(() => onSubmit?.())
      if (hasSucceeded && isClosedOnSubmit) closeModal()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!isClosedOnBackdropClick) return
    if (panelRef.current?.contains(event.target as Node)) return
    closeModal()
  }

  if (!isOpen) return null

  const displayedError = error ?? mappedError
  const showHeader = !!title || !!description || !isCloseIconHidden
  const showCancel = actions?.showCancel ?? true
  const showSubmit = !actions?.isSubmitButtonHidden
  const showActions = showCancel || showSubmit

  return createPortal(
    <div
      onMouseDown={handleBackdropMouseDown}
      className={cn('fixed inset-0 z-50 overflow-y-auto bg-black/50', slotClassName('backdrop'))}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={setPanelNode}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            'flex flex-col gap-5 w-full p-6',
            'border-(length:--easyui-border-width-sm) border-solid border-(--easyui-color-default)',
            'rounded-(--easyui-radius-lg) bg-(--easyui-color-background) outline-none',
            PANEL_SIZE_CLASSES[size],
            slotClassName('base'),
            className,
          )}
          {...nativeProps}
        >
          {showHeader && (
            <ModalHeader
              title={title}
              titleId={titleId}
              description={description}
              descriptionId={descriptionId}
              isCloseIconHidden={isCloseIconHidden}
              closeIconButtonLabel={resolvedCloseIconButtonLabel}
              onClose={closeModal}
              className={slotClassName('header')}
              titleClassName={slotClassName('title')}
              descriptionClassName={slotClassName('description')}
              closeIconButtonClassName={slotClassName('closeIconButton')}
            />
          )}
          {displayedError && (
            <Alert color="error" title={displayedError} isIconWrapperHidden className={slotClassName('errorAlert')} />
          )}
          {children && <div className={slotClassName('body')}>{children}</div>}
          {footer ??
            (showActions && (
              <ActionsFooter
                actions={{ ...actions, onCancel: actions?.onCancel ?? closeModal }}
                showSubmit={showSubmit}
                showCancel={showCancel}
                submitType="button"
                onSubmitClick={handleSubmitClick}
                color={color}
                buttonVariant={variant}
                isDisabled={isDisabled}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                className={slotClassName('footer')}
                submitClassName={slotClassName('submitButton')}
                cancelClassName={slotClassName('cancelButton')}
              />
            ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

const ForwardedModal = forwardRef(ModalInner)
ForwardedModal.displayName = 'Modal'

export const Modal = ForwardedModal as <TSubmitError = Error>(
  props: ModalProps<TSubmitError> & { ref?: Ref<HTMLDivElement> },
) => ReactElement
