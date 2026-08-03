import { forwardRef, useId } from 'react'
import type { ReactElement, Ref } from 'react'
import type { FormModalProps } from './FormModal.types'
import type { FormFields, FormSubmitHandler } from '../Form'
import { cn } from '../../../utils/cn'
import { resolveButtonVariant } from '../../internal/actions'
import { Form } from '../Form'
import { Modal } from '../Modal'

function FormModalInner<TFields extends FormFields, TSubmitError>(
  rawProps: FormModalProps<TFields, TSubmitError>,
  ref: Ref<HTMLDivElement>,
) {
  const {
    form,
    formProps,
    onOpenChange,
    actions,
    variant,
    color,
    isLoading = false,
    isDisabled = false,
    isClosedOnSubmit = true,
    isResetOnClose = true,
    ...modalProps
  } = rawProps

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
