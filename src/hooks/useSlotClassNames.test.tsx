import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { EasyUIProvider } from '../providers'
import { useSlotClassNames } from './useSlotClassNames'
import type { EasyUIConfig } from '../config/easyui.config.types'
import type { ButtonSlots } from '../components'

function renderSlotClassName(
  classNames?: Partial<Record<ButtonSlots, string>>,
  config?: EasyUIConfig,
  presetClassNames?: Partial<Record<ButtonSlots, string>>,
  presetClassName?: string,
) {
  return renderHook(() => useSlotClassNames('button', classNames, presetClassNames, presetClassName), {
    wrapper: ({ children }) => <EasyUIProvider config={config}>{children}</EasyUIProvider>,
  })
}

describe('useSlotClassNames', () => {
  test('returns an empty string with no provider and no classNames', () => {
    const { result } = renderSlotClassName()
    expect(result.current('base')).toBe('')
  })

  test('returns instance classNames when there is no global wrapper', () => {
    const { result } = renderSlotClassName({ base: 'instance-base' })
    expect(result.current('base')).toBe('instance-base')
  })

  test('returns the global wrapper class when there is no instance classNames', () => {
    const { result } = renderSlotClassName(undefined, { wrappers: { button: { base: 'global-base' } } })
    expect(result.current('base')).toBe('global-base')
  })

  test('instance classNames win over a conflicting global wrapper utility', () => {
    const { result } = renderSlotClassName(
      { base: 'bg-blue-500' },
      { wrappers: { button: { base: 'bg-red-500' } } },
    )
    expect(result.current('base')).toBe('bg-blue-500')
  })

  test('combines global and instance classes for the same slot when they do not conflict', () => {
    const { result } = renderSlotClassName(
      { base: 'text-white' },
      { wrappers: { button: { base: 'bg-red-500' } } },
    )
    expect(result.current('base')).toBe('bg-red-500 text-white')
  })

  test('global wrapper for a slot the instance does not set still applies', () => {
    const { result } = renderSlotClassName(
      { base: 'instance-base' },
      { wrappers: { button: { spinner: 'global-spinner' } } },
    )
    expect(result.current('spinner')).toBe('global-spinner')
  })

  test('no effects when wrappers has no entry for the component', () => {
    const { result } = renderSlotClassName({ base: 'instance-base' }, { wrappers: {} })
    expect(result.current('base')).toBe('instance-base')
  })

  test('no effects when the wrappers key itself is absent', () => {
    const { result } = renderSlotClassName({ base: 'instance-base' }, {})
    expect(result.current('base')).toBe('instance-base')
  })

  describe('preset classNames', () => {
    test('preset classNames replace the global wrapper for a slot it defines', () => {
      const { result } = renderSlotClassName(
        undefined,
        { wrappers: { button: { base: 'global-base' } } },
        { base: 'preset-base' },
      )
      expect(result.current('base')).toBe('preset-base')
    })

    test('an empty preset classNames object suppresses the global wrapper entirely', () => {
      const { result } = renderSlotClassName(undefined, { wrappers: { button: { base: 'global-base' } } }, {})
      expect(result.current('base')).toBe('')
    })

    test('instance classNames win over a preset classNames utility', () => {
      const { result } = renderSlotClassName({ base: 'bg-blue-500' }, undefined, { base: 'bg-red-500' })
      expect(result.current('base')).toBe('bg-blue-500')
    })

    test('combines preset and instance classes for the same slot when they do not conflict', () => {
      const { result } = renderSlotClassName({ base: 'text-white' }, undefined, { base: 'bg-red-500' })
      expect(result.current('base')).toBe('bg-red-500 text-white')
    })

    test('preset classNames for a slot the instance does not set still applies', () => {
      const { result } = renderSlotClassName({ base: 'instance-base' }, undefined, { spinner: 'preset-spinner' })
      expect(result.current('spinner')).toBe('preset-spinner')
      expect(result.current('base')).toBe('instance-base')
    })

    test('a slot missing from the preset classNames does not fall back to the global wrapper', () => {
      const { result } = renderSlotClassName(
        { spinner: 'instance-spinner' },
        { wrappers: { button: { spinner: 'global-spinner', base: 'global-base', endContent: 'global-end-content' } } },
        { base: 'preset-base' },
      )
      expect(result.current('spinner')).toBe('instance-spinner')
      expect(result.current('base')).toBe('preset-base')
      expect(result.current('endContent')).not.toBe('global-end-content')
    })
  })

  describe('preset className', () => {
    test('preset className applies to the base slot when a preset is active', () => {
      const { result } = renderSlotClassName(undefined, undefined, {}, 'preset-class')
      expect(result.current('base')).toBe('preset-class')
    })

    test('preset className combines with preset classNames.base when they do not conflict', () => {
      const { result } = renderSlotClassName(undefined, undefined, { base: 'preset-base' }, 'font-bold')
      expect(result.current('base')).toBe('preset-base font-bold')
    })

    test('preset className wins over a conflicting preset classNames.base', () => {
      const { result } = renderSlotClassName(undefined, undefined, { base: 'bg-red-500' }, 'bg-blue-500')
      expect(result.current('base')).toBe('bg-blue-500')
    })

    test('instance classNames.base wins over both preset className and preset classNames.base', () => {
      const { result } = renderSlotClassName({ base: 'bg-blue-500' }, undefined, { base: 'bg-red-500' }, 'bg-green-500')
      expect(result.current('base')).toBe('bg-blue-500')
    })

    test('preset className has no effect on other slots', () => {
      const { result } = renderSlotClassName({ spinner: 'instance-spinner' }, undefined, {}, 'preset-class')
      expect(result.current('spinner')).toBe('instance-spinner')
    })
  })
})
