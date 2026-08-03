import type { WithVariantProps } from '../../../types/base'

export type ButtonVariant = NonNullable<WithVariantProps['variant']>

const BUTTON_VARIANTS: ButtonVariant[] = ['solid', 'outlined', 'flat', 'light']

export function resolveButtonVariant(variant: string | undefined): ButtonVariant | undefined {
  return variant && (BUTTON_VARIANTS as string[]).includes(variant) ? (variant as ButtonVariant) : undefined
}
