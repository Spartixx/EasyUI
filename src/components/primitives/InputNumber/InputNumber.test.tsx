import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { InputNumber } from './index'
import { EasyUIProvider } from '../../../providers'

const buttonsOf = (container: HTMLElement) => Array.from(container.querySelectorAll('button'))

describe('InputNumber', () => {
  test('renders a text input with a decimal input mode', () => {
    render(<InputNumber />)
    const input = screen.getByRole('textbox')
    expect(input.getAttribute('type')).toBe('text')
    expect(input.getAttribute('inputmode')).toBe('decimal')
  })

  test('is disabled when isDisabled is true', () => {
    render(<InputNumber isDisabled />)
    expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled and shows a spinner when isLoading', () => {
    const { container } = render(<InputNumber isLoading />)
    expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  test('has required attribute when isRequired', () => {
    render(<InputNumber isRequired />)
    expect(screen.getByRole('textbox').hasAttribute('required')).toBe(true)
  })

  test('has readOnly attribute when isReadOnly', () => {
    render(<InputNumber isReadOnly />)
    expect(screen.getByRole('textbox').hasAttribute('readonly')).toBe(true)
  })

  test('applies className to the root element', () => {
    const { container } = render(<InputNumber className="custom-root" />)
    expect((container.firstChild as HTMLElement).classList.contains('custom-root')).toBe(true)
  })

  test('applies classNames to the input and wrapper slots', () => {
    render(<InputNumber classNames={{ input: 'custom-input', inputWrapper: 'custom-wrapper' }} />)
    const input = screen.getByRole('textbox')
    expect(input.classList.contains('custom-input')).toBe(true)
    expect(input.closest('.custom-wrapper')).not.toBeNull()
  })

  test('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<InputNumber ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('renders the numeric value from defaultValue', () => {
    render(<InputNumber defaultValue={1} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('1')
  })

  test('renders an empty input when the value is null', () => {
    render(<InputNumber value={null} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  })

  describe('filtering', () => {
    test('keeps only digits, one dot and a leading minus', async () => {
      render(<InputNumber />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '12a.3b4')
      expect(input.value).toBe('12.34')
    })

    test('keeps a single dot', async () => {
      render(<InputNumber />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '1.2.3')
      expect(input.value).toBe('1.23')
    })

    test('only keeps a minus at the start', async () => {
      render(<InputNumber />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '5-3')
      expect(input.value).toBe('53')
    })

    test('allows a leading minus for negative numbers', async () => {
      render(<InputNumber />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '-7')
      expect(input.value).toBe('-7')
    })
  })

  describe('value change', () => {
    test('calls onValueChange with the parsed number', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber onValueChange={onValueChange} />)
      await userEvent.type(screen.getByRole('textbox'), '25')
      expect(onValueChange).toHaveBeenLastCalledWith(25)
    })

    test('emits null when the input is cleared', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber defaultValue={5} onValueChange={onValueChange} />)
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      expect(onValueChange).toHaveBeenLastCalledWith(null)
    })

    test('emits null while the value is an incomplete minus sign', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber onValueChange={onValueChange} />)
      await userEvent.type(screen.getByRole('textbox'), '-')
      expect(onValueChange).toHaveBeenLastCalledWith(null)
    })

    test('parses a trailing dot as the integer part', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber onValueChange={onValueChange} />)
      await userEvent.type(screen.getByRole('textbox'), '2.')
      expect(onValueChange).toHaveBeenLastCalledWith(2)
    })

    test('does not update the committed value of a controlled input', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber value={5} onValueChange={onValueChange} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '9')
      expect(onValueChange).toHaveBeenLastCalledWith(59)
    })
  })

  describe('clamping typed values', () => {
    test('clamps a value above the max on blur', async () => {
      render(<InputNumber min={0} max={100} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '101')
      await userEvent.tab()
      expect(input.value).toBe('100')
    })

    test('clamps a value below the min on blur', async () => {
      render(<InputNumber min={1} max={10} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '0')
      await userEvent.tab()
      expect(input.value).toBe('1')
    })

    test('clamps on Enter without leaving the input', async () => {
      render(<InputNumber min={1} max={10} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '11')
      await userEvent.keyboard('{Enter}')
      expect(input.value).toBe('10')
    })

    test('leaves a value within the bounds untouched', async () => {
      render(<InputNumber min={0} max={100} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.type(input, '50')
      await userEvent.tab()
      expect(input.value).toBe('50')
    })

    test('reports the clamped value through onValueChange on blur', async () => {
      const onValueChange = vi.fn()
      render(<InputNumber min={0} max={100} onValueChange={onValueChange} />)
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '101')
      await userEvent.tab()
      expect(onValueChange).toHaveBeenLastCalledWith(100)
    })

    test('keeps an empty field empty on blur', async () => {
      render(<InputNumber min={1} max={10} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.tab()
      expect(input.value).toBe('')
    })
  })

  describe('stepping (end design)', () => {
    test('renders an increment and a decrement button', () => {
      const { container } = render(<InputNumber />)
      expect(buttonsOf(container)).toHaveLength(2)
    })

    test('increment button increases the value by the step', async () => {
      const { container } = render(<InputNumber defaultValue={3} step={2} />)
      const [incrementButton] = buttonsOf(container)
      await userEvent.click(incrementButton)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('5')
    })

    test('decrement button decreases the value by the step', async () => {
      const { container } = render(<InputNumber defaultValue={3} step={2} />)
      const [, decrementButton] = buttonsOf(container)
      await userEvent.click(decrementButton)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('1')
    })

    test('increment button is disabled at the max', () => {
      const { container } = render(<InputNumber defaultValue={10} min={0} max={10} />)
      const [incrementButton, decrementButton] = buttonsOf(container)
      expect(incrementButton.hasAttribute('disabled')).toBe(true)
      expect(decrementButton.hasAttribute('disabled')).toBe(false)
    })

    test('decrement button is disabled at the min', () => {
      const { container } = render(<InputNumber defaultValue={0} min={0} max={10} />)
      const [incrementButton, decrementButton] = buttonsOf(container)
      expect(decrementButton.hasAttribute('disabled')).toBe(true)
      expect(incrementButton.hasAttribute('disabled')).toBe(false)
    })

    test('clamps to the max when stepping', async () => {
      const { container } = render(<InputNumber defaultValue={9} min={0} max={10} step={5} />)
      const [incrementButton] = buttonsOf(container)
      await userEvent.click(incrementButton)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('10')
    })

    test('avoids floating point drift when stepping by a decimal step', async () => {
      const { container } = render(<InputNumber defaultValue={0.1} step={0.1} />)
      const [incrementButton] = buttonsOf(container)
      await userEvent.click(incrementButton)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('0.2')
    })

    test('stepping notifies onValueChange', async () => {
      const onValueChange = vi.fn()
      const { container } = render(<InputNumber defaultValue={3} onValueChange={onValueChange} />)
      const [incrementButton] = buttonsOf(container)
      await userEvent.click(incrementButton)
      expect(onValueChange).toHaveBeenLastCalledWith(4)
    })

    test('starts from zero when stepping an empty input', async () => {
      const { container } = render(<InputNumber />)
      const [incrementButton] = buttonsOf(container)
      await userEvent.click(incrementButton)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('1')
    })

    test('disables both buttons when the field is disabled', () => {
      const { container } = render(<InputNumber defaultValue={3} isDisabled />)
      const [incrementButton, decrementButton] = buttonsOf(container)
      expect(incrementButton.hasAttribute('disabled')).toBe(true)
      expect(decrementButton.hasAttribute('disabled')).toBe(true)
    })

    test('does not render the stepper when read-only', () => {
      const { container } = render(<InputNumber isReadOnly />)
      expect(buttonsOf(container)).toHaveLength(0)
    })

    test('applies the stepper slot classNames', () => {
      const { container } = render(
        <InputNumber
          classNames={{ stepper: 'custom-stepper', incrementButton: 'custom-increment', decrementButton: 'custom-decrement' }}
        />,
      )
      const [incrementButton, decrementButton] = buttonsOf(container)
      expect(incrementButton.closest('.custom-stepper')).not.toBeNull()
      expect(incrementButton.classList.contains('custom-increment')).toBe(true)
      expect(decrementButton.classList.contains('custom-decrement')).toBe(true)
    })
  })

  describe('stepping (sides design)', () => {
    test('renders a minus button first and a plus button last', async () => {
      const { container } = render(<InputNumber stepperPlacement="sides" defaultValue={5} />)
      const buttons = buttonsOf(container)
      expect(buttons).toHaveLength(2)
      await userEvent.click(buttons[0])
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('4')
    })

    test('plus button increments', async () => {
      const { container } = render(<InputNumber stepperPlacement="sides" defaultValue={5} />)
      const buttons = buttonsOf(container)
      await userEvent.click(buttons[1])
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('6')
    })

    test('disables the minus button at the min and the plus button at the max', () => {
      const { container: atMin } = render(<InputNumber stepperPlacement="sides" defaultValue={0} min={0} max={10} />)
      expect(buttonsOf(atMin)[0].hasAttribute('disabled')).toBe(true)
      expect(buttonsOf(atMin)[1].hasAttribute('disabled')).toBe(false)

      const { container: atMax } = render(<InputNumber stepperPlacement="sides" defaultValue={10} min={0} max={10} />)
      expect(buttonsOf(atMax)[0].hasAttribute('disabled')).toBe(false)
      expect(buttonsOf(atMax)[1].hasAttribute('disabled')).toBe(true)
    })

    test('divider border reflects the color for a colored variant', () => {
      const { container } = render(<InputNumber stepperPlacement="sides" variant="flat" color="primary" />)
      expect(buttonsOf(container)[0].classList.contains('border-(--easyui-color-primary)/40')).toBe(true)
    })

    test('divider border stays default for the bordered variant', () => {
      const { container } = render(<InputNumber stepperPlacement="sides" variant="bordered" color="primary" />)
      expect(buttonsOf(container)[0].classList.contains('border-(--easyui-color-default)/60')).toBe(true)
    })

    test('divider border turns to error color when an error is present', () => {
      const { container } = render(<InputNumber stepperPlacement="sides" color="primary" error="Nope" />)
      expect(buttonsOf(container)[0].classList.contains('border-(--easyui-color-error)/40')).toBe(true)
    })

    test('applies the side button slot classNames', () => {
      const { container } = render(
        <InputNumber
          stepperPlacement="sides"
          classNames={{ decrementButton: 'custom-decrement', incrementButton: 'custom-increment' }}
        />,
      )
      const buttons = buttonsOf(container)
      expect(buttons[0].classList.contains('custom-decrement')).toBe(true)
      expect(buttons[1].classList.contains('custom-increment')).toBe(true)
    })
  })

  describe('keyboard stepping', () => {
    test('ArrowUp increments the value', async () => {
      render(<InputNumber defaultValue={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(input.value).toBe('6')
    })

    test('ArrowDown decrements the value', async () => {
      render(<InputNumber defaultValue={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(input.value).toBe('4')
    })

    test('ArrowUp does not step when read-only', async () => {
      render(<InputNumber defaultValue={5} isReadOnly />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(input.value).toBe('5')
    })
  })

  describe('wheel stepping', () => {
    const dispatchWheel = (input: HTMLElement, deltaY: number) => {
      input.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }))
    }

    test('increments on scroll up when focused', async () => {
      render(<InputNumber defaultValue={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      dispatchWheel(input, -1)
      await waitFor(() => expect(input.value).toBe('6'))
    })

    test('decrements on scroll down when focused', async () => {
      render(<InputNumber defaultValue={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      dispatchWheel(input, 1)
      await waitFor(() => expect(input.value).toBe('4'))
    })

    test('does nothing when the input is not focused', () => {
      render(<InputNumber defaultValue={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      dispatchWheel(input, -1)
      expect(input.value).toBe('5')
    })

    test('does nothing when isWheelStepEnabled is false', () => {
      render(<InputNumber defaultValue={5} isWheelStepEnabled={false} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      dispatchWheel(input, -1)
      expect(input.value).toBe('5')
    })

    test('does nothing when read-only', () => {
      render(<InputNumber defaultValue={5} isReadOnly />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      input.focus()
      dispatchWheel(input, -1)
      expect(input.value).toBe('5')
    })
  })

  describe('prefix and suffix', () => {
    test('renders the prefix without adding it to the input value', () => {
      const { container } = render(<InputNumber prefix="€" defaultValue={1250} />)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('1250')
      expect(container.textContent).toContain('€')
    })

    test('renders the suffix without adding it to the input value', () => {
      const { container } = render(<InputNumber suffix="kg" defaultValue={75} />)
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('75')
      expect(container.textContent).toContain('kg')
    })

    test('applies the prefix and suffix slot classNames', () => {
      const { container } = render(
        <InputNumber prefix="€" suffix="kg" classNames={{ prefix: 'custom-prefix', suffix: 'custom-suffix' }} />,
      )
      expect(container.querySelector('.custom-prefix')).not.toBeNull()
      expect(container.querySelector('.custom-suffix')).not.toBeNull()
    })

    test('focuses the input when clicking the value area next to the number', async () => {
      const { container } = render(
        <InputNumber prefix="€" classNames={{ prefix: 'custom-prefix' }} defaultValue={5} />,
      )
      const input = screen.getByRole('textbox') as HTMLInputElement
      const prefixElement = container.querySelector('.custom-prefix') as HTMLElement
      await userEvent.click(prefixElement)
      expect(document.activeElement).toBe(input)
    })
  })

  describe('label and accessibility', () => {
    test('links the label to the input via htmlFor', () => {
      render(<InputNumber label="Quantity" />)
      const label = screen.getByText('Quantity')
      const input = screen.getByRole('textbox')
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
    })

    test('renders the label inside the wrapper when labelPlacement is inside', () => {
      render(<InputNumber label="Quantity" labelPlacement="inside" />)
      expect(screen.getByLabelText('Quantity')).toBeInstanceOf(HTMLInputElement)
    })

    test('sets aria-invalid and shows the error when error is present', () => {
      render(<InputNumber error="Invalid quantity" />)
      expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
      expect(screen.getByText('Invalid quantity')).toBeDefined()
    })

    test('runs validations on blur against the numeric value', async () => {
      render(
        <InputNumber validations={[(value) => (value !== null && value >= 18 ? null : 'Must be at least 18')]} />,
      )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '12')
      await userEvent.tab()
      expect(screen.getByText('Must be at least 18')).toBeDefined()
    })

    test('clears the validation error on blur when the value passes', async () => {
      render(
        <InputNumber validations={[(value) => (value !== null && value >= 18 ? null : 'Must be at least 18')]} />,
      )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '20')
      await userEvent.tab()
      expect(screen.queryByText('Must be at least 18')).toBeNull()
    })

    test('shows the required error on blur when empty and isRequired', async () => {
      render(<InputNumber isRequired />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('does not show the required error when a value is present', async () => {
      render(<InputNumber isRequired />)
      const input = screen.getByRole('textbox')
      await userEvent.type(input, '5')
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
    })

    test('uses a custom isRequiredMessage', async () => {
      render(<InputNumber isRequired isRequiredMessage="Enter a number" />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('Enter a number')).toBeDefined()
    })

    test('does not self-validate when isFormControlled', async () => {
      render(<InputNumber isRequired isFormControlled />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
    })
  })

  describe('global wrappers config', () => {
    test('applies global inputNumber wrapper classes to slots', () => {
      render(
        <EasyUIProvider config={{ wrappers: { inputNumber: { base: 'global-base', input: 'global-input' } } }}>
          <InputNumber />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('textbox')
      expect(input.closest('.global-base')).not.toBeNull()
      expect(input.classList.contains('global-input')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('preset props are applied when the preset name matches', () => {
      render(
        <EasyUIProvider config={{ presets: { inputNumber: { money: { props: { isDisabled: true } } } } }}>
          <InputNumber preset="money" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider config={{ presets: { inputNumber: { money: { props: { isDisabled: true } } } } }}>
          <InputNumber preset="money" isDisabled={false} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(false)
    })
  })
})
