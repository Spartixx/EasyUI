import type { Ref } from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { useMergedRefs } from './useMergedRefs'

function Probe({ refs }: { refs: Array<Ref<HTMLInputElement> | undefined> }) {
  const mergedRef = useMergedRefs(...refs)
  return <input data-testid="element" ref={mergedRef} />
}

describe('useMergedRefs', () => {
  test('assigns the node to an object ref', () => {
    const objectRef = createRef<HTMLInputElement>()
    const { getByTestId } = render(<Probe refs={[objectRef]} />)
    expect(objectRef.current).toBe(getByTestId('element'))
  })

  test('calls a function ref with the node', () => {
    const functionRef = vi.fn()
    const { getByTestId } = render(<Probe refs={[functionRef]} />)
    expect(functionRef).toHaveBeenCalledWith(getByTestId('element'))
  })

  test('assigns to an object ref and a function ref at once', () => {
    const objectRef = createRef<HTMLInputElement>()
    const functionRef = vi.fn()
    const { getByTestId } = render(<Probe refs={[objectRef, functionRef]} />)
    const element = getByTestId('element')
    expect(objectRef.current).toBe(element)
    expect(functionRef).toHaveBeenCalledWith(element)
  })

  test('ignores undefined refs', () => {
    const objectRef = createRef<HTMLInputElement>()
    const { getByTestId } = render(<Probe refs={[undefined, objectRef]} />)
    expect(objectRef.current).toBe(getByTestId('element'))
  })

  test('resets the refs to null on unmount', () => {
    const objectRef = createRef<HTMLInputElement>()
    const functionRef = vi.fn()
    const { unmount } = render(<Probe refs={[objectRef, functionRef]} />)
    unmount()
    expect(objectRef.current).toBeNull()
    expect(functionRef).toHaveBeenLastCalledWith(null)
  })
})
