import { forwardRef } from 'react'
import type { ReactElement, Ref } from 'react'
import type { FormFields, FormProps } from './Form.types'
import { cn } from '../../../utils/cn'
import { mergePresetProps } from '../../../utils/mergePresetProps'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { useEasyUIConfig } from '../../../providers/EasyUIContext'
import { Alert } from '../../primitives'
import { ActionsFooter, resolveButtonVariant } from '../../internal/actions'
import { useSubmitErrorMapping } from '../../internal/submit'
import { FormField } from './FormField'

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
    isHeaderHidden = false,
    loadingMessage,
    disabledMessage,
    actions,
    fieldProps,
    variant,
    color,
    isDisabled = false,
    isLoading = false,
    isResetOnCancel = true,
    isResetOnSubmit = true,
    className,
    classNames,
    ...nativeProps
  } = mergePresetProps(presetConfig?.props, rest)

  const presetClassNames = presetConfig ? (presetConfig.classNames ?? {}) : undefined
  const slotClassName = useSlotClassNames('form', classNames, presetClassNames, presetConfig?.className)

  const { defaults } = useEasyUIConfig()

  const { mappedError, runAndMapError } = useSubmitErrorMapping<TSubmitError>({
    submitErrorMessages,
    getSubmitErrorStatus,
    onUnhandledSubmitError,
    defaultSubmitErrorMessages: defaults?.form?.submitErrorMessages,
    defaultGetSubmitErrorStatus: defaults?.form?.getSubmitErrorStatus as typeof getSubmitErrorStatus,
  })

  const submitAndMapError = async () => {
    let hasSubmitted = false
    await runAndMapError(async () => {
      hasSubmitted = await form.handleSubmit(onSubmit)
    })
    if (hasSubmitted && isResetOnSubmit) form.reset()
  }

  const handleCancel = () => {
    if (isResetOnCancel) form.reset()
    actions?.onCancel?.()
  }

  const displayedError = error ?? mappedError
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
  const showHeader = !isHeaderHidden && (title || effectiveDescription)

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
      {showHeader && (
        <div className={cn('flex flex-col gap-1', slotClassName('header'))}>
          {title && (
            <h2 className={cn('text-lg font-semibold text-(--easyui-color-foreground)', slotClassName('title'))}>
              {title}
            </h2>
          )}
          {effectiveDescription && (
            <div className={cn('text-sm text-(--easyui-color-foreground)/60', slotClassName('description'))}>
              {effectiveDescription}
            </div>
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
              fieldProps={fieldProps}
              slotClassName={slotClassName}
            />
          ) : null,
        )}
      </div>
      {showActions && (
        <ActionsFooter
          actions={{ ...actions, onCancel: handleCancel }}
          showSubmit={showSubmit}
          showCancel={showCancel}
          submitType="submit"
          color={color}
          buttonVariant={buttonVariant}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isSubmitting={form.isSubmitting}
          className={slotClassName('actions')}
          submitClassName={slotClassName('submitButton')}
          cancelClassName={slotClassName('cancelButton')}
        />
      )}
    </form>
  )
}

const ForwardedForm = forwardRef(FormInner)
ForwardedForm.displayName = 'Form'

export const Form = ForwardedForm as <TFields extends FormFields, TSubmitError = Error>(
  props: FormProps<TFields, TSubmitError> & { ref?: Ref<HTMLFormElement> },
) => ReactElement
