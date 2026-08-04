export function mergePresetProps<TProps extends object>(
  presetProps: Partial<TProps> | undefined,
  props: TProps,
): TProps {
  if (!presetProps) return props

  const merged = { ...presetProps, ...props }

  for (const key of Object.keys(presetProps) as (keyof TProps)[]) {
    if (merged[key] === undefined) merged[key] = presetProps[key] as TProps[keyof TProps]
  }

  return merged
}
