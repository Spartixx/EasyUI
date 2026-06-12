import type { ButtonSlots } from '../components'

export interface EasyUIWrappersConfig {
  button?: Partial<Record<ButtonSlots, string>>
}

export interface EasyUIConfig {
  wrappers?: EasyUIWrappersConfig
}

export function defineConfig(config: EasyUIConfig): EasyUIConfig {
  return config
}
