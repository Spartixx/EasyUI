import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { Selector } from './index'
import { EasyUIProvider } from '../../../providers'
import type { SelectorOption } from './Selector.types'

const fruitOptions: SelectorOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', isDisabled: true },
  { value: 'date', label: 'Date' },
]

const manyOptions: SelectorOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}))

describe('Selector', () => {
  test('renders a combobox button', () => {
    render(<Selector options={fruitOptions} />)
    expect(screen.getByRole('combobox')).toBeDefined()
  })

  test('shows placeholder when no value is selected', () => {
    render(<Selector options={fruitOptions} placeholder="Pick a fruit" />)
    expect(screen.getByText('Pick a fruit')).toBeDefined()
  })

  test('shows the selected option label when value is set', () => {
    render(<Selector options={fruitOptions} value="banana" />)
    expect(screen.getByText('Banana')).toBeDefined()
  })

  test('shows the selected option label when defaultValue is set', () => {
    render(<Selector options={fruitOptions} defaultValue="banana" />)
    expect(screen.getByText('Banana')).toBeDefined()
  })

  test('is disabled when isDisabled is true', () => {
    render(<Selector options={fruitOptions} isDisabled />)
    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled when isLoading', () => {
    render(<Selector options={fruitOptions} isLoading />)
    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true)
  })

  test('shows spinner when isLoading', () => {
    render(<Selector options={fruitOptions} isLoading />)
    expect(screen.getByRole('combobox').querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  test('applies className to the root element', () => {
    const { container } = render(<Selector options={fruitOptions} className="custom-root" />)
    expect((container.firstChild as HTMLElement).classList.contains('custom-root')).toBe(true)
  })

  test('applies classNames.trigger to the trigger button', () => {
    render(<Selector options={fruitOptions} classNames={{ trigger: 'custom-trigger' }} />)
    expect(screen.getByRole('combobox').classList.contains('custom-trigger')).toBe(true)
  })

  test('forwards ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Selector options={fruitOptions} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  test('forwards a callback ref to the trigger button', () => {
    let captured: HTMLButtonElement | null = null
    render(
      <Selector
        options={fruitOptions}
        ref={(node) => {
          captured = node
        }}
      />,
    )
    expect(captured).toBeInstanceOf(HTMLButtonElement)
  })

  test('isFullWidth applies to the row when content is placed outside', () => {
    render(
      <Selector
        options={fruitOptions}
        isFullWidth
        startContent={<span>@</span>}
        startContentPlacement="outside"
      />,
    )
    const row = screen.getByRole('combobox').closest('.relative')!.parentElement!
    expect(row.tagName).toBe('SPAN')
    expect(row.classList.contains('w-full')).toBe(true)
  })

  describe('opening and closing', () => {
    test('listbox is not rendered by default', () => {
      render(<Selector options={fruitOptions} />)
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('opens the listbox on click', async () => {
      render(<Selector options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('closes the listbox on second click', async () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.click(trigger)
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('does not open when isDisabled', () => {
      render(<Selector options={fruitOptions} isDisabled />)
      fireEvent.click(screen.getByRole('combobox'))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('does not respond to keyboard when isDisabled', () => {
      render(<Selector options={fruitOptions} isDisabled />)
      // fireEvent bypasses the fact that a real disabled button can't receive focus,
      // letting us exercise handleKeyDown's own guard directly.
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('sets aria-expanded and aria-controls when open', async () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.getAttribute('aria-controls')).toBeNull()
      await userEvent.click(trigger)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id)
    })

    test('closes the listbox when clicking outside', async () => {
      render(<Selector options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
      await userEvent.click(document.body)
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('opens the listbox with ArrowDown', async () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('opens the listbox with ArrowUp', async () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('ArrowUp moves the active option to the previous enabled one', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('banana')
    })

    test('Home jumps to the first enabled option', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Home}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('apple')
    })

    test('End jumps to the last enabled option', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.keyboard('{End}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('date')
    })

    test('Home/End do nothing while closed', () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      fireEvent.keyDown(trigger, { key: 'Home' })
      fireEvent.keyDown(trigger, { key: 'End' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('closes the listbox with Escape without changing the value', async () => {
      render(<Selector options={fruitOptions} defaultValue="apple" />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.keyboard('{ArrowDown}')
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(screen.getByText('Apple')).toBeDefined()
    })

    test('Escape does nothing while already closed', () => {
      render(<Selector options={fruitOptions} />)
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('ignores a keystroke held with a modifier key', async () => {
      render(<Selector options={fruitOptions} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('{Control>}a{/Control}')
      expect(screen.queryByRole('listbox')).toBeNull()
    })
  })

  describe('all options disabled', () => {
    const allDisabledOptions: SelectorOption[] = [
      { value: 'apple', label: 'Apple', isDisabled: true },
      { value: 'banana', label: 'Banana', isDisabled: true },
    ]

    test('opens with no active option and ArrowDown does not crash', async () => {
      render(<Selector options={allDisabledOptions} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      expect(trigger.getAttribute('aria-activedescendant')).toBeNull()
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('Enter does not select anything when there is no active option', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={allDisabledOptions} onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('scrolling with many options', () => {
    test('constrains the listbox height and makes it scrollable', async () => {
      render(<Selector options={manyOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      const listbox = screen.getByRole('listbox')
      expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight)
    })

    test('scrolls the active option into view when navigating past the visible area', async () => {
      render(<Selector options={manyOptions} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('{ArrowDown}')
      const listbox = screen.getByRole('listbox')
      expect(listbox.scrollTop).toBe(0)
      for (let i = 0; i < 15; i++) {
        await userEvent.keyboard('{ArrowDown}')
      }
      expect(listbox.scrollTop).toBeGreaterThan(0)
    })
  })

  describe('selecting options', () => {
    test('selects an option on click and closes the listbox', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Banana'))
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(screen.getByText('Banana')).toBeDefined()
    })

    test('does not select a disabled option on click', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Cherry'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('selects the active option with Enter, skipping disabled options', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      await userEvent.click(trigger)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('date')
    })

    test('controlled value does not change without onValueChange updating it', async () => {
      render(<Selector options={fruitOptions} value="apple" />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Banana'))
      expect(screen.getByText('Apple')).toBeDefined()
    })
  })

  describe('option content', () => {
    test('renders option description', async () => {
      const options: SelectorOption[] = [{ value: 'apple', label: 'Apple', description: 'A crisp fruit' }]
      render(<Selector options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByText('A crisp fruit')).toBeDefined()
    })

    test('renders option startContent', async () => {
      const options: SelectorOption[] = [
        { value: 'apple', label: 'Apple', startContent: <span data-testid="start-icon">@</span> },
      ]
      render(<Selector options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      const icon = screen.getByTestId('start-icon')
      const label = screen.getByText('Apple')
      expect(icon.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('renders option endContent', async () => {
      const options: SelectorOption[] = [
        { value: 'apple', label: 'Apple', endContent: <span data-testid="end-icon">@</span> },
      ]
      render(<Selector options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      const icon = screen.getByTestId('end-icon')
      const label = screen.getByText('Apple')
      expect(label.compareDocumentPosition(icon) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  describe('live region announcement', () => {
    test('announces the selected option label', async () => {
      render(<Selector options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Banana'))
      expect(screen.getByRole('status').textContent).toBe('Selected: Banana')
    })

    test('does not announce anything before a selection is made', () => {
      render(<Selector options={fruitOptions} defaultValue="apple" />)
      expect(screen.getByRole('status').textContent).toBe('')
    })
  })

  describe('type-ahead', () => {
    test('jumps to and selects the option matching the typed letter', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('d')
      expect(screen.getByRole('listbox')).toBeDefined()
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('date')
    })

    test('matches by accumulating consecutive keystrokes', async () => {
      const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'apricot', label: 'Apricot' },
      ]
      const onValueChange = vi.fn()
      render(<Selector options={options} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('ap')
      await userEvent.keyboard('r')
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('apricot')
    })

    test('skips disabled options', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('c')
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('resets the buffer after a pause, instead of accumulating indefinitely', async () => {
      const onValueChange = vi.fn()
      render(<Selector options={fruitOptions} onValueChange={onValueChange} />)
      const trigger = screen.getByRole('combobox')
      trigger.focus()
      await userEvent.keyboard('b')
      await new Promise((resolve) => setTimeout(resolve, 600))
      await userEvent.keyboard('d')
      await userEvent.keyboard('{Enter}')
      // if the buffer hadn't reset, it would be "bd" which matches nothing, leaving banana active
      expect(onValueChange).toHaveBeenCalledWith('date')
    })
  })

  test('renders label when provided', () => {
    render(<Selector options={fruitOptions} label="Fruit" />)
    expect(screen.getByText('Fruit')).toBeDefined()
  })

  test('links label to trigger via htmlFor', () => {
    render(<Selector options={fruitOptions} label="Fruit" />)
    const label = screen.getByText('Fruit')
    const trigger = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(trigger.getAttribute('id'))
  })

  test('shows asterisk in label when isRequired', () => {
    render(<Selector options={fruitOptions} label="Fruit" isRequired />)
    expect(screen.getByText('Fruit').textContent).toContain('*')
  })

  test('sets aria-required when isRequired', () => {
    render(<Selector options={fruitOptions} isRequired />)
    expect(screen.getByRole('combobox').getAttribute('aria-required')).toBe('true')
  })

  test('renders description when provided', () => {
    render(<Selector options={fruitOptions} description="Pick your favorite." />)
    expect(screen.getByText('Pick your favorite.')).toBeDefined()
  })

  test('renders error when provided and hides description', () => {
    render(<Selector options={fruitOptions} description="Pick your favorite." error="Required" />)
    expect(screen.queryByText('Pick your favorite.')).toBeNull()
    expect(screen.getByText('Required')).toBeDefined()
  })

  test('sets aria-invalid when error is present', () => {
    render(<Selector options={fruitOptions} error="Required" />)
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true')
  })

  test('sets aria-describedby to the error id when error is present', () => {
    render(<Selector options={fruitOptions} error="Required" />)
    const trigger = screen.getByRole('combobox')
    const error = screen.getByText('Required')
    expect(trigger.getAttribute('aria-describedby')).toBe(error.id)
  })

  describe('arrow', () => {
    test('renders a default chevron arrow', () => {
      render(<Selector options={fruitOptions} />)
      expect(screen.getByRole('combobox').querySelector('svg')).not.toBeNull()
    })

    test('hides the arrow when isArrowHidden', () => {
      render(<Selector options={fruitOptions} isArrowHidden />)
      expect(screen.getByRole('combobox').querySelector('svg')).toBeNull()
    })

    test('renders a custom arrow node', () => {
      render(<Selector options={fruitOptions} arrow={<span data-testid="custom-arrow" />} />)
      expect(screen.getByTestId('custom-arrow')).toBeDefined()
    })

    test('renders the arrow before the value when arrowPlacement is start', () => {
      render(<Selector options={fruitOptions} placeholder="Pick" arrowPlacement="start" />)
      const trigger = screen.getByRole('combobox')
      const arrow = trigger.querySelector('svg')!
      const value = screen.getByText('Pick')
      expect(arrow.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('applies classNames.arrow to the arrow wrapper', () => {
      render(<Selector options={fruitOptions} classNames={{ arrow: 'custom-arrow' }} />)
      const trigger = screen.getByRole('combobox')
      expect(trigger.querySelector('svg')!.parentElement!.classList.contains('custom-arrow')).toBe(true)
    })
  })

  describe('global wrappers config', () => {
    test('renders unchanged when no provider is present', () => {
      render(<Selector options={fruitOptions} />)
      expect(screen.getByRole('combobox')).toBeDefined()
    })

    test('applies global selector wrapper classes to every slot', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: {
              selector: {
                base: 'global-base',
                trigger: 'global-trigger',
                label: 'global-label',
              },
            },
          }}
        >
          <Selector options={fruitOptions} label="Fruit" />
        </EasyUIProvider>,
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger.closest('.global-base')).not.toBeNull()
      expect(trigger.classList.contains('global-trigger')).toBe(true)
      expect(screen.getByText('Fruit').classList.contains('global-label')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('preset props are applied when preset name matches', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              selector: { fruit: { classNames: { trigger: 'preset-trigger' } } },
            },
          }}
        >
          <Selector options={fruitOptions} preset="fruit" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('combobox').classList.contains('preset-trigger')).toBe(true)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              selector: { fruit: { props: { isDisabled: true } } },
            },
          }}
        >
          <Selector options={fruitOptions} preset="fruit" isDisabled={false} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(false)
    })
  })
})
