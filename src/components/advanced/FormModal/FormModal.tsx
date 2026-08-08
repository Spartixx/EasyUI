import { forwardRef, useId } from 'react'
import type { ReactElement, Ref } from 'react'
import type { FormModalProps, FormModalSlots } from './FormModal.types'
import type { FormFields, FormSubmitHandler } from '../Form'
import { cn } from '../../../utils/cn'
import { mergePresetProps } from '../../../utils/mergePresetProps'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { resolveButtonVariant } from '../../internal/actions'
import { Form } from '../Form'
import { Modal, MODAL_SLOTS } from '../Modal'

function FormModalInner<TFields extends FormFields, TSubmitError>(
  rawProps: FormModalProps<TFields, TSubmitError>,
  ref: Ref<HTMLDivElement>,
) {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('formModal', preset)

  const {
    form,
    formProps,
    onOpenChange,
    actions,
    variant,
    color,
    isLoading,
    isDisabled,
    isClosedOnSubmit = true,
    isResetOnClose = true,
    className,
    classNames,
    ...modalProps
  } = mergePresetProps(presetConfig?.props, rest)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('formModal', classNames, presetClassNames, presetConfig?.className)
  const modalClassNames = Object.fromEntries(
    MODAL_SLOTS.map((slot) => [slot, slotClassName(slot)]),
  ) as Partial<Record<FormModalSlots, string>>

  const formId = useId()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isResetOnClose) form.reset()
    onOpenChange(nextOpen)
  }

  const handleFormSubmit: FormSubmitHandler<TFields> = async (values, allValues) => {
    await formProps.onSubmit(values, allValues)
    if (isClosedOnSubmit) handleOpenChange(false)
  }

  return (
    <Modal
      ref={ref}
      onOpenChange={handleOpenChange}
      isClosedOnSubmit={false}
      variant={resolveButtonVariant(variant)}
      color={color}
      isLoading={isLoading}
      isDisabled={isDisabled}
      actions={{
        ...actions,
        submitProps: {
          type: 'submit',
          form: formId,
          isLoading: form.isSubmitting,
          ...actions?.submitProps,
        },
      }}
      className={className}
      classNames={modalClassNames}
      {...modalProps}
    >
      <Form
        {...formProps}
        id={formId}
        form={form}
        onSubmit={handleFormSubmit}
        isHeaderHidden
        variant={variant}
        color={color}
        isLoading={isLoading}
        isDisabled={isDisabled}
        actions={{ isSubmitButtonHidden: true }}
        className={cn('p-0 border-0 bg-transparent', formProps.className)}
      />
    </Modal>
  )
}

const ForwardedFormModal = forwardRef(FormModalInner)
ForwardedFormModal.displayName = 'FormModal'

export const FormModal = ForwardedFormModal as <TFields extends FormFields, TSubmitError = Error>(
  props: FormModalProps<TFields, TSubmitError> & { ref?: Ref<HTMLDivElement> },
) => ReactElement
