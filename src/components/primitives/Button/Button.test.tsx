import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@vitest/browser/context'
import { createRef } from 'react'
import { Button } from './index'
import { EasyUIProvider } from '../../../providers'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  test('has button role', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button')).toBeDefined()
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled when loading', () => {
    render(<Button loading>Click</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })

  test('has aria-busy when loading', () => {
    render(<Button loading>Click</Button>)
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
  })

  test('shows spinner when loading', () => {
    render(<Button loading>Click</Button>)
    const spinner = screen.getByRole('button').querySelector('[aria-hidden="true"]')
    expect(spinner).not.toBeNull()
  })

  test('applies className to button element', () => {
    render(<Button className="custom-class">Click</Button>)
    expect(screen.getByRole('button').classList.contains('custom-class')).toBe(true)
  })

  test('applies classNames.base to button element', () => {
    render(<Button classNames={{ base: 'custom-base' }}>Click</Button>)
    expect(screen.getByRole('button').classList.contains('custom-base')).toBe(true)
  })

  test('renders startContent inside button by default', () => {
    render(<Button startContent={<span data-testid="icon">+</span>}>Click</Button>)
    expect(screen.getByRole('button').contains(screen.getByTestId('icon'))).toBe(true)
  })

  test('renders endContent inside button by default', () => {
    render(<Button endContent={<span data-testid="icon">→</span>}>Click</Button>)
    expect(screen.getByRole('button').contains(screen.getByTestId('icon'))).toBe(true)
  })

  test('renders startContent outside button when placement is outside', () => {
    render(
      <Button startContent={<span data-testid="icon">+</span>} startContentPlacement="outside">
        Click
      </Button>,
    )
    expect(screen.getByRole('button').contains(screen.getByTestId('icon'))).toBe(false)
  })

  test('applies w-full when fullWidth is true', () => {
    render(<Button fullWidth>Click</Button>)
    expect(screen.getByRole('button').classList.contains('w-full')).toBe(true)
  })

  test('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('forwards ref to button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Click</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  test('passes native props to button element', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit')
  })

  test('renders label when provided', () => {
    render(<Button label="Delete account">Delete</Button>)
    expect(screen.getByText('Delete account')).toBeDefined()
  })

  test('renders description when provided', () => {
    render(<Button description="This action cannot be undone.">Delete</Button>)
    expect(screen.getByText('This action cannot be undone.')).toBeDefined()
  })

  test('does not render label or description when not provided', () => {
    render(<Button>Click</Button>)
    expect(screen.queryByText('Click')?.parentElement?.tagName).toBe('BUTTON')
  })

  test('applies classNames.label to the label element', () => {
    render(
      <Button label="Delete account" classNames={{ label: 'custom-label' }}>
        Delete
      </Button>,
    )
    expect(screen.getByText('Delete account').classList.contains('custom-label')).toBe(true)
  })

  test('applies classNames.description to the description element', () => {
    render(
      <Button description="This action cannot be undone." classNames={{ description: 'custom-description' }}>
        Delete
      </Button>,
    )
    expect(
      screen.getByText('This action cannot be undone.').classList.contains('custom-description'),
    ).toBe(true)
  })

  test('renders description after the button by default', () => {
    render(
      <Button label="Account" description="This action cannot be undone.">
        Delete
      </Button>,
    )
    const wrapper = screen.getByRole('button').parentElement
    const children = Array.from(wrapper?.children ?? [])
    expect(children[children.length - 1].textContent).toBe('This action cannot be undone.')
  })

  test('renders description right after the label when descriptionPlacement is "label"', () => {
    render(
      <Button label="Account" description="This action cannot be undone." descriptionPlacement="label">
        Delete
      </Button>,
    )
    const wrapper = screen.getByRole('button').parentElement
    const children = Array.from(wrapper?.children ?? [])
    expect(children[0].textContent).toBe('Account')
    expect(children[1].textContent).toBe('This action cannot be undone.')
  })

  describe('global wrappers config', () => {
    test('renders unchanged when no provider is present', () => {
      render(<Button>Click</Button>)
      const button = screen.getByRole('button')
      expect(button.classList.contains('inline-flex')).toBe(true)
      expect(button.className).not.toContain('  ')
    })

    test('applies a global button wrapper class to every slot of the component', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: {
              button: {
                base: 'global-base',
                startContent: 'global-start-content',
                endContent: 'global-end-content',
                text: 'global-text',
                spinner: 'global-spinner',
                label: 'global-label',
                description: 'global-description',
              },
            },
          }}
        >
          <Button
            label="Account"
            description="Helper text"
            startContent={<span data-testid="start">+</span>}
            endContent={<span data-testid="end">→</span>}
            loading
          >
            Click
          </Button>
        </EasyUIProvider>,
      )

      expect(screen.getByRole('button').classList.contains('global-base')).toBe(true)
      expect(screen.getByTestId('start').parentElement?.classList.contains('global-start-content')).toBe(true)
      expect(screen.getByTestId('end').parentElement?.classList.contains('global-end-content')).toBe(true)
      expect(screen.getByText('Click').classList.contains('global-text')).toBe(true)
      expect(
        screen.getByRole('button').querySelector('[aria-hidden="true"]')?.classList.contains('global-spinner'),
      ).toBe(true)
      expect(screen.getByText('Account').classList.contains('global-label')).toBe(true)
      expect(screen.getByText('Helper text').classList.contains('global-description')).toBe(true)
    })
  })
})
