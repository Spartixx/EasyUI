import { cn } from '../utils/cn'
import { useEasyUIConfig } from '../providers/EasyUIContext'
import type { EasyUIWrappersConfig } from '../config/easyui.config.types'

export function useSlotClassNames<TComponent extends keyof EasyUIWrappersConfig>(
  component: TComponent,
  classNames?: EasyUIWrappersConfig[TComponent],
): (slot: keyof NonNullable<EasyUIWrappersConfig[TComponent]> & string) => string {
  const { wrappers } = useEasyUIConfig()
  const globalSlots = wrappers?.[component]

  return (slot) => cn(globalSlots?.[slot], classNames?.[slot])
}
