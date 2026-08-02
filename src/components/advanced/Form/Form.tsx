import { forwardRef, useState } from 'react'
import type { ReactElement, Ref } from 'react'
import type { ButtonVariant, FormFields, FormProps, FormVariant } from './Form.types'
import { cn } from '../../../utils/cn'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Alert, Button } from '../../primitives'
import { FormField } from './FormField'

const BUTTON_VARIANTS: ButtonVariant[] = ['solid', 'outlined', 'flat', 'light']

function resolveButtonVariant(formVariant: FormVariant | undefined): ButtonVariant | undefined {
  return formVariant && (BUTTON_VARIANTS as string[]).includes(formVariant)
    ? (formVariant as ButtonVariant)
    : undefined
}

function readSubmitErrorStatus<TSubmitError>(
  getStatus: ((error: TSubmitError) => string | null) | undefined,
  error: TSubmitError,
): string | null {
  if (!getStatus) return null
  try {
    return getStatus(error)
  } catch {
    return null
  }
}

function FormInner<TFields extends FormFields, TSubmitError>(
  rawProps: FormProps<TFields, TSubmitError>,
  ref: Ref<HTMLFormElement>,
) {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('form', preset)

  const {
    form,
    onSubmit,
    error,
    submitErrorMessages,
    getSubmitErrorStatus,
    onUnhandledSubmitError,
    title,
    description,
    loadingMessage,
    disabledMessage,
    actions,
    variant,
    color,
    isDisabled = false,
    isLoading = false,
    className,
    classNames,
    ...nativeProps
  } = { ...presetConfig?.props, ...rest }

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('form', classNames, presetClassNames, presetConfig?.className)

  const { defaults } = useEasyUIConfig()
  const [mappedSubmitError, setMappedSubmitError] = useState<string | null>(null)

  const resolveSubmitErrorStatus =
    getSubmitErrorStatus ?? (defaults?.form?.getSubmitErrorStatus as typeof getSubmitErrorStatus)
  const errorMessages = { ...defaults?.form?.submitErrorMessages, ...submitErrorMessages }

  const submitAndMapError = async () => {
    setMappedSubmitError(null)
    try {
      await form.handleSubmit(onSubmit)
    } catch (submitError) {
      const status = readSubmitErrorStatus(resolveSubmitErrorStatus, submitError as TSubmitError)
      const message = status === null ? undefined : errorMessages[status]
      if (message !== undefined) {
        setMappedSubmitError(message)
        return
      }
      if (!onUnhandledSubmitError) throw submitError
      onUnhandledSubmitError(submitError as TSubmitError)
    }
  }

  const displayedError = error ?? mappedSubmitError
  const fieldNames = Object.keys(form.config) as Array<keyof TFields & string>
  const showCancel = actions?.showCancel ?? !!actions?.onCancel
  const showSubmit = !actions?.isSubmitButtonHidden
  const showActions = showCancel || showSubmit
  const buttonVariant = resolveButtonVariant(variant)

  const resolvedLoadingMessage = loadingMessage ?? defaults?.form?.loadingMessage
  const resolvedDisabledMessage = disabledMessage ?? defaults?.form?.disabledMessage
  const effectiveDescription =
    (isLoading && resolvedLoadingMessage) || (isDisabled && resolvedDisabledMessage) || description

  const fieldsLoading = isLoading || form.isSubmitting

  const submitLabel =
    (form.isSubmitting && actions?.submittingLabel) ||
    (isLoading && actions?.loadingLabel) ||
    actions?.submitLabel ||
    'Submit'

  return (
    <form
      ref={ref}
      noValidate
      className={cn(
        'flex flex-col gap-5 p-6 border-(length:--easyui-border-width-sm) border-solid border-(--easyui-color-default) rounded-(--easyui-radius-lg) bg-(--easyui-color-background)',
        slotClassName('base'),
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        void submitAndMapError()
      }}
      {...nativeProps}
    >
      {(title || effectiveDescription) && (
        <div className={cn('flex flex-col gap-1', slotClassName('header'))}>
          {title && (
            <h2 className={cn('text-lg font-semibold text-(--easyui-color-foreground)', slotClassName('title'))}>
              {title}
            </h2>
          )}
          {effectiveDescription && (
            <p className={cn('text-sm text-(--easyui-color-foreground)/60', slotClassName('description'))}>
              {effectiveDescription}
            </p>
          )}
        </div>
      )}
      {displayedError && (
        <Alert
          color="error"
          title={displayedError}
          isIconWrapperHidden
          className={slotClassName('errorAlert')}
        />
      )}
      <div className={cn('flex flex-col gap-4', slotClassName('fieldsWrapper'))}>
        {fieldNames.map((fieldName) =>
          form.fields[fieldName].isVisible ? (
            <FormField
              key={`${form.resetToken}:${fieldName}`}
              form={form}
              fieldName={fieldName}
              isFormDisabled={isDisabled}
              isFormLoading={fieldsLoading}
              formVariant={variant}
              formColor={color}
              slotClassName={slotClassName}
            />
          ) : null,
        )}
      </div>
      {showActions && (
        <div className={cn('flex justify-end gap-2', slotClassName('actions'))}>
          {showCancel && (
            <Button
              type="button"
              color={color ?? 'default'}
              variant={buttonVariant ?? 'light'}
              isDisabled={isDisabled || isLoading || form.isSubmitting}
              onClick={actions?.onCancel}
              className={slotClassName('cancelButton')}
              {...actions?.cancelProps}
            >
              {actions?.cancelLabel ?? 'Cancel'}
            </Button>
          )}
          {showSubmit && (
            <Button
              type="submit"
              color={color ?? 'primary'}
              variant={buttonVariant ?? 'solid'}
              isLoading={form.isSubmitting}
              isDisabled={isDisabled || isLoading}
              className={slotClassName('submitButton')}
              {...actions?.submitProps}
            >
              {submitLabel}
            </Button>
          )}
        </div>
      )}
    </form>
  )
}

const ForwardedForm = forwardRef(FormInner)
ForwardedForm.displayName = 'Form'

export const Form = ForwardedForm as <TFields extends FormFields, TSubmitError = Error>(
  props: FormProps<TFields, TSubmitError> & { ref?: Ref<HTMLFormElement> },
) => ReactElement
