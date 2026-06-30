interface UseFieldDescribedByParams {
  hasError: boolean
  description?: string
  descriptionPlacement?: 'label' | 'element'
  descriptionId: string
  errorId: string
}

export function useFieldDescribedBy({
  hasError,
  description,
  descriptionPlacement,
  descriptionId,
  errorId,
}: UseFieldDescribedByParams) {
  const showsDescription = !!description && (descriptionPlacement === 'label' || !hasError)
  const ariaDescribedBy = [showsDescription && descriptionId, hasError && errorId].filter(Boolean).join(' ') || undefined

  return { ariaDescribedBy }
}
