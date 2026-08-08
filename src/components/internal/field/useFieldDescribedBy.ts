interface UseFieldDescribedByParams {
  hasError: boolean
  description?: string
  descriptionPlacement?: 'label' | 'element'
  descriptionId: string
  errorId: string
  additionalDescribedById?: string
}

export function useFieldDescribedBy({
  hasError,
  description,
  descriptionPlacement,
  descriptionId,
  errorId,
  additionalDescribedById,
}: UseFieldDescribedByParams) {
  const showsDescription = !!description && (descriptionPlacement === 'label' || !hasError)
  const ariaDescribedBy =
    [showsDescription && descriptionId, hasError && errorId, additionalDescribedById].filter(Boolean).join(' ') ||
    undefined

  return { ariaDescribedBy }
}
