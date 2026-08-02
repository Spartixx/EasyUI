import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { Alert } from './index'
import { EasyUIProvider } from '../../../providers'

const iconWrapperOf = (alert: HTMLElement) => alert.firstElementChild as HTMLElement
const statusIconPathOf = (alert: HTMLElement) =>
  iconWrapperOf(alert).querySelector('path')?.getAttribute('d') ?? ''

describe('Alert', () => {
  test('renders the title', () => {
    render(<Alert title="Update available" />)
    expect(screen.getByText('Update available')).toBeDefined()
  })

  test('renders the description when provided', () => {
    render(<Alert title="Update available" description="A new version is ready." />)
    expect(screen.getByText('A new version is ready.')).toBeDefined()
  })

  test('does not render a description element when not provided', () => {
    render(<Alert title="Update available" />)
    expect(screen.getByRole('alert').children.length).toBe(2)
  })

  test('the description sits on a second row, under the title', () => {
    render(<Alert title="Update available" description="Helper text" />)
    expect(screen.getByText('Helper text').classList.contains('col-start-2')).toBe(true)
  })

  test('the description accepts a React node', () => {
    render(
      <Alert
        title="Update available"
        description={
          <ul data-testid="description-list">
            <li>First item</li>
            <li>Second item</li>
          </ul>
        }
      />,
    )
    expect(screen.getByTestId('description-list').tagName).toBe('UL')
    expect(screen.getByText('Second item')).toBeDefined()
  })

  test('the description container is a div, so it can host block content', () => {
    render(<Alert title="Update available" description="Helper text" />)
    expect(screen.getByText('Helper text').tagName).toBe('DIV')
  })

  test('the description starts on the first column when the icon is hidden', () => {
    render(<Alert title="Update available" description="Helper text" isIconHidden />)
    expect(screen.getByText('Helper text').classList.contains('col-start-2')).toBe(false)
  })

  test('has the alert role', () => {
    render(<Alert title="Update available" />)
    expect(screen.getByRole('alert')).toBeDefined()
  })

  test('role can be overridden through native props', () => {
    render(<Alert title="Update available" role="status" />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  test('applies the variant and color surface classes', () => {
    render(<Alert title="Update available" variant="outlined" color="primary" />)
    const alert = screen.getByRole('alert')
    expect(alert.classList.contains('inset-ring-(--easyui-color-primary)')).toBe(true)
    expect(alert.classList.contains('text-(--easyui-color-primary)')).toBe(true)
  })

  test('the outlined variant tints the icon wrapper, since its own surface is transparent', () => {
    render(<Alert title="Update available" variant="outlined" color="primary" />)
    const wrapper = iconWrapperOf(screen.getByRole('alert'))
    expect(wrapper.classList.contains('bg-(--easyui-color-primary)/10')).toBe(true)
  })

  test('the other variants leave the icon wrapper background transparent', () => {
    for (const variant of ['flat', 'faded'] as const) {
      const { unmount } = render(<Alert title="Update available" variant={variant} color="primary" />)
      const wrapper = iconWrapperOf(screen.getByRole('alert'))
      expect(wrapper.classList.contains('bg-(--easyui-color-primary)/10')).toBe(false)
      unmount()
    }
  })

  test('the faded variant combines a softened ring and a tinted background', () => {
    render(<Alert title="Update available" variant="faded" color="primary" />)
    const alert = screen.getByRole('alert')
    expect(alert.classList.contains('inset-ring-(--easyui-color-primary)/40')).toBe(true)
    expect(alert.classList.contains('inset-ring-(--easyui-color-primary)')).toBe(false)
    expect(alert.classList.contains('bg-(--easyui-color-primary)/10')).toBe(true)
    expect(alert.classList.contains('text-(--easyui-color-primary-dark)')).toBe(true)
  })

  test('outlined and faded use an inset ring, so they do not grow taller than solid', () => {
    for (const variant of ['outlined', 'faded'] as const) {
      const { unmount } = render(<Alert title="Update available" variant={variant} color="primary" />)
      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('inset-ring-[length:var(--easyui-border-width-md)]')).toBe(true)
      expect(alert.classList.contains('border-solid')).toBe(false)
      unmount()
    }
  })

  test('defaults to the flat variant with the default color', () => {
    render(<Alert title="Update available" />)
    expect(screen.getByRole('alert').classList.contains('bg-(--easyui-color-default)/20')).toBe(true)
  })

  describe('status icon', () => {
    test('renders the filled circle for the default, primary and secondary colors', () => {
      render(<Alert title="Info" color="secondary" />)
      const path = statusIconPathOf(screen.getByRole('alert'))
      expect(path.startsWith('M12 2a10 10')).toBe(true)
      expect(path).toContain('M12 6.4a1.2')
    })

    test('renders the filled circle with a check for the success color', () => {
      render(<Alert title="Saved" color="success" />)
      const path = statusIconPathOf(screen.getByRole('alert'))
      expect(path.startsWith('M12 2a10 10')).toBe(true)
      expect(path).toContain('M6.75 13.25')
    })

    test('renders the shield for the warning color', () => {
      render(<Alert title="Careful" color="warning" />)
      expect(statusIconPathOf(screen.getByRole('alert')).startsWith('M12 2 4 5')).toBe(true)
    })

    test('renders the hexagon for the error color', () => {
      render(<Alert title="Failed" color="error" />)
      expect(statusIconPathOf(screen.getByRole('alert')).startsWith('M12 2 20.66 7')).toBe(true)
    })

    test('a custom icon replaces the default one', () => {
      render(<Alert title="Update available" icon={<span data-testid="custom-icon">*</span>} />)
      const alert = screen.getByRole('alert')
      expect(iconWrapperOf(alert).contains(screen.getByTestId('custom-icon'))).toBe(true)
      expect(iconWrapperOf(alert).querySelector('svg')).toBeNull()
    })

    test('isIconHidden removes the icon entirely', () => {
      render(<Alert title="Update available" isIconHidden />)
      const alert = screen.getByRole('alert')
      expect(alert.querySelector('svg')).toBeNull()
      expect(alert.firstElementChild?.textContent).toBe('Update available')
    })

    test('isIconWrapperHidden drops the circle but keeps the icon', () => {
      render(<Alert title="Update available" isIconWrapperHidden />)
      const wrapper = iconWrapperOf(screen.getByRole('alert'))
      expect(wrapper.classList.contains('rounded-full')).toBe(false)
      expect(wrapper.querySelector('svg')).not.toBeNull()
    })

    test('the wrapper is a shadowed circle', () => {
      render(<Alert title="Update available" />)
      const wrapper = iconWrapperOf(screen.getByRole('alert'))
      expect(wrapper.classList.contains('rounded-full')).toBe(true)
      expect(wrapper.classList.contains('shadow-sm')).toBe(true)
      expect(wrapper.classList.contains('border-(--easyui-color-default-dark)/10')).toBe(true)
    })

    test('the wrapper border follows the color prop', () => {
      render(<Alert title="Failed" color="error" />)
      const wrapper = iconWrapperOf(screen.getByRole('alert'))
      expect(wrapper.classList.contains('border-(--easyui-color-error-dark)/10')).toBe(true)
      expect(wrapper.classList.contains('border-(--easyui-color-default-dark)/10')).toBe(false)
    })

    test('the solid variant drops the circle without any prop', () => {
      render(<Alert title="Saved" color="success" variant="solid" />)
      const wrapper = iconWrapperOf(screen.getByRole('alert'))
      expect(wrapper.classList.contains('rounded-full')).toBe(false)
      expect(wrapper.classList.contains('shadow-sm')).toBe(false)
      expect(wrapper.querySelector('svg')).not.toBeNull()
    })

    test('the solid variant keeps the wrapper footprint, so every variant is the same height', () => {
      render(<Alert title="Saved" color="success" variant="solid" />)
      expect(iconWrapperOf(screen.getByRole('alert')).classList.contains('size-10')).toBe(true)
    })
  })

  describe('closing', () => {
    test('renders no close button by default', () => {
      render(<Alert title="Update available" />)
      expect(screen.queryByRole('button')).toBeNull()
    })

    test('renders a close button labelled "Close" when isClosable', () => {
      render(<Alert title="Update available" isClosable />)
      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Close')
    })

    test('clicking the close button hides the alert and calls onClose', async () => {
      const onClose = vi.fn()
      render(<Alert title="Update available" isClosable onClose={onClose} />)
      await userEvent.click(screen.getByRole('button'))
      expect(onClose).toHaveBeenCalledOnce()
      expect(screen.queryByRole('alert')).toBeNull()
    })

    test('hides itself even without an onClose handler', async () => {
      render(<Alert title="Update available" isClosable />)
      await userEvent.click(screen.getByRole('button'))
      expect(screen.queryByRole('alert')).toBeNull()
    })

    test('a custom closeIcon replaces the default one', () => {
      render(<Alert title="Update available" isClosable closeIcon={<span data-testid="close-icon">x</span>} />)
      expect(screen.getByRole('button').contains(screen.getByTestId('close-icon'))).toBe(true)
    })

    test('closeButtonLabel overrides the default label', () => {
      render(<Alert title="Update available" isClosable closeButtonLabel="Dismiss" />)
      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Dismiss')
    })

    test('defaults.alert.closeButtonLabel is used when no prop is given', () => {
      render(
        <EasyUIProvider config={{ defaults: { alert: { closeButtonLabel: 'Fermer' } } }}>
          <Alert title="Update available" isClosable />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Fermer')
    })

    test('the closeButtonLabel prop wins over the configured default', () => {
      render(
        <EasyUIProvider config={{ defaults: { alert: { closeButtonLabel: 'Fermer' } } }}>
          <Alert title="Update available" isClosable closeButtonLabel="Dismiss" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Dismiss')
    })
  })

  test('renders endContent', () => {
    render(<Alert title="Update available" endContent={<span data-testid="end">Install</span>} />)
    expect(screen.getByRole('alert').contains(screen.getByTestId('end'))).toBe(true)
  })

  test('is full width by default', () => {
    render(<Alert title="Update available" />)
    expect(screen.getByRole('alert').classList.contains('w-full')).toBe(true)
  })

  test('className overrides the default full width', () => {
    render(<Alert title="Update available" className="w-64" />)
    const alert = screen.getByRole('alert')
    expect(alert.classList.contains('w-64')).toBe(true)
    expect(alert.classList.contains('w-full')).toBe(false)
  })

  test('applies classNames to every slot', () => {
    render(
      <Alert
        title="Update available"
        description="Helper text"
        isClosable
        endContent={<span data-testid="end">Install</span>}
        classNames={{
          base: 'custom-base',
          iconWrapper: 'custom-icon-wrapper',
          icon: 'custom-icon',
          title: 'custom-title',
          description: 'custom-description',
          endContent: 'custom-end-content',
          closeButton: 'custom-close-button',
        }}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert.classList.contains('custom-base')).toBe(true)
    expect(iconWrapperOf(alert).classList.contains('custom-icon-wrapper')).toBe(true)
    expect(iconWrapperOf(alert).firstElementChild?.classList.contains('custom-icon')).toBe(true)
    expect(screen.getByText('Update available').classList.contains('custom-title')).toBe(true)
    expect(screen.getByText('Helper text').classList.contains('custom-description')).toBe(true)
    expect(screen.getByTestId('end').parentElement?.classList.contains('custom-end-content')).toBe(true)
    expect(screen.getByRole('button').classList.contains('custom-close-button')).toBe(true)
  })

  test('forwards ref to the root div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert title="Update available" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('passes native props to the root element', () => {
    render(<Alert title="Update available" id="update-alert" />)
    expect(screen.getByRole('alert').getAttribute('id')).toBe('update-alert')
  })

  describe('global wrappers config', () => {
    test('renders unchanged when no provider is present', () => {
      render(<Alert title="Update available" />)
      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('grid')).toBe(true)
      expect(alert.className).not.toContain('  ')
    })

    test('applies a global alert wrapper class to every slot of the component', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: {
              alert: {
                base: 'global-base',
                iconWrapper: 'global-icon-wrapper',
                icon: 'global-icon',
                title: 'global-title',
                description: 'global-description',
                endContent: 'global-end-content',
                closeButton: 'global-close-button',
              },
            },
          }}
        >
          <Alert
            title="Update available"
            description="Helper text"
            isClosable
            endContent={<span data-testid="end">Install</span>}
          />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('global-base')).toBe(true)
      expect(iconWrapperOf(alert).classList.contains('global-icon-wrapper')).toBe(true)
      expect(iconWrapperOf(alert).firstElementChild?.classList.contains('global-icon')).toBe(true)
      expect(screen.getByText('Update available').classList.contains('global-title')).toBe(true)
      expect(screen.getByText('Helper text').classList.contains('global-description')).toBe(true)
      expect(screen.getByTestId('end').parentElement?.classList.contains('global-end-content')).toBe(true)
      expect(screen.getByRole('button').classList.contains('global-close-button')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('renders unchanged when no preset prop is set, even if presets are configured', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              alert: {
                danger: {
                  props: { variant: 'outlined', color: 'error' },
                  classNames: { base: 'preset-base' },
                },
              },
            },
          }}
        >
          <Alert title="Update available" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('preset-base')).toBe(false)
      expect(alert.classList.contains('bg-(--easyui-color-default)/20')).toBe(true)
    })

    test('preset props change the rendered classes', () => {
      render(
        <EasyUIProvider
          config={{ presets: { alert: { danger: { props: { variant: 'outlined', color: 'error' } } } } }}
        >
          <Alert title="Update available" preset="danger" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('inset-ring-(--easyui-color-error)')).toBe(true)
      expect(alert.classList.contains('bg-(--easyui-color-default)/20')).toBe(false)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider
          config={{ presets: { alert: { danger: { props: { variant: 'outlined', color: 'error' } } } } }}
        >
          <Alert title="Update available" preset="danger" variant="solid" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('bg-(--easyui-color-error)')).toBe(true)
      expect(alert.classList.contains('inset-ring-(--easyui-color-error)')).toBe(false)
    })

    test('preset className and classNames replace the global wrapper across slots', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { alert: { base: 'global-base', title: 'global-title' } },
            presets: {
              alert: {
                danger: {
                  className: 'preset-class',
                  classNames: { base: 'preset-base', title: 'preset-title' },
                },
              },
            },
          }}
        >
          <Alert title="Update available" preset="danger" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('preset-class')).toBe(true)
      expect(alert.classList.contains('preset-base')).toBe(true)
      expect(alert.classList.contains('global-base')).toBe(false)
      expect(screen.getByText('Update available').classList.contains('preset-title')).toBe(true)
      expect(screen.getByText('Update available').classList.contains('global-title')).toBe(false)
    })

    test('a preset with only props (no className/classNames) still suppresses the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { alert: { base: 'global-base' } },
            presets: { alert: { danger: { props: { variant: 'outlined' } } } },
          }}
        >
          <Alert title="Update available" preset="danger" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('global-base')).toBe(false)
      expect(alert.classList.contains('inset-ring-[length:var(--easyui-border-width-md)]')).toBe(true)
    })

    test('an unknown preset name falls back to the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { alert: { base: 'global-base' } },
            presets: { alert: { danger: { classNames: { base: 'preset-base' } } } },
          }}
        >
          <Alert title="Update available" preset="unknown" />
        </EasyUIProvider>,
      )

      const alert = screen.getByRole('alert')
      expect(alert.classList.contains('global-base')).toBe(true)
      expect(alert.classList.contains('preset-base')).toBe(false)
    })
  })
})
