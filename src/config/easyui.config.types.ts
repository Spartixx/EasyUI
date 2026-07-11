import type { ButtonProps, ButtonSlots } from '../components'
import type { InputProps, InputSlots } from '../components'
import type { InputNumberProps, InputNumberSlots } from '../components'
import type { SelectorProps, SelectorSlots } from '../components'
import type { AutocompleteProps, AutocompleteSlots } from '../components'
import type { FormProps, FormSlots } from '../components'

export type SlotClassNames<TSlots extends string> = Partial<Record<TSlots, string>>

export interface EasyUIWrappersConfig {
  button?: SlotClassNames<ButtonSlots>
  input?: SlotClassNames<InputSlots>
  inputNumber?: SlotClassNames<InputNumberSlots>
  selector?: SlotClassNames<SelectorSlots>
  autocomplete?: SlotClassNames<AutocompleteSlots>
  form?: SlotClassNames<FormSlots>
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

export type InputNumberPresetProps = Partial<
  Omit<InputNumberProps, 'className' | 'classNames' | 'preset' | 'validations' | 'onValueChange' | 'onBlur' | 'onFocus'>
>

export type SelectorPresetProps = Partial<
  Omit<SelectorProps, 'className' | 'classNames' | 'preset' | 'options' | 'onValueChange' | 'onClick' | 'onKeyDown' | 'onBlur'>
>

export type AutocompletePresetProps = Partial<
  Omit<
    AutocompleteProps,
    'className' | 'classNames' | 'preset' | 'options' | 'onValueChange' | 'onFocus' | 'onKeyDown' | 'onBlur'
  >
>

export type FormPresetProps = Partial<Pick<FormProps, 'actions' | 'isDisabled' | 'variant' | 'color'>>

export interface EasyUIPresetsConfig {
  button?: Record<string, EasyUIPreset<ButtonPresetProps, ButtonSlots>>
  input?: Record<string, EasyUIPreset<InputPresetProps, InputSlots>>
  inputNumber?: Record<string, EasyUIPreset<InputNumberPresetProps, InputNumberSlots>>
  selector?: Record<string, EasyUIPreset<SelectorPresetProps, SelectorSlots>>
  autocomplete?: Record<string, EasyUIPreset<AutocompletePresetProps, AutocompleteSlots>>
  form?: Record<string, EasyUIPreset<FormPresetProps, FormSlots>>
}

export interface EasyUIDefaultsConfig {
  autocomplete?: {
    noResultsMessage?: string
  }
}

export interface EasyUIConfig {
  wrappers?: EasyUIWrappersConfig
  presets?: EasyUIPresetsConfig
  defaults?: EasyUIDefaultsConfig
}

export function defineConfig(config: EasyUIConfig): EasyUIConfig {
  return config
}
