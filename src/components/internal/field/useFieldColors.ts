import type { WithVariantProps } from '../../../types/base'
import type { FormFieldVariant } from '../../../utils/class-maps'
import { LABEL_COLOR_CLASSES, CONTENT_COLOR_CLASSES, ERROR_CONTENT_COLOR } from '../../../utils/class-maps'

interface UseFieldColorsParams {
  hasError: boolean
  color: NonNullable<WithVariantProps['color']>
  variant: FormFieldVariant
  textColorClasses: Record<NonNullable<WithVariantProps['color']>, string>
  errorTextColor: string
}

export function useFieldColors({ hasError, color, variant, textColorClasses, errorTextColor }: UseFieldColorsParams) {
  const coloredVariant = variant !== 'bordered'
  const resolvedColor = coloredVariant ? color : 'default'

  return {
    effectiveTextColor: hasError ? errorTextColor : textColorClasses[resolvedColor],
    effectiveContentColor: hasError ? ERROR_CONTENT_COLOR : CONTENT_COLOR_CLASSES[resolvedColor],
    effectiveLabelColor: hasError ? 'text-(--easyui-color-error-dark)' : LABEL_COLOR_CLASSES[resolvedColor],
  }
}
