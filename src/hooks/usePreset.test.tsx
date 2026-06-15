import { describe, test, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { EasyUIProvider } from '../providers'
import { usePreset } from './usePreset'
import type { EasyUIConfig } from '../config/easyui.config.types'

function renderPreset(presetName?: string, config?: EasyUIConfig) {
  return renderHook(() => usePreset('button', presetName), {
    wrapper: ({ children }) => <EasyUIProvider config={config}>{children}</EasyUIProvider>,
  })
}

describe('usePreset', () => {
  test('returns undefined with no provider and no presetName', () => {
    const { result } = renderPreset()
    expect(result.current).toBeUndefined()
  })

  test('returns undefined when presetName is undefined even if presets are configured', () => {
    const { result } = renderPreset(undefined, {
      presets: { button: { primary: { props: { color: 'primary' } } } },
    })
    expect(result.current).toBeUndefined()
  })

  test('returns undefined when presetName does not match a configured entry', () => {
    const { result } = renderPreset('unknown', {
      presets: { button: { primary: { props: { color: 'primary' } } } },
    })
    expect(result.current).toBeUndefined()
  })

  test('returns the configured preset entry when presetName matches', () => {
    const primaryPreset = { props: { color: 'primary' as const }, classNames: { base: 'font-bold' } }
    const { result } = renderPreset('primary', { presets: { button: { primary: primaryPreset } } })
    expect(result.current).toEqual(primaryPreset)
  })

  test('returns undefined when presets.button is empty', () => {
    const { result } = renderPreset('primary', { presets: { button: {} } })
    expect(result.current).toBeUndefined()
  })

  test('returns undefined when the presets key is absent', () => {
    const { result } = renderPreset('primary', {})
    expect(result.current).toBeUndefined()
  })
})
