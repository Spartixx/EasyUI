import type { ButtonProps, ButtonSlots } from '../components'
import type { InputProps, InputSlots } from '../components'

export type SlotClassNames<TSlots extends string> = Partial<Record<TSlots, string>>

export interface EasyUIWrappersConfig {
  button?: SlotClassNames<ButtonSlots>
  input?: SlotClassNames<InputSlots>
}

export interface EasyUIPreset<TProps, TSlots extends string> {
  props?: TProps
  className?: string
  classNames?: SlotClassNames<TSlots>
}

export type ButtonPresetProps = Partial<
  Omit<ButtonProps, 'children' | 'className' | 'classNames' | 'preset'>
>

export type InputPresetProps = Partial<
  Omit<InputProps, 'className' | 'classNames' | 'preset' | 'validations' | 'onValueChange' | 'onChange' | 'onBlur'>
>

export interface EasyUIPresetsConfig {
  button?: Record<string, EasyUIPreset<ButtonPresetProps, ButtonSlots>>
  input?: Record<string, EasyUIPreset<InputPresetProps, InputSlots>>
}

export interface EasyUIConfig {
  wrappers?: EasyUIWrappersConfig
  presets?: EasyUIPresetsConfig
}

export function defineConfig(config: EasyUIConfig): EasyUIConfig {
  return config
}
