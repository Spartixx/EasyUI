import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { EasyUIProvider } from '../providers'
import { useSlotClassNames } from './useSlotClassNames'
import type { EasyUIConfig } from '../config/easyui.config.types'
import type { ButtonSlots } from '../components'

function renderSlotClassName(classNames?: Partial<Record<ButtonSlots, string>>, config?: EasyUIConfig) {
  return renderHook(() => useSlotClassNames('button', classNames), {
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
})
