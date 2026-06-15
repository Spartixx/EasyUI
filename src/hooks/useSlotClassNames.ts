import { cn } from '../utils/cn'
import { useEasyUIConfig } from '../providers/EasyUIContext'
import type { EasyUIWrappersConfig } from '../config/easyui.config.types'

export function useSlotClassNames<TComponent extends keyof EasyUIWrappersConfig>(
  component: TComponent,
  classNames?: EasyUIWrappersConfig[TComponent],
  presetClassNames?: EasyUIWrappersConfig[TComponent],
  presetClassName?: string,
): (slot: keyof NonNullable<EasyUIWrappersConfig[TComponent]> & string) => string {
  const { wrappers } = useEasyUIConfig()
  const globalSlots = wrappers?.[component]

  const baseSlots =
    presetClassNames !== undefined
      ? { ...presetClassNames, base: cn(presetClassNames?.base, presetClassName) }
      : globalSlots

  return (slot) => cn(baseSlots?.[slot], classNames?.[slot])
}
