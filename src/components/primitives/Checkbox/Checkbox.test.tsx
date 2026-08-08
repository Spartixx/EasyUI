import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef, useState } from 'react'
import { Checkbox } from './index'
import { EasyUIProvider } from '../../../providers'
import type { EasyUIConfig } from '../../../config/easyui.config.types'

const checkboxOf = () => screen.getByRole('checkbox') as HTMLInputElement
const boxOf = () => checkboxOf().nextElementSibling as HTMLElement

function renderCheckbox(element: React.ReactElement, config?: EasyUIConfig) {
  if (config) {
    return render(<EasyUIProvider config={config}>{element}</EasyUIProvider>)
  }
  return render(element)
}

describe('Checkbox', () => {
  test('renders an unchecked checkbox by default', () => {
    render(<Checkbox label="Accept" />)
    expect(checkboxOf().checked).toBe(false)
  })

  test('renders the label', () => {
    render(<Checkbox label="Accept the terms" />)
    expect(screen.getByText('Accept the terms')).toBeDefined()
  })

  test('associates the label with the input', async () => {
    render(<Checkbox label="Accept" />)
    await userEvent.click(screen.getByText('Accept'))
    expect(checkboxOf().checked).toBe(true)
  })

  test('renders without a label', () => {
    render(<Checkbox aria-label="Select row" />)
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeDefined()
  })

  test('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox label="Accept" ref={ref} />)
    expect(ref.current?.type).toBe('checkbox')
  })

  describe('selection', () => {
    test('toggles when uncontrolled', async () => {
      render(<Checkbox label="Accept" />)
      await userEvent.click(checkboxOf())
      expect(checkboxOf().checked).toBe(true)
      await userEvent.click(checkboxOf())
      expect(checkboxOf().checked).toBe(false)
    })

    test('honours defaultSelected', () => {
      render(<Checkbox label="Accept" defaultSelected />)
      expect(checkboxOf().checked).toBe(true)
    })

    test('calls onValueChange with the next state', async () => {
      const onValueChange = vi.fn()
      render(<Checkbox label="Accept" onValueChange={onValueChange} />)
      await userEvent.click(checkboxOf())
      expect(onValueChange).toHaveBeenCalledWith(true)
    })

    test('stays on the controlled value when the parent ignores the change', async () => {
      render(<Checkbox label="Accept" isSelected={false} />)
      await userEvent.click(checkboxOf())
      expect(checkboxOf().checked).toBe(false)
    })

    test('follows the controlled value when the parent updates it', async () => {
      function ControlledCheckbox() {
        const [isSelected, setIsSelected] = useState(false)
        return <Checkbox label="Accept" isSelected={isSelected} onValueChange={setIsSelected} />
      }
      render(<ControlledCheckbox />)
      await userEvent.click(checkboxOf())
      expect(checkboxOf().checked).toBe(true)
    })
  })

  describe('indeterminate', () => {
    test('sets the DOM property, which has no HTML attribute counterpart', () => {
      render(<Checkbox label="Select all" isIndeterminate />)
      expect(checkboxOf().indeterminate).toBe(true)
    })

    test('exposes aria-checked as mixed', () => {
      render(<Checkbox label="Select all" isIndeterminate />)
      expect(checkboxOf().getAttribute('aria-checked')).toBe('mixed')
    })

    test('clears the DOM property when it becomes false', () => {
      const { rerender } = render(<Checkbox label="Select all" isIndeterminate />)
      rerender(<Checkbox label="Select all" isIndeterminate={false} />)
      expect(checkboxOf().indeterminate).toBe(false)
    })

    test('fills the box even when unchecked', () => {
      render(<Checkbox label="Select all" isIndeterminate />)
      expect(boxOf().classList.contains('border-transparent')).toBe(true)
    })
  })

  describe('states', () => {
    test('disables the native input', () => {
      render(<Checkbox label="Accept" isDisabled />)
      expect(checkboxOf().disabled).toBe(true)
    })

    test('does not toggle when read only', async () => {
      render(<Checkbox label="Accept" isReadOnly />)
      await userEvent.click(checkboxOf())
      expect(checkboxOf().checked).toBe(false)
    })

    test('marks the input as required', () => {
      render(<Checkbox label="Accept" isRequired />)
      expect(checkboxOf().required).toBe(true)
      expect(checkboxOf().getAttribute('aria-required')).toBe('true')
    })
  })

  describe('description and error', () => {
    test('renders the description and links it to the input', () => {
      render(<Checkbox label="Accept" description="You can change this later" />)
      const describedBy = checkboxOf().getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      expect(screen.getByText('You can change this later').id).toBe(describedBy)
    })

    test('renders an external error and flags the input as invalid', () => {
      render(<Checkbox label="Accept" error="You must accept" />)
      expect(screen.getByRole('alert').textContent).toBe('You must accept')
      expect(checkboxOf().getAttribute('aria-invalid')).toBe('true')
    })

    test('replaces the description by the error when the description sits under the element', () => {
      render(
        <Checkbox
          label="Accept"
          description="Helper text"
          descriptionPlacement="element"
          error="You must accept"
        />,
      )
      expect(screen.queryByText('Helper text')).toBeNull()
      expect(screen.getByRole('alert').textContent).toBe('You must accept')
    })
  })

  describe('validation', () => {
    test('shows the required message on blur when unchecked', async () => {
      render(<Checkbox label="Accept" isRequired />)
      await userEvent.click(checkboxOf())
      await userEvent.click(checkboxOf())
      await userEvent.tab()
      expect(screen.getByRole('alert').textContent).toBe('This field is required')
    })

    test('runs the custom validations', async () => {
      render(
        <Checkbox
          label="Accept"
          validations={[(isSelected) => (isSelected ? null : 'Please confirm')]}
        />,
      )
      await userEvent.click(checkboxOf())
      await userEvent.click(checkboxOf())
      await userEvent.tab()
      expect(screen.getByRole('alert').textContent).toBe('Please confirm')
    })

    test('stays silent when the form controls the field', async () => {
      render(<Checkbox label="Accept" isRequired isFormControlled />)
      await userEvent.click(checkboxOf())
      await userEvent.click(checkboxOf())
      await userEvent.tab()
      expect(screen.queryByRole('alert')).toBeNull()
    })

    test('uses the required message of the global defaults', async () => {
      renderCheckbox(<Checkbox label="Accept" isRequired />, {
        defaults: { requiredMessage: 'Champ obligatoire' },
      })
      await userEvent.click(checkboxOf())
      await userEvent.click(checkboxOf())
      await userEvent.tab()
      expect(screen.getByRole('alert').textContent).toBe('Champ obligatoire')
    })
  })

  describe('icons', () => {
    test('renders a custom check icon', () => {
      render(<Checkbox label="Accept" defaultSelected icon={<span data-testid="custom-check" />} />)
      expect(screen.getByTestId('custom-check')).toBeDefined()
    })

    test('renders a custom indeterminate icon', () => {
      render(
        <Checkbox label="Select all" isIndeterminate indeterminateIcon={<span data-testid="custom-dash" />} />,
      )
      expect(screen.getByTestId('custom-dash')).toBeDefined()
    })

    test('takes the check icon from the global defaults', () => {
      renderCheckbox(<Checkbox label="Accept" defaultSelected />, {
        defaults: { checkbox: { icon: <span data-testid="global-check" /> } },
      })
      expect(screen.getByTestId('global-check')).toBeDefined()
    })

    test('takes the indeterminate icon from the global defaults', () => {
      renderCheckbox(<Checkbox label="Select all" isIndeterminate />, {
        defaults: { checkbox: { indeterminateIcon: <span data-testid="global-dash" /> } },
      })
      expect(screen.getByTestId('global-dash')).toBeDefined()
    })

    test('the instance icon wins over the global default', () => {
      renderCheckbox(<Checkbox label="Accept" defaultSelected icon={<span data-testid="instance-check" />} />, {
        defaults: { checkbox: { icon: <span data-testid="global-check" /> } },
      })
      expect(screen.getByTestId('instance-check')).toBeDefined()
      expect(screen.queryByTestId('global-check')).toBeNull()
    })

    test('renders no icon while unchecked', () => {
      render(<Checkbox label="Accept" />)
      expect(boxOf().children.length).toBe(0)
    })
  })

  describe('global wrappers config', () => {
    test('renders unchanged without a provider', () => {
      render(<Checkbox label="Accept" />)
      expect(boxOf().classList.contains('global-wrapper')).toBe(false)
    })

    test('applies the global wrapper of a slot', () => {
      renderCheckbox(<Checkbox label="Accept" />, {
        wrappers: { checkbox: { wrapper: 'global-wrapper' } },
      })
      expect(boxOf().classList.contains('global-wrapper')).toBe(true)
    })

    test('the classNames of the instance win over the global wrapper', () => {
      renderCheckbox(<Checkbox label="Accept" classNames={{ wrapper: 'instance-wrapper' }} />, {
        wrappers: { checkbox: { wrapper: 'global-wrapper' } },
      })
      expect(boxOf().classList.contains('instance-wrapper')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('renders unchanged without a preset', () => {
      renderCheckbox(<Checkbox label="Accept" />, {
        presets: { checkbox: { compact: { props: { size: 'sm' } } } },
      })
      expect(boxOf().classList.contains('size-5')).toBe(true)
    })

    test('a preset can set props', () => {
      renderCheckbox(<Checkbox label="Accept" preset="compact" />, {
        presets: { checkbox: { compact: { props: { size: 'sm' } } } },
      })
      expect(boxOf().classList.contains('size-4')).toBe(true)
    })

    test('the props of the instance win over the preset', () => {
      renderCheckbox(<Checkbox label="Accept" preset="compact" size="lg" />, {
        presets: { checkbox: { compact: { props: { size: 'sm' } } } },
      })
      expect(boxOf().classList.contains('size-6')).toBe(true)
    })

    test('an unknown preset name falls back to the default rendering', () => {
      renderCheckbox(<Checkbox label="Accept" preset="missing" />, {
        presets: { checkbox: {} },
      })
      expect(boxOf().classList.contains('size-5')).toBe(true)
    })
  })
})
