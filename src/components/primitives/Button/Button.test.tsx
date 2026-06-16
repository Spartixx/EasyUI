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

  test('is disabled when isDisabled prop is true', () => {
    render(<Button isDisabled>Click</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled when isLoading', () => {
    render(<Button isLoading>Click</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })

  test('has aria-busy when isLoading', () => {
    render(<Button isLoading>Click</Button>)
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
  })

  test('shows spinner when isLoading', () => {
    render(<Button isLoading>Click</Button>)
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

  test('applies w-full when isFullWidth is true', () => {
    render(<Button isFullWidth>Click</Button>)
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
            isLoading
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

  describe('presets config', () => {
    test('renders unchanged when no preset prop is set, even if presets are configured', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              button: {
                primary: {
                  props: { variant: 'outlined', color: 'primary' },
                  classNames: { base: 'preset-base' },
                },
              },
            },
          }}
        >
          <Button>Click</Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('preset-base')).toBe(false)
      expect(button.classList.contains('bg-(--easyui-color-default)')).toBe(true)
    })

    test('preset props change the rendered classes', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              button: { primary: { props: { variant: 'outlined', color: 'primary' } } },
            },
          }}
        >
          <Button preset="primary">Click</Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('border-(--easyui-color-primary)')).toBe(true)
      expect(button.classList.contains('bg-(--easyui-color-default)')).toBe(false)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              button: { primary: { props: { variant: 'outlined', color: 'primary' } } },
            },
          }}
        >
          <Button preset="primary" variant="solid">
            Click
          </Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('bg-(--easyui-color-primary)')).toBe(true)
      expect(button.classList.contains('border-(--easyui-color-primary)')).toBe(false)
    })

    test('preset className and classNames replace the global wrapper across slots', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { button: { base: 'global-base', spinner: 'global-spinner' } },
            presets: {
              button: {
                primary: {
                  className: 'preset-class',
                  classNames: { base: 'preset-base', spinner: 'preset-spinner' },
                },
              },
            },
          }}
        >
          <Button preset="primary" isLoading>
            Click
          </Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('preset-class')).toBe(true)
      expect(button.classList.contains('preset-base')).toBe(true)
      expect(button.classList.contains('global-base')).toBe(false)
      expect(button.querySelector('[aria-hidden="true"]')?.classList.contains('preset-spinner')).toBe(true)
      expect(button.querySelector('[aria-hidden="true"]')?.classList.contains('global-spinner')).toBe(false)
    })

    test('a preset with only props (no className/classNames) still suppresses the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { button: { base: 'global-base' } },
            presets: { button: { primary: { props: { variant: 'outlined' } } } },
          }}
        >
          <Button preset="primary">Click</Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('global-base')).toBe(false)
      expect(button.classList.contains('border-solid')).toBe(true)
    })

    test('an unknown preset name falls back to the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { button: { base: 'global-base' } },
            presets: { button: { primary: { classNames: { base: 'preset-base' } } } },
          }}
        >
          <Button preset="unknown">Click</Button>
        </EasyUIProvider>,
      )

      const button = screen.getByRole('button')
      expect(button.classList.contains('global-base')).toBe(true)
      expect(button.classList.contains('preset-base')).toBe(false)
    })
  })
})
