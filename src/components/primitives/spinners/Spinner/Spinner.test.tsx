import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from './index.ts'

describe('Spinner', () => {
  test('renders an svg element', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  test('is aria-hidden for decorative use', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  test('applies className', () => {
    const { container } = render(<Spinner className="custom-class" />)
    expect(container.querySelector('svg')?.classList.contains('custom-class')).toBe(true)
  })
})
