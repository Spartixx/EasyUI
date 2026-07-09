import { forwardRef } from 'react'
import type { ReactElement, Ref } from 'react'
import type { ButtonVariant, FormFields, FormProps, FormVariant } from './Form.types'
import { cn } from '../../../utils/cn'
import { useSlotClassNames, usePreset } from '../../../hooks'
import { Button } from '../../primitives'
import { FormField } from './FormField'

const BUTTON_VARIANTS: ButtonVariant[] = ['solid', 'outlined', 'flat', 'light']

function resolveButtonVariant(formVariant: FormVariant | undefined): ButtonVariant | undefined {
  return formVariant && (BUTTON_VARIANTS as string[]).includes(formVariant)
    ? (formVariant as ButtonVariant)
    : undefined
}

function FormInner<TFields extends FormFields>(rawProps: FormProps<TFields>, ref: Ref<HTMLFormElement>) {
  const { preset, ...rest } = rawProps
  const presetConfig = usePreset('form', preset)

  const {
    form,
    onSubmit,
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

  const fieldNames = Object.keys(form.config) as Array<keyof TFields & string>
  const showCancel = actions?.showCancel ?? !!actions?.onCancel
  const buttonVariant = resolveButtonVariant(variant)

  const effectiveDescription = (isLoading && loadingMessage) || (isDisabled && disabledMessage) || description

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
        void form.handleSubmit(onSubmit)
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
      <div className={cn('flex flex-col gap-4', slotClassName('fieldsWrapper'))}>
        {fieldNames.map((fieldName) =>
          form.fields[fieldName].isVisible ? (
            <FormField
              key={fieldName}
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
      </div>
    </form>
  )
}

const ForwardedForm = forwardRef(FormInner)
ForwardedForm.displayName = 'Form'

export const Form = ForwardedForm as <TFields extends FormFields>(
  props: FormProps<TFields> & { ref?: Ref<HTMLFormElement> },
) => ReactElement
