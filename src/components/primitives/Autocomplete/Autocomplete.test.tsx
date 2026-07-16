import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { Autocomplete } from './index'
import { EasyUIProvider } from '../../../providers'
import type { AutocompleteOption } from './Autocomplete.types'

const fruitOptions: AutocompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', isDisabled: true },
  { value: 'date', label: 'Date' },
]

const manyOptions: AutocompleteOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}))

describe('Autocomplete', () => {
  test('renders a combobox input', () => {
    render(<Autocomplete options={fruitOptions} />)
    expect(screen.getByRole('combobox')).toBeDefined()
  })

  test('shows placeholder when no value is selected', () => {
    render(<Autocomplete options={fruitOptions} placeholder="Search a fruit" />)
    expect(screen.getByPlaceholderText('Search a fruit')).toBeDefined()
  })

  test('shows the selected option label when value is set', () => {
    render(<Autocomplete options={fruitOptions} value="banana" />)
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Banana')
  })

  test('shows the selected option label when defaultValue is set', () => {
    render(<Autocomplete options={fruitOptions} defaultValue="banana" />)
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Banana')
  })

  test('is disabled when isDisabled is true', () => {
    render(<Autocomplete options={fruitOptions} isDisabled />)
    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true)
  })

  test('is disabled when isLoading', () => {
    render(<Autocomplete options={fruitOptions} isLoading />)
    expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true)
  })

  test('shows spinner when isLoading', () => {
    render(<Autocomplete options={fruitOptions} isLoading />)
    const input = screen.getByRole('combobox')
    expect(input.parentElement?.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  test('applies className to the root element', () => {
    const { container } = render(<Autocomplete options={fruitOptions} className="custom-root" />)
    expect((container.firstChild as HTMLElement).classList.contains('custom-root')).toBe(true)
  })

  test('applies classNames.input to the input element', () => {
    render(<Autocomplete options={fruitOptions} classNames={{ input: 'custom-input' }} />)
    expect(screen.getByRole('combobox').classList.contains('custom-input')).toBe(true)
  })

  test('applies classNames.inputWrapper to the input wrapper element', () => {
    render(<Autocomplete options={fruitOptions} classNames={{ inputWrapper: 'custom-wrapper' }} />)
    expect(screen.getByRole('combobox').parentElement!.classList.contains('custom-wrapper')).toBe(true)
  })

  test('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Autocomplete options={fruitOptions} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test('forwards a callback ref to the input element', () => {
    let captured: HTMLInputElement | null = null
    render(
      <Autocomplete
        options={fruitOptions}
        ref={(node) => {
          captured = node
        }}
      />,
    )
    expect(captured).toBeInstanceOf(HTMLInputElement)
  })

  test('isFullWidth applies to the row when content is placed outside', () => {
    render(
      <Autocomplete
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
      render(<Autocomplete options={fruitOptions} />)
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('opens the listbox on focus', () => {
      render(<Autocomplete options={fruitOptions} />)
      fireEvent.focus(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('opens the listbox on click', async () => {
      render(<Autocomplete options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('stays open when clicking the input again while already focused', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.click(input)
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('does not open when isDisabled', () => {
      render(<Autocomplete options={fruitOptions} isDisabled />)
      // fireEvent bypasses the fact that a real disabled input can't receive focus,
      // letting us exercise handleFocus's own guard directly.
      fireEvent.focus(screen.getByRole('combobox'))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('does not respond to keyboard when isDisabled', () => {
      render(<Autocomplete options={fruitOptions} isDisabled />)
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('sets aria-expanded and aria-controls when open', () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(input.getAttribute('aria-controls')).toBeNull()
      fireEvent.focus(input)
      expect(input.getAttribute('aria-expanded')).toBe('true')
      expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id)
    })

    test('closes the listbox when clicking outside', async () => {
      render(<Autocomplete options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
      await userEvent.click(document.body)
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('reopens the listbox by typing after it was closed', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      await userEvent.type(input, 'a')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('reopens the listbox with ArrowDown after Escape', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      input.focus()
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('reopens the listbox with ArrowUp after Escape', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      input.focus()
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      await userEvent.keyboard('{ArrowUp}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('ArrowUp moves the active option to the previous enabled one', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('banana')
    })

    test('Home jumps to the first enabled option', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Home}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('apple')
    })

    test('End jumps to the last enabled option', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.keyboard('{End}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('date')
    })

    test('Home/End do nothing while closed', () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      fireEvent.keyDown(input, { key: 'Home' })
      fireEvent.keyDown(input, { key: 'End' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('closes the listbox with Escape without changing the value', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.keyboard('{ArrowDown}')
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(input.value).toBe('Apple')
    })

    test('Escape does nothing while already closed', () => {
      render(<Autocomplete options={fruitOptions} />)
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
      expect(screen.queryByRole('listbox')).toBeNull()
    })
  })

  describe('all options disabled', () => {
    const allDisabledOptions: AutocompleteOption[] = [
      { value: 'apple', label: 'Apple', isDisabled: true },
      { value: 'banana', label: 'Banana', isDisabled: true },
    ]

    test('opens with no active option and ArrowDown does not crash', async () => {
      render(<Autocomplete options={allDisabledOptions} />)
      const input = screen.getByRole('combobox')
      input.focus()
      expect(input.getAttribute('aria-activedescendant')).toBeNull()
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('Enter does not select anything when there is no active option', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={allDisabledOptions} onValueChange={onValueChange} />)
      screen.getByRole('combobox').focus()
      await userEvent.keyboard('{Enter}')
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('scrolling with many options', () => {
    test('constrains the listbox height and makes it scrollable', () => {
      render(<Autocomplete options={manyOptions} />)
      fireEvent.focus(screen.getByRole('combobox'))
      const listbox = screen.getByRole('listbox')
      expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight)
    })

    test('scrolls the active option into view when navigating past the visible area', async () => {
      render(<Autocomplete options={manyOptions} />)
      const input = screen.getByRole('combobox')
      input.focus()
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
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.click(screen.getByText('Banana'))
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(input.value).toBe('Banana')
    })

    test('does not select a disabled option on click', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Cherry'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('selects the active option with Enter, skipping disabled options', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('date')
    })

    test('controlled value does not change without onValueChange updating it', async () => {
      render(<Autocomplete options={fruitOptions} value="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.click(screen.getByText('Banana'))
      expect(input.value).toBe('Apple')
    })
  })

  describe('filtering', () => {
    test('narrows the visible options to a case-insensitive substring match', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'AN')
      expect(screen.getByText('Banana')).toBeDefined()
      expect(screen.queryByText('Apple')).toBeNull()
      expect(screen.queryByText('Date')).toBeNull()
    })

    test('matches a substring in the middle of a label, not just the start', async () => {
      const options: AutocompleteOption[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'pineapple', label: 'Pineapple' },
      ]
      render(<Autocomplete options={options} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'app')
      expect(screen.getByText('Apple')).toBeDefined()
      expect(screen.getByText('Pineapple')).toBeDefined()
    })

    test('shows "No results found" when nothing matches', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      expect(screen.getByText('No results found')).toBeDefined()
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    test('shows custom noResultsMessage when provided', async () => {
      render(<Autocomplete options={fruitOptions} noResultsMessage="Aucun résultat" />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      expect(screen.getByText('Aucun résultat')).toBeDefined()
    })

    test('noResultsMessage from defaults config is used as global fallback', async () => {
      render(
        <EasyUIProvider config={{ defaults: { autocomplete: { noResultsMessage: 'Nada' } } }}>
          <Autocomplete options={fruitOptions} />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      expect(screen.getByText('Nada')).toBeDefined()
    })

    test('instance noResultsMessage wins over defaults config', async () => {
      render(
        <EasyUIProvider config={{ defaults: { autocomplete: { noResultsMessage: 'Nada' } } }}>
          <Autocomplete options={fruitOptions} noResultsMessage="Aucun résultat" />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      expect(screen.getByText('Aucun résultat')).toBeDefined()
      expect(screen.queryByText('Nada')).toBeNull()
    })

    test('noResultsMessage from preset is applied', async () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              autocomplete: { fr: { props: { noResultsMessage: 'Aucun résultat' } } },
            },
          }}
        >
          <Autocomplete options={fruitOptions} preset="fr" />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      expect(screen.getByText('Aucun résultat')).toBeDefined()
    })

    test('restores the full list when the typed text is cleared', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'an')
      expect(screen.queryByText('Apple')).toBeNull()
      await userEvent.clear(input)
      expect(screen.getByText('Apple')).toBeDefined()
      expect(screen.getByText('Banana')).toBeDefined()
      expect(screen.getByText('Date')).toBeDefined()
    })

    test('selecting via keyboard from a filtered list selects the correct option', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'an')
      await userEvent.keyboard('{ArrowDown}{Enter}')
      expect(onValueChange).toHaveBeenCalledWith('banana')
    })

    test('clears the active option on every keystroke', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'a')
      expect(input.getAttribute('aria-activedescendant')).toBeNull()
    })
  })

  describe('blur and revert', () => {
    test('blurring without typing leaves the committed value displayed', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      fireEvent.blur(input)
      expect(input.value).toBe('Apple')
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('reverts typed text to the committed label on blur when it does not match', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.clear(input)
      await userEvent.type(input, 'xyz')
      expect(input.value).toBe('xyz')
      fireEvent.blur(input)
      expect(input.value).toBe('Apple')
    })

    test('reverts typed text to an empty string when no value is committed', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      fireEvent.blur(input)
      expect(input.value).toBe('')
    })

    test('Escape reverts typed text and closes without changing the committed value', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} defaultValue="apple" onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.clear(input)
      await userEvent.type(input, 'xyz')
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).toBeNull()
      expect(input.value).toBe('Apple')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('clicking outside reverts typed text the same way as blur', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.clear(input)
      await userEvent.type(input, 'xyz')
      await userEvent.click(document.body)
      expect(input.value).toBe('Apple')
    })
  })

  describe('option content', () => {
    test('renders option description', async () => {
      const options: AutocompleteOption[] = [{ value: 'apple', label: 'Apple', description: 'A crisp fruit' }]
      render(<Autocomplete options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByText('A crisp fruit')).toBeDefined()
    })

    test('renders option startContent', async () => {
      const options: AutocompleteOption[] = [
        { value: 'apple', label: 'Apple', startContent: <span data-testid="start-icon">@</span> },
      ]
      render(<Autocomplete options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      const icon = screen.getByTestId('start-icon')
      const label = screen.getByText('Apple')
      expect(icon.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('renders option endContent', async () => {
      const options: AutocompleteOption[] = [
        { value: 'apple', label: 'Apple', endContent: <span data-testid="end-icon">@</span> },
      ]
      render(<Autocomplete options={options} />)
      await userEvent.click(screen.getByRole('combobox'))
      const icon = screen.getByTestId('end-icon')
      const label = screen.getByText('Apple')
      expect(label.compareDocumentPosition(icon) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  describe('required self-validation', () => {
    test('shows the required error on blur when nothing is selected', async () => {
      render(<Autocomplete options={fruitOptions} isRequired />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      fireEvent.blur(input)
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('uses a custom isRequiredMessage', async () => {
      render(<Autocomplete options={fruitOptions} isRequired isRequiredMessage="Choose a city" />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      fireEvent.blur(input)
      expect(screen.getByText('Choose a city')).toBeDefined()
    })

    test('does not self-validate when isFormControlled', async () => {
      render(<Autocomplete options={fruitOptions} isRequired isFormControlled />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      fireEvent.blur(input)
      expect(screen.queryByText('This field is required')).toBeNull()
    })

    test('does not self-validate on blur when isDisabled', () => {
      render(<Autocomplete options={fruitOptions} isRequired isDisabled />)
      // fireEvent bypasses the fact that a real disabled input can't be blurred.
      fireEvent.blur(screen.getByRole('combobox'))
      expect(screen.queryByText('This field is required')).toBeNull()
    })
  })

  describe('option validations', () => {
    const validations = [(option: AutocompleteOption) => (option.value === 'banana' ? 'Not available' : null)]

    test('disables an invalid option and shows the error as its description', async () => {
      render(<Autocomplete options={fruitOptions} validations={validations} />)
      await userEvent.click(screen.getByRole('combobox'))
      const banana = screen.getByText('Banana').closest('[role="option"]')!
      expect(banana.getAttribute('aria-disabled')).toBe('true')
      expect(screen.getByText('Not available')).toBeDefined()
    })

    test('auto-deselects a defaultValue that becomes invalid', () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          options={fruitOptions}
          validations={validations}
          defaultValue="banana"
          onValueChange={onValueChange}
        />,
      )
      expect(onValueChange).toHaveBeenCalledWith('')
      expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')
    })

    test('notifies onValueChange once to deselect a controlled invalid value', () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete options={fruitOptions} validations={validations} value="banana" onValueChange={onValueChange} />,
      )
      expect(onValueChange).toHaveBeenCalledWith('')
      expect(onValueChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('live region announcement', () => {
    test('announces the selected option label', async () => {
      render(<Autocomplete options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Banana'))
      expect(screen.getByRole('status').textContent).toBe('Selected: Banana')
    })

    test('does not announce anything before a selection is made', () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      expect(screen.getByRole('status').textContent).toBe('')
    })

    test('does not announce anything when reverting on blur', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox')
      await userEvent.click(input)
      await userEvent.type(input, 'xyz')
      fireEvent.blur(input)
      expect(screen.getByRole('status').textContent).toBe('')
    })
  })

  test('renders label when provided', () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" />)
    expect(screen.getByText('Fruit')).toBeDefined()
  })

  test('links label to input via htmlFor', () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" />)
    const label = screen.getByText('Fruit')
    const input = screen.getByRole('combobox')
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  test('shows asterisk in label when isRequired', () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" isRequired />)
    expect(screen.getByText('Fruit').textContent).toContain('*')
  })

  test('sets aria-required when isRequired', () => {
    render(<Autocomplete options={fruitOptions} isRequired />)
    expect(screen.getByRole('combobox').getAttribute('aria-required')).toBe('true')
  })

  test('renders description when provided', () => {
    render(<Autocomplete options={fruitOptions} description="Pick your favorite." />)
    expect(screen.getByText('Pick your favorite.')).toBeDefined()
  })

  test('renders error when provided and hides description', () => {
    render(<Autocomplete options={fruitOptions} description="Pick your favorite." error="Required" />)
    expect(screen.queryByText('Pick your favorite.')).toBeNull()
    expect(screen.getByText('Required')).toBeDefined()
  })

  test('sets aria-invalid when error is present', () => {
    render(<Autocomplete options={fruitOptions} error="Required" />)
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true')
  })

  test('sets aria-describedby to the error id when error is present', () => {
    render(<Autocomplete options={fruitOptions} error="Required" />)
    const input = screen.getByRole('combobox')
    const error = screen.getByText('Required')
    expect(input.getAttribute('aria-describedby')).toBe(error.id)
  })

  describe('arrow', () => {
    test('renders a default chevron arrow', () => {
      render(<Autocomplete options={fruitOptions} />)
      expect(screen.getByRole('combobox').parentElement?.querySelector('svg')).not.toBeNull()
    })

    test('hides the arrow when isArrowHidden', () => {
      render(<Autocomplete options={fruitOptions} isArrowHidden />)
      expect(screen.getByRole('combobox').parentElement?.querySelector('svg')).toBeNull()
    })

    test('renders a custom arrow node', () => {
      render(<Autocomplete options={fruitOptions} arrow={<span data-testid="custom-arrow" />} />)
      expect(screen.getByTestId('custom-arrow')).toBeDefined()
    })

    test('renders the arrow before the input when arrowPlacement is start', () => {
      render(<Autocomplete options={fruitOptions} placeholder="Pick" arrowPlacement="start" />)
      const input = screen.getByRole('combobox')
      const arrow = input.parentElement!.querySelector('svg')!
      expect(arrow.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('clicking the arrow focuses the input and opens the listbox', async () => {
      render(<Autocomplete options={fruitOptions} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      const arrow = input.parentElement!.querySelector('svg')!.parentElement!
      await userEvent.click(arrow)
      expect(input).toBe(document.activeElement)
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('applies classNames.arrow to the arrow wrapper', () => {
      render(<Autocomplete options={fruitOptions} classNames={{ arrow: 'custom-arrow' }} />)
      const input = screen.getByRole('combobox')
      expect(input.parentElement!.querySelector('svg')!.parentElement!.classList.contains('custom-arrow')).toBe(true)
    })
  })

  describe('global wrappers config', () => {
    test('renders unchanged when no provider is present', () => {
      render(<Autocomplete options={fruitOptions} />)
      expect(screen.getByRole('combobox')).toBeDefined()
    })

    test('applies global autocomplete wrapper classes to every slot', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: {
              autocomplete: {
                base: 'global-base',
                input: 'global-input',
                label: 'global-label',
              },
            },
          }}
        >
          <Autocomplete options={fruitOptions} label="Fruit" />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox')
      expect(input.closest('.global-base')).not.toBeNull()
      expect(input.classList.contains('global-input')).toBe(true)
      expect(screen.getByText('Fruit').classList.contains('global-label')).toBe(true)
    })
  })

  describe('presets config', () => {
    test('preset props are applied when preset name matches', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              autocomplete: { fruit: { classNames: { input: 'preset-input' } } },
            },
          }}
        >
          <Autocomplete options={fruitOptions} preset="fruit" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('combobox').classList.contains('preset-input')).toBe(true)
    })

    test('explicit instance props win over preset props', () => {
      render(
        <EasyUIProvider
          config={{
            presets: {
              autocomplete: { fruit: { props: { isDisabled: true } } },
            },
          }}
        >
          <Autocomplete options={fruitOptions} preset="fruit" isDisabled={false} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(false)
    })
  })
})
