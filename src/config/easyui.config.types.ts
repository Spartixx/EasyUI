import type { ButtonProps, ButtonSlots } from '../components'
import type { InputProps, InputSlots } from '../components'
import type { SelectorProps, SelectorSlots } from '../components'

export type SlotClassNames<TSlots extends string> = Partial<Record<TSlots, string>>

export interface EasyUIWrappersConfig {
  button?: SlotClassNames<ButtonSlots>
  input?: SlotClassNames<InputSlots>
  selector?: SlotClassNames<SelectorSlots>
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

export type SelectorPresetProps = Partial<
  Omit<SelectorProps, 'className' | 'classNames' | 'preset' | 'options' | 'onValueChange' | 'onClick' | 'onKeyDown' | 'onBlur'>
>

export interface EasyUIPresetsConfig {
  button?: Record<string, EasyUIPreset<ButtonPresetProps, ButtonSlots>>
  input?: Record<string, EasyUIPreset<InputPresetProps, InputSlots>>
  selector?: Record<string, EasyUIPreset<SelectorPresetProps, SelectorSlots>>
}

export interface EasyUIConfig {
  wrappers?: EasyUIWrappersConfig
  presets?: EasyUIPresetsConfig
}

export function defineConfig(config: EasyUIConfig): EasyUIConfig {
  return config
}
