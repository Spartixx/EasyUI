import type { AlertProps, AlertSlots } from '../components'
import type { ButtonProps, ButtonSlots } from '../components'
import type { InputProps, InputSlots } from '../components'
import type { InputNumberProps, InputNumberSlots } from '../components'
import type { SelectorCommonProps, SelectorSlots } from '../components'
import type { AutocompleteCommonProps, AutocompleteSlots } from '../components'
import type { FormProps, FormSlots } from '../components'
import type { InputsGroupProps, InputsGroupSlots } from '../components'

export type SlotClassNames<TSlots extends string> = Partial<Record<TSlots, string>>

export interface EasyUIWrappersConfig {
  alert?: SlotClassNames<AlertSlots>
  button?: SlotClassNames<ButtonSlots>
  input?: SlotClassNames<InputSlots>
  inputNumber?: SlotClassNames<InputNumberSlots>
  selector?: SlotClassNames<SelectorSlots>
  autocomplete?: SlotClassNames<AutocompleteSlots>
  form?: SlotClassNames<FormSlots>
  inputsGroup?: SlotClassNames<InputsGroupSlots>
}

export interface EasyUIPreset<TProps, TSlots extends string> {
  props?: TProps
  className?: string
  classNames?: SlotClassNames<TSlots>
}

export type AlertPresetProps = Partial<
  Omit<AlertProps, 'title' | 'description' | 'className' | 'classNames' | 'preset' | 'onClose'>
>

export type ButtonPresetProps = Partial<
  Omit<ButtonProps, 'children' | 'className' | 'classNames' | 'preset'>
>

export type InputPresetProps = Partial<
  Omit<InputProps, 'className' | 'classNames' | 'preset' | 'validations' | 'isFormControlled' | 'error' | 'onValueChange' | 'onChange' | 'onBlur'>
>

export type InputNumberPresetProps = Partial<
  Omit<InputNumberProps, 'className' | 'classNames' | 'preset' | 'validations' | 'isFormControlled' | 'error' | 'onValueChange' | 'onBlur' | 'onFocus'>
>

export type SelectorPresetProps = Partial<
  Omit<
    SelectorCommonProps,
    'className' | 'classNames' | 'preset' | 'options' | 'validations' | 'isFormControlled' | 'error' | 'onClick' | 'onKeyDown' | 'onBlur'
  >
>

export type AutocompletePresetProps = Partial<
  Omit<
    AutocompleteCommonProps,
    'className' | 'classNames' | 'preset' | 'options' | 'validations' | 'isFormControlled' | 'error' | 'onFocus' | 'onKeyDown' | 'onBlur'
  >
>

export type FormPresetProps = Partial<Pick<FormProps, 'actions' | 'isDisabled' | 'variant' | 'color'>>

export type InputsGroupPresetProps = Partial<
  Pick<
    InputsGroupProps,
    | 'size'
    | 'isDisabled'
    | 'isFullWidth'
    | 'removeButtonPlacement'
    | 'maxItems'
    | 'addButtonLabel'
    | 'addButtonPlacement'
    | 'addButtonProps'
    | 'removeButtonProps'
  >
>

export interface EasyUIPresetsConfig {
  alert?: Record<string, EasyUIPreset<AlertPresetProps, AlertSlots>>
  button?: Record<string, EasyUIPreset<ButtonPresetProps, ButtonSlots>>
  input?: Record<string, EasyUIPreset<InputPresetProps, InputSlots>>
  inputNumber?: Record<string, EasyUIPreset<InputNumberPresetProps, InputNumberSlots>>
  selector?: Record<string, EasyUIPreset<SelectorPresetProps, SelectorSlots>>
  autocomplete?: Record<string, EasyUIPreset<AutocompletePresetProps, AutocompleteSlots>>
  form?: Record<string, EasyUIPreset<FormPresetProps, FormSlots>>
  inputsGroup?: Record<string, EasyUIPreset<InputsGroupPresetProps, InputsGroupSlots>>
}

export interface EasyUIDefaultsConfig {
  requiredMessage?: string
  alert?: {
    closeButtonLabel?: string
  }
  autocomplete?: {
    noResultsMessage?: string
  }
  selector?: {
    noResultsMessage?: string
  }
  inputsGroup?: {
    addLabel?: string
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
