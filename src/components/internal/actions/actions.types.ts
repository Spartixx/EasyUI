import type { ButtonProps } from '../../primitives/Button'

export interface ActionsConfig {
  submitLabel?: string
  loadingLabel?: string
  submittingLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  showCancel?: boolean
  isSubmitButtonHidden?: boolean
  submitProps?: Partial<ButtonProps>
  cancelProps?: Partial<ButtonProps>
}
