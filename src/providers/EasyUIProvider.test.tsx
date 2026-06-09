import { describe, test, expect } from 'vitest'
import { render, renderHook, screen } from '@testing-library/react'
import { EasyUIProvider } from './EasyUIProvider'
import { useEasyUIConfig } from './EasyUIContext'

function ConfigProbe() {
  const config = useEasyUIConfig()
  return <span data-testid="config">{JSON.stringify(config)}</span>
}

describe('EasyUIProvider', () => {
  test('useEasyUIConfig returns an empty object with no provider', () => {
    const { result } = renderHook(() => useEasyUIConfig())
    expect(result.current).toEqual({})
  })

  test('useEasyUIConfig returns the config passed to the provider', () => {
    const config = { wrappers: { button: { base: 'global-base' } } }
    const { result } = renderHook(() => useEasyUIConfig(), {
      wrapper: ({ children }) => <EasyUIProvider config={config}>{children}</EasyUIProvider>,
    })
    expect(result.current).toBe(config)
  })

  test('defaults to an empty object when config prop is omitted', () => {
    const { result } = renderHook(() => useEasyUIConfig(), {
      wrapper: ({ children }) => <EasyUIProvider>{children}</EasyUIProvider>,
    })
    expect(result.current).toEqual({})
  })

  test('reflects updated config on rerender', () => {
    const { rerender } = render(
      <EasyUIProvider config={{ wrappers: { button: { base: 'a' } } }}>
        <ConfigProbe />
      </EasyUIProvider>,
    )
    expect(screen.getByTestId('config').textContent).toContain('"base":"a"')

    rerender(
      <EasyUIProvider config={{ wrappers: { button: { base: 'b' } } }}>
        <ConfigProbe />
      </EasyUIProvider>,
    )
    expect(screen.getByTestId('config').textContent).toContain('"base":"b"')
  })
})
