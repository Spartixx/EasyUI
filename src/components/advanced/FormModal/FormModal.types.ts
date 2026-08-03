import type { FormFields, FormProps, FormVariant, FormColor, FormInstance } from '../Form'
import type { ModalProps, ModalSlots } from '../Modal'

export type FormModalSlots = ModalSlots

type ModalOmittedProps =
  | 'children'
  | 'onSubmit'
  | 'error'
  | 'submitErrorMessages'
  | 'getSubmitErrorStatus'
  | 'onUnhandledSubmitError'
  | 'variant'
  | 'color'

export type FormModalFormProps<TFields extends FormFields, TSubmitError> = Omit<
  FormProps<TFields, TSubmitError>,
  | 'form'
  | 'title'
  | 'description'
  | 'variant'
  | 'color'
  | 'isLoading'
  | 'isDisabled'
  | 'actions'
  | 'id'
  | 'isHeaderHidden'
>

export interface FormModalProps<TFields extends FormFields = FormFields, TSubmitError = Error>
  extends Omit<ModalProps<TSubmitError>, ModalOmittedProps> {
  form: FormInstance<TFields>
  formProps: FormModalFormProps<TFields, TSubmitError>
  isResetOnClose?: boolean
  variant?: FormVariant
  color?: FormColor
}
