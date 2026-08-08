import { describe, test, expect } from 'vitest'
import { createElement } from 'react'
import { mergePresetProps } from './mergePresetProps'

describe('mergePresetProps', () => {
  test('returns the props untouched when there is no preset', () => {
    const props = { color: 'primary' }
    expect(mergePresetProps(undefined, props)).toBe(props)
  })

  test('keeps the value of the instance over the one of the preset', () => {
    expect(mergePresetProps({ color: 'primary' }, { color: 'error' })).toEqual({ color: 'error' })
  })

  test('falls back to the preset when the instance value is undefined', () => {
    expect(mergePresetProps({ color: 'primary' }, { color: undefined })).toEqual({ color: 'primary' })
  })

  test('merges nested objects key by key instead of replacing them', () => {
    const merged = mergePresetProps(
      { actions: { submitLabel: 'Delete', cancelLabel: 'Back' } },
      { actions: { cancelLabel: 'Close' } },
    )
    expect(merged).toEqual({ actions: { submitLabel: 'Delete', cancelLabel: 'Close' } })
  })

  test('merges three levels deep', () => {
    const merged = mergePresetProps(
      { actions: { submitProps: { color: 'error', preset: 'cta' } } },
      { actions: { submitProps: { size: 'lg' } } },
    )
    expect(merged).toEqual({ actions: { submitProps: { color: 'error', preset: 'cta', size: 'lg' } } })
  })

  test('merges a nested object the instance does not provide at all', () => {
    const merged = mergePresetProps(
      { formProps: { fieldProps: { input: { size: 'sm' } } } },
      { formProps: { onSubmit: 'handler' } },
    )
    expect(merged).toEqual({
      formProps: { fieldProps: { input: { size: 'sm' } }, onSubmit: 'handler' },
    })
  })

  test('replaces arrays instead of merging them', () => {
    const merged = mergePresetProps({ options: ['a', 'b', 'c'] }, { options: ['z'] })
    expect(merged).toEqual({ options: ['z'] })
  })

  test('replaces React elements instead of merging them', () => {
    const presetIcon = createElement('svg', { id: 'preset' })
    const instanceIcon = createElement('span', { id: 'instance' })
    const merged = mergePresetProps({ startContent: presetIcon }, { startContent: instanceIcon })
    expect(merged.startContent).toBe(instanceIcon)
  })

  test('replaces functions instead of merging them', () => {
    const presetHandler = () => 'preset'
    const instanceHandler = () => 'instance'
    const merged = mergePresetProps({ onCancel: presetHandler }, { onCancel: instanceHandler })
    expect(merged.onCancel).toBe(instanceHandler)
  })

  test('replaces class instances instead of merging them', () => {
    const instanceDate = new Date('2026-01-01')
    const merged = mergePresetProps({ from: new Date('2020-01-01') }, { from: instanceDate })
    expect(merged.from).toBe(instanceDate)
  })

  test('falls back to the preset object when the instance value is undefined at depth', () => {
    const merged = mergePresetProps(
      { actions: { submitProps: { color: 'error' } } },
      { actions: { submitProps: undefined } },
    )
    expect(merged).toEqual({ actions: { submitProps: { color: 'error' } } })
  })

  test('does not mutate its arguments', () => {
    const presetProps = { actions: { submitLabel: 'Delete' } }
    const props = { actions: { cancelLabel: 'Close' } }
    mergePresetProps(presetProps, props)
    expect(presetProps).toEqual({ actions: { submitLabel: 'Delete' } })
    expect(props).toEqual({ actions: { cancelLabel: 'Close' } })
  })
})
