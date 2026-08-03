import { describe, test, expect, afterEach } from 'vitest'
import { render, renderHook, screen, fireEvent } from '@testing-library/react'
import { useRef } from 'react'
import { useFocusTrap } from './useFocusTrap'

function TrapHarness({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} tabIndex={-1} data-testid="container">
      <button type="button">first</button>
      <button type="button">last</button>
      <ActivateTrap isActive={isActive} containerRef={containerRef} />
    </div>
  )
}

function ActivateTrap({
  isActive,
  containerRef,
}: {
  isActive: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  useFocusTrap(isActive, containerRef)
  return null
}

describe('useFocusTrap', () => {
  const outsideButton = document.createElement('button')

  afterEach(() => {
    outsideButton.remove()
  })

  test('does nothing while the container is not mounted', () => {
    document.body.appendChild(outsideButton)
    outsideButton.focus()

    renderHook(() => useFocusTrap(true, { current: null }))

    expect(document.activeElement).toBe(outsideButton)
  })

  test('brings the focus back to the first focusable when it escaped the container', () => {
    render(<TrapHarness isActive />)
    ;(document.activeElement as HTMLElement).blur()

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'first' }))
  })

  test('brings the focus back to the last focusable when it escaped and Tab is reversed', () => {
    render(<TrapHarness isActive />)
    ;(document.activeElement as HTMLElement).blur()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'last' }))
  })

  test('ignores every key other than Tab', () => {
    render(<TrapHarness isActive />)
    const container = screen.getByTestId('container')

    fireEvent.keyDown(document, { key: 'a' })

    expect(document.activeElement).toBe(container)
  })

  test('does not trap while inactive', () => {
    document.body.appendChild(outsideButton)
    outsideButton.focus()

    render(<TrapHarness isActive={false} />)
    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(outsideButton)
  })
})
