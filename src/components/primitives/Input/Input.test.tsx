import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { Input } from './index'
import { EasyUIProvider } from '../../../providers'

describe('Input', () => {
  test('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeDefined()
  })

  test('is disabled when isDisabled is true', () => {
    render(<Input isDisabled />)
    expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled when isLoading', () => {
    render(<Input isLoading />)
    expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
  })

  test('shows spinner when isLoading', () => {
    render(<Input isLoading />)
    const wrapper = screen.getByRole('textbox').parentElement
    expect(wrapper?.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  test('has required attribute when isRequired', () => {
    render(<Input isRequired />)
    expect(screen.getByRole('textbox').hasAttribute('required')).toBe(true)
  })

  test('has readOnly attribute when isReadOnly', () => {
    render(<Input isReadOnly />)
    expect(screen.getByRole('textbox').hasAttribute('readOnly')).toBe(true)
  })

  test('applies className to the root element', () => {
    const { container } = render(<Input className="custom-root" />)
    expect((container.firstChild as HTMLElement).classList.contains('custom-root')).toBe(true)
  })

  test('applies classNames.inputWrapper to the wrapper element', () => {
    render(<Input classNames={{ inputWrapper: 'custom-wrapper' }} />)
    const input = screen.getByRole('textbox')
    expect(input.parentElement?.classList.contains('custom-wrapper')).toBe(true)
  })

  test('applies classNames.input to the input element', () => {
    render(<Input classNames={{ input: 'custom-input' }} />)
    expect(screen.getByRole('textbox').classList.contains('custom-input')).toBe(true)
  })

  test('renders startContent inside wrapper by default', () => {
    render(<Input startContent={<span data-testid="icon">@</span>} />)
    const input = screen.getByRole('textbox')
    expect(input.parentElement?.contains(screen.getByTestId('icon'))).toBe(true)
  })

  test('renders endContent inside wrapper by default', () => {
    render(<Input endContent={<span data-testid="icon">@</span>} />)
    const input = screen.getByRole('textbox')
    expect(input.parentElement?.contains(screen.getByTestId('icon'))).toBe(true)
  })

  test('renders startContent outside wrapper when placement is outside', () => {
    render(<Input startContent={<span data-testid="icon">@</span>} startContentPlacement="outside" />)
    const input = screen.getByRole('textbox')
    const icon = screen.getByTestId('icon')
    expect(input.parentElement?.contains(icon)).toBe(false)
    expect(icon.parentElement?.nextElementSibling).toBe(input.parentElement)
  })

  test('renders endContent outside wrapper when placement is outside', () => {
    render(<Input endContent={<span data-testid="icon">@</span>} endContentPlacement="outside" />)
    const input = screen.getByRole('textbox')
    const icon = screen.getByTestId('icon')
    expect(input.parentElement?.contains(icon)).toBe(false)
    expect(icon.parentElement?.previousElementSibling).toBe(input.parentElement)
  })

  test('calls onChange when value changes', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  test('calls onValueChange with the new value when value changes', async () => {
    const onValueChange = vi.fn()
    render(<Input onValueChange={onValueChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(onValueChange).toHaveBeenCalledWith('h')
  })

  test('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('passes native props to input element', () => {
    render(<Input placeholder="Enter text" type="email" />)
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('placeholder')).toBe('Enter text')
    expect(input.getAttribute('type')).toBe('email')
  })

  test('renders label when provided', () => {
    render(<Input label="Email address" />)
    expect(screen.getByText('Email address')).toBeDefined()
  })

  test('links label to input via htmlFor', () => {
    render(<Input label="Email address" />)
    const label = screen.getByText(/Email address/)
    const input = screen.getByRole('textbox')
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  test('shows asterisk in label when isRequired', () => {
    render(<Input label="Email" isRequired />)
    const label = screen.getByText(/Email/)
    expect(label.textContent).toContain('*')
  })

  test('renders label inside the input wrapper when labelPlacement is inside', () => {
    const { container } = render(<Input label="Email" labelPlacement="inside" />)
    const input = screen.getByRole('textbox')
    const label = container.querySelector(`label[for="${input.id}"]`)!
    const rootDiv = container.firstChild!
    expect(Array.from(rootDiv.childNodes).includes(label)).toBe(false)
    expect(input.parentElement?.parentElement?.contains(label)).toBe(true)
  })

  test('renders label above the input wrapper by default', () => {
    const { container } = render(<Input label="Email" />)
    const input = screen.getByRole('textbox')
    const label = container.querySelector(`label[for="${input.id}"]`)!
    const rootDiv = container.firstChild!
    expect(Array.from(rootDiv.childNodes).includes(label)).toBe(true)
  })

  test('label inside: input is still accessible via the label', () => {
    render(<Input label="Email" labelPlacement="inside" />)
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement)
  })

  test('label inside: shows asterisk when isRequired', () => {
    const { container } = render(<Input label="Email" labelPlacement="inside" isRequired />)
    const input = screen.getByRole('textbox')
    const label = container.querySelector(`label[for="${input.id}"]`)!
    expect(label.textContent).toContain('*')
  })

  describe('color theming', () => {
    test('non-bordered variant: input text reflects color prop', () => {
      render(<Input variant="flat" color="primary" />)
      expect(screen.getByRole('textbox').classList.contains('text-(--easyui-color-primary-dark)')).toBe(true)
    })

    test('bordered variant: input text is not affected by color prop', () => {
      render(<Input variant="bordered" color="primary" />)
      expect(screen.getByRole('textbox').classList.contains('text-(--easyui-color-primary-dark)')).toBe(false)
    })

    test('flat variant: wrapper background reflects color prop', () => {
      render(<Input variant="flat" color="primary" />)
      const wrapper = screen.getByRole('textbox').parentElement!
      expect(wrapper.classList.contains('bg-(--easyui-color-primary)/30')).toBe(true)
    })

    test('flat variant: wrapper background uses the default color by default', () => {
      render(<Input variant="flat" />)
      const wrapper = screen.getByRole('textbox').parentElement!
      expect(wrapper.classList.contains('bg-(--easyui-color-default)/40')).toBe(true)
    })

    test('faded variant: wrapper background reflects color prop', () => {
      render(<Input variant="faded" color="primary" />)
      const wrapper = screen.getByRole('textbox').parentElement!
      expect(wrapper.classList.contains('bg-(--easyui-color-primary)/30')).toBe(true)
    })

    test('faded variant: wrapper background uses the default color by default', () => {
      render(<Input variant="faded" />)
      const wrapper = screen.getByRole('textbox').parentElement!
      expect(wrapper.classList.contains('bg-(--easyui-color-default)/40')).toBe(true)
    })

    test('non-bordered variant: label reflects color prop', () => {
      const { container } = render(<Input label="Email" variant="flat" color="primary" />)
      const input = screen.getByRole('textbox')
      const label = container.querySelector(`label[for="${input.id}"]`)!
      expect(label.classList.contains('text-(--easyui-color-primary-dark)')).toBe(true)
    })

    test('bordered variant: label is not affected by color prop', () => {
      const { container } = render(<Input label="Email" variant="bordered" color="primary" />)
      const input = screen.getByRole('textbox')
      const label = container.querySelector(`label[for="${input.id}"]`)!
      expect(label.classList.contains('text-(--easyui-color-primary-dark)')).toBe(false)
    })

    test('label turns to error color when error is present regardless of variant', () => {
      const { container } = render(<Input label="Email" variant="bordered" color="primary" error="Invalid" />)
      const input = screen.getByRole('textbox')
      const label = container.querySelector(`label[for="${input.id}"]`)!
      expect(label.classList.contains('text-(--easyui-color-error-dark)')).toBe(true)
    })

    test('input text turns to error color when error is present regardless of variant', () => {
      render(<Input variant="bordered" color="primary" error="Invalid" />)
      expect(screen.getByRole('textbox').classList.contains('text-(--easyui-color-error-dark)')).toBe(true)
    })
  })

  test('renders description when provided', () => {
    render(<Input description="We will never share your email." />)
    expect(screen.getByText('We will never share your email.')).toBeDefined()
  })

  test('renders error when provided', () => {
    render(<Input error="This field is required." />)
    expect(screen.getByText('This field is required.')).toBeDefined()
  })

  test('sets aria-invalid when error is present', () => {
    render(<Input error="Invalid value" />)
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
  })

  test('does not set aria-invalid when there is no error', () => {
    render(<Input />)
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBeNull()
  })

  test('sets aria-describedby to the description id when description is provided', () => {
    render(<Input description="Helper text" />)
    const input = screen.getByRole('textbox')
    const description = screen.getByText('Helper text')
    expect(input.getAttribute('aria-describedby')).toBe(description.id)
  })

  test('sets aria-describedby to the error id when error is present', () => {
    render(<Input error="Invalid value" />)
    const input = screen.getByRole('textbox')
    const error = screen.getByText('Invalid value')
    expect(input.getAttribute('aria-describedby')).toBe(error.id)
  })

  test('sets aria-describedby to both description and error ids when descriptionPlacement is label and error is present', () => {
    render(<Input description="Helper text" descriptionPlacement="label" error="Invalid value" />)
    const input = screen.getByRole('textbox')
    const description = screen.getByText('Helper text')
    const error = screen.getByText('Invalid value')
    expect(input.getAttribute('aria-describedby')).toBe(`${description.id} ${error.id}`)
  })

  test('does not set aria-describedby when neither description nor error is provided', () => {
    render(<Input />)
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
  })

  test('hides description and shows error when both are provided', () => {
    render(<Input description="Helper text" error="Error message" />)
    expect(screen.queryByText('Helper text')).toBeNull()
    expect(screen.getByText('Error message')).toBeDefined()
  })

  test('shows validation error on blur when validator fails', async () => {
    render(
      <Input
        validations={[(v) => (v.length > 0 ? null : 'Required')]}
      />,
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.tab()
    expect(screen.getByText('Required')).toBeDefined()
  })

  test('clears validation error on blur when validator passes', async () => {
    render(
      <Input
        validations={[(v) => (v.length > 0 ? null : 'Required')]}
      />,
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hello')
    await userEvent.tab()
    expect(screen.queryByText('Required')).toBeNull()
  })

  test('external error prop takes precedence over validation error', async () => {
    render(
      <Input
        error="External error"
        validations={[(v) => (v.length > 0 ? null : 'Validation error')]}
      />,
    )
    await userEvent.tab()
    expect(screen.getByText('External error')).toBeDefined()
    expect(screen.queryByText('Validation error')).toBeNull()
  })

  describe('required self-validation', () => {
    test('shows the required error on blur when empty and isRequired', async () => {
      render(<Input isRequired />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('does not show the required error on blur when a value is present', async () => {
      render(<Input isRequired />)
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'hello')
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
    })

    test('shows a custom isRequiredMessage', async () => {
      render(<Input isRequired isRequiredMessage="Please fill this in" />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('Please fill this in')).toBeDefined()
    })

    test('resolves the required message from the global config default', async () => {
      render(
        <EasyUIProvider config={{ defaults: { requiredMessage: 'Champ obligatoire' } }}>
          <Input isRequired />
        </EasyUIProvider>,
      )
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('Champ obligatoire')).toBeDefined()
    })

    test('clears the required error as the user types after it is shown', async () => {
      render(<Input isRequired />)
      const input = screen.getByRole('textbox')
      await userEvent.click(input)
      await userEvent.tab()
      expect(screen.getByText('This field is required')).toBeDefined()
      await userEvent.type(input, 'a')
      expect(screen.queryByText('This field is required')).toBeNull()
    })

    test('validates on Enter', async () => {
      render(<Input isRequired />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.keyboard('{Enter}')
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('does not self-validate when isFormControlled', async () => {
      render(<Input isRequired isFormControlled />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
    })
  })

  describe('number stepper', () => {
    const getStepperButtons = (input: HTMLElement) => {
      const buttons = input.parentElement!.querySelectorAll('button')
      return { incrementButton: buttons[0], decrementButton: buttons[1] }
    }

    test('renders increment and decrement buttons for type number', () => {
      render(<Input type="number" />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(incrementButton).toBeInstanceOf(HTMLButtonElement)
      expect(decrementButton).toBeInstanceOf(HTMLButtonElement)
    })

    test('does not render a stepper for non-number inputs', () => {
      render(<Input type="text" />)
      expect(screen.getByRole('textbox').parentElement!.querySelector('button')).toBeNull()
    })

    test('does not render a stepper when showStepper is false', () => {
      render(<Input type="number" showStepper={false} />)
      expect(screen.getByRole('spinbutton').parentElement!.querySelector('button')).toBeNull()
    })

    test('does not render a stepper when the field is read-only', () => {
      render(<Input type="number" isReadOnly />)
      expect(screen.getByRole('spinbutton').parentElement!.querySelector('button')).toBeNull()
    })

    test('stepper buttons are removed from the tab order', () => {
      render(<Input type="number" />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(incrementButton.getAttribute('tabindex')).toBe('-1')
      expect(decrementButton.getAttribute('tabindex')).toBe('-1')
    })

    test('increment button increases the value by the step', async () => {
      render(<Input type="number" defaultValue={3} step={2} />)
      const input = screen.getByRole('spinbutton') as HTMLInputElement
      const { incrementButton } = getStepperButtons(input)
      await userEvent.click(incrementButton)
      expect(input.value).toBe('5')
    })

    test('decrement button decreases the value by the step', async () => {
      render(<Input type="number" defaultValue={3} step={2} />)
      const input = screen.getByRole('spinbutton') as HTMLInputElement
      const { decrementButton } = getStepperButtons(input)
      await userEvent.click(decrementButton)
      expect(input.value).toBe('1')
    })

    test('increment button is disabled when the value is at the max', () => {
      render(<Input type="number" defaultValue={10} min={0} max={10} />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(incrementButton.hasAttribute('disabled')).toBe(true)
      expect(decrementButton.hasAttribute('disabled')).toBe(false)
    })

    test('decrement button is disabled when the value is at the min', () => {
      render(<Input type="number" defaultValue={0} min={0} max={10} />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(decrementButton.hasAttribute('disabled')).toBe(true)
      expect(incrementButton.hasAttribute('disabled')).toBe(false)
    })

    test('both buttons are enabled when the value is between the bounds', () => {
      render(<Input type="number" defaultValue={5} min={0} max={10} />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(incrementButton.hasAttribute('disabled')).toBe(false)
      expect(decrementButton.hasAttribute('disabled')).toBe(false)
    })

    test('increment button becomes disabled after stepping up to the max', async () => {
      render(<Input type="number" defaultValue={9} min={0} max={10} />)
      const input = screen.getByRole('spinbutton') as HTMLInputElement
      const { incrementButton } = getStepperButtons(input)
      await userEvent.click(incrementButton)
      expect(input.value).toBe('10')
      expect(getStepperButtons(input).incrementButton.hasAttribute('disabled')).toBe(true)
    })

    test('stepping notifies onValueChange with the new value', async () => {
      const onValueChange = vi.fn()
      render(<Input type="number" defaultValue={3} onValueChange={onValueChange} />)
      const input = screen.getByRole('spinbutton')
      const { incrementButton } = getStepperButtons(input)
      await userEvent.click(incrementButton)
      expect(onValueChange).toHaveBeenLastCalledWith('4')
    })

    test('disables the stepper buttons when the field is disabled', () => {
      render(<Input type="number" defaultValue={3} isDisabled />)
      const { incrementButton, decrementButton } = getStepperButtons(screen.getByRole('spinbutton'))
      expect(incrementButton.hasAttribute('disabled')).toBe(true)
      expect(decrementButton.hasAttribute('disabled')).toBe(true)
    })

    test('does not throw when stepping with step="any"', async () => {
      render(<Input type="number" step="any" defaultValue={1} />)
      const input = screen.getByRole('spinbutton') as HTMLInputElement
      const { incrementButton } = getStepperButtons(input)
      await userEvent.click(incrementButton)
      expect(input.value).toBe('1')
    })

    test('hides the native spinner appearance', () => {
      render(<Input type="number" />)
      expect(screen.getByRole('spinbutton').classList.contains('[appearance:textfield]')).toBe(true)
    })

    test('applies stepper slot classNames', () => {
      render(
        <Input
          type="number"
          classNames={{
            stepper: 'custom-stepper',
            incrementButton: 'custom-increment',
            decrementButton: 'custom-decrement',
          }}
        />,
      )
      const input = screen.getByRole('spinbutton')
      const { incrementButton, decrementButton } = getStepperButtons(input)
      expect(incrementButton.closest('.custom-stepper')).not.toBeNull()
      expect(incrementButton.classList.contains('custom-increment')).toBe(true)
      expect(decrementButton.classList.contains('custom-decrement')).toBe(true)
    })
  })

  describe('global wrappers config', () => {
    test('renders unchanged when no provider is present', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.classList.contains('flex-1')).toBe(true)
    })

    test('applies global input wrapper classes to every slot', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: {
              input: {
                base: 'global-base',
                inputWrapper: 'global-wrapper',
                input: 'global-input',
                label: 'global-label',
                description: 'global-description',
                startContent: 'global-start',
                endContent: 'global-end',
              },
            },
          }}
        >
          <Input
            label="Email"
            description="Helper"
            startContent={<span data-testid="start">@</span>}
            endContent={<span data-testid="end">✓</span>}
          />
        </EasyUIProvider>,
      )

      const input = screen.getByRole('textbox')
      expect(input.closest('.global-base')).not.toBeNull()
      expect(input.parentElement?.classList.contains('global-wrapper')).toBe(true)
      expect(input.classList.contains('global-input')).toBe(true)
      expect(screen.getByText('Email').classList.contains('global-label')).toBe(true)
      expect(screen.getByText('Helper').classList.contains('global-description')).toBe(true)
      expect(screen.getByTestId('start').parentElement?.classList.contains('global-start')).toBe(true)
      expect(screen.getByTestId('end').parentElement?.classList.contains('global-end')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('renders unchanged when no preset prop is set', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              input: {
                email: { props: { color: 'primary' }, classNames: { base: 'preset-base' } },
              },
            },
          }}
        >
          <Input />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('textbox')
      expect(input.closest('.preset-base')).toBeNull()
    })

    test('preset props are applied when preset name matches', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              input: { email: { classNames: { inputWrapper: 'preset-wrapper' } } },
            },
          }}
        >
          <Input preset="email" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('textbox').parentElement?.classList.contains('preset-wrapper')).toBe(true)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              input: { email: { props: { isDisabled: true } } },
            },
          }}
        >
          <Input preset="email" isDisabled={false} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(false)
    })

    test('preset classNames replace the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { input: { inputWrapper: 'global-wrapper' } },
            presets: {
              input: { email: { classNames: { inputWrapper: 'preset-wrapper' } } },
            },
          }}
        >
          <Input preset="email" />
        </EasyUIProvider>,
      )
      const wrapper = screen.getByRole('textbox').parentElement
      expect(wrapper?.classList.contains('preset-wrapper')).toBe(true)
      expect(wrapper?.classList.contains('global-wrapper')).toBe(false)
    })

    test('an unknown preset name falls back to the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { input: { inputWrapper: 'global-wrapper' } },
            presets: { input: { email: { classNames: { inputWrapper: 'preset-wrapper' } } } },
          }}
        >
          <Input preset="unknown" />
        </EasyUIProvider>,
      )
      const wrapper = screen.getByRole('textbox').parentElement
      expect(wrapper?.classList.contains('global-wrapper')).toBe(true)
      expect(wrapper?.classList.contains('preset-wrapper')).toBe(false)
    })
  })
})
