import { useEasyUIConfig } from '../providers/EasyUIContext'
import type { EasyUIPresetsConfig } from '../config/easyui.config.types'

export function usePreset<TComponent extends keyof EasyUIPresetsConfig>(
  component: TComponent,
  presetName?: string,
): NonNullable<EasyUIPresetsConfig[TComponent]>[string] | undefined {
  const { presets } = useEasyUIConfig()
  if (!presetName) return undefined
  return presets?.[component]?.[presetName] as
    | NonNullable<EasyUIPresetsConfig[TComponent]>[string]
    | undefined
}
