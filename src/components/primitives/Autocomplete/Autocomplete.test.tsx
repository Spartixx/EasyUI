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

  describe('selection mode: multiple', () => {
    test('keeps the input empty and renders a chip per selected value', () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} defaultValue={['apple', 'banana']} />)
      expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Remove Banana' })).toBeDefined()
    })

    test('accumulates selected values, keeps the listbox open and clears the typed text', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} onValueChange={onValueChange} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'ban')
      await userEvent.click(screen.getByText('Banana'))
      expect(onValueChange).toHaveBeenCalledWith(['banana'])
      expect(input.value).toBe('')
      expect(screen.getByRole('listbox')).toBeDefined()
      await userEvent.click(screen.getByText('Date'))
      expect(onValueChange).toHaveBeenCalledWith(['banana', 'date'])
    })

    test('deselects an already selected option', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple', 'banana']}
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(onValueChange).toHaveBeenCalledWith(['banana'])
    })

    test('removes a value from its chip', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple', 'banana']}
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Remove Banana' }))
      expect(onValueChange).toHaveBeenCalledWith(['apple'])
      expect(screen.queryByRole('button', { name: 'Remove Banana' })).toBeNull()
    })

    test('labels a chip with the raw value when no option matches it', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple', 'kiwi']}
          onValueChange={onValueChange}
        />,
      )
      expect(screen.getByText('kiwi')).toBeDefined()
      await userEvent.click(screen.getByRole('button', { name: 'Remove kiwi' }))
      expect(onValueChange).toHaveBeenCalledWith(['apple'])
    })

    test('removes the last selected value with Backspace on an empty input', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple', 'banana']}
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.keyboard('{Backspace}')
      expect(onValueChange).toHaveBeenCalledWith(['apple'])
    })

    test('does not remove a value with Backspace while text is typed', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple']}
          onValueChange={onValueChange}
        />,
      )
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'da')
      await userEvent.keyboard('{Backspace}')
      expect(onValueChange).not.toHaveBeenCalled()
      expect(input.value).toBe('d')
    })

    test('marks the listbox as multi selectable and every selected option as selected', async () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} defaultValue={['apple', 'banana']} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true')
      expect(screen.getByRole('option', { name: 'Apple' }).getAttribute('aria-selected')).toBe('true')
      expect(screen.getByRole('option', { name: 'Banana' }).getAttribute('aria-selected')).toBe('true')
      expect(screen.getByRole('option', { name: 'Date' }).getAttribute('aria-selected')).toBe('false')
    })

    test('controlled values do not change without onValueChange updating them', async () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} value={['apple']} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByRole('option', { name: 'Banana' }))
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDefined()
      expect(screen.queryByRole('button', { name: 'Remove Banana' })).toBeNull()
    })

    test('clears the typed text on blur without touching the selection', async () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} defaultValue={['apple']} />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'ban')
      fireEvent.blur(input)
      expect(input.value).toBe('')
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDefined()
    })

    test('shows the required error on blur when no value is selected', () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} isRequired />)
      const input = screen.getByRole('combobox')
      input.focus()
      fireEvent.blur(input)
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('announces selection and deselection', async () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} />)
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Apple'))
      expect(screen.getByRole('status').textContent).toBe('Selected: Apple')
      await userEvent.click(screen.getByRole('option', { name: 'Apple' }))
      expect(screen.getByRole('status').textContent).toBe('Deselected: Apple')
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

  describe('clearing the input on focus', () => {
    test('clears the displayed text when focusing the input', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      expect(input.value).toBe('Apple')
      await userEvent.click(input)
      expect(input.value).toBe('')
    })

    test('keeps the committed label on focus by default', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('Apple')
    })

    test('keeps every option visible once the input is cleared', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" isInputClearedOnFocus />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getAllByRole('option')).toHaveLength(fruitOptions.length)
    })

    test('does not change the committed value when focusing', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete options={fruitOptions} defaultValue="apple" onValueChange={onValueChange} isInputClearedOnFocus />,
      )
      await userEvent.click(screen.getByRole('combobox'))
      expect(onValueChange).not.toHaveBeenCalled()
    })

    test('restores the committed label on blur without selection', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      fireEvent.blur(input)
      expect(input.value).toBe('Apple')
    })

    test('restores the committed label on Escape', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.keyboard('{Escape}')
      expect(input.value).toBe('Apple')
    })

    test('commits a newly selected option', async () => {
      const onValueChange = vi.fn()
      render(
        <Autocomplete options={fruitOptions} defaultValue="apple" onValueChange={onValueChange} isInputClearedOnFocus />,
      )
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.click(screen.getByText('Banana'))
      expect(onValueChange).toHaveBeenCalledWith('banana')
      expect(input.value).toBe('Banana')
    })

    test('leaves a controlled value untouched when focusing', async () => {
      const onValueChange = vi.fn()
      render(<Autocomplete options={fruitOptions} value="apple" onValueChange={onValueChange} isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('')
      expect(onValueChange).not.toHaveBeenCalled()
      fireEvent.blur(input)
      expect(input.value).toBe('Apple')
    })

    test('clears and reopens when clicking the input again after a selection', async () => {
      render(<Autocomplete options={fruitOptions} isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.click(screen.getByText('Banana'))
      expect(input.value).toBe('Banana')
      expect(screen.queryByRole('listbox')).toBeNull()
      await userEvent.click(input)
      expect(input.value).toBe('')
      expect(screen.getByRole('listbox')).toBeDefined()
    })

    test('does not wipe the typed text when clicking the already open input', async () => {
      render(<Autocomplete options={fruitOptions} isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'ban')
      await userEvent.click(input)
      expect(input.value).toBe('ban')
    })

    test('does not clear when isDisabled', () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" isDisabled isInputClearedOnFocus />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      fireEvent.focus(input)
      expect(input.value).toBe('Apple')
    })

    test('isInputClearedOnFocus from defaults config is used as global fallback', async () => {
      render(
        <EasyUIProvider config={{ defaults: { autocomplete: { isInputClearedOnFocus: true } } }}>
          <Autocomplete options={fruitOptions} defaultValue="apple" />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('')
    })

    test('instance isInputClearedOnFocus wins over defaults config', async () => {
      render(
        <EasyUIProvider config={{ defaults: { autocomplete: { isInputClearedOnFocus: true } } }}>
          <Autocomplete options={fruitOptions} defaultValue="apple" isInputClearedOnFocus={false} />
        </EasyUIProvider>,
      )
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('Apple')
    })

    test('leaves the selection untouched in multiple selection mode', async () => {
      render(
        <Autocomplete
          selectionMode="multiple"
          options={fruitOptions}
          defaultValue={['apple']}
          isInputClearedOnFocus
        />,
      )
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('')
      expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDefined()
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

  describe('selection indicator', () => {
    test('shows a check icon on the selected option by default', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="banana" />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('option', { name: 'Banana' }).querySelector('svg')).not.toBeNull()
      expect(screen.getByRole('option', { name: 'Apple' }).querySelector('svg')).toBeNull()
    })

    test('shows a check icon on every selected option in multiple mode', async () => {
      render(<Autocomplete selectionMode="multiple" options={fruitOptions} defaultValue={['apple', 'banana']} />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('option', { name: 'Apple' }).querySelector('svg')).not.toBeNull()
      expect(screen.getByRole('option', { name: 'Banana' }).querySelector('svg')).not.toBeNull()
      expect(screen.getByRole('option', { name: 'Date' }).querySelector('svg')).toBeNull()
    })

    test('shows no check icon when selectionIndicator is none', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="banana" selectionIndicator="none" />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('option', { name: 'Banana' }).querySelector('svg')).toBeNull()
    })

    test('renders the check icon as the last element of the option', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="banana" />)
      await userEvent.click(screen.getByRole('combobox'))
      const option = screen.getByRole('option', { name: 'Banana' })
      expect(option.lastElementChild?.querySelector('svg')).not.toBeNull()
    })

    test('reserves the indicator space on unselected options', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="banana" />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('option', { name: 'Apple' }).childElementCount).toBe(2)
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

  test('links label to input via aria-labelledby', () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" />)
    const label = screen.getByText('Fruit')
    const input = screen.getByRole('combobox')
    expect(input.getAttribute('aria-labelledby')).toBe(label.getAttribute('id'))
  })

  test('names the input with the label', () => {
    render(<Autocomplete options={fruitOptions} label="Fruit" />)
    expect(screen.getByLabelText('Fruit')).toBe(screen.getByRole('combobox'))
  })

  test('omits aria-labelledby when there is no label', () => {
    render(<Autocomplete options={fruitOptions} />)
    expect(screen.getByRole('combobox').getAttribute('aria-labelledby')).toBeNull()
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

  describe('clickable zone', () => {
    test('does not open the listbox when clicking the label', async () => {
      render(<Autocomplete options={fruitOptions} label="Fruit" />)
      await userEvent.click(screen.getByText('Fruit'))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('does not focus the input when clicking the label', async () => {
      render(<Autocomplete options={fruitOptions} label="Fruit" />)
      await userEvent.click(screen.getByText('Fruit'))
      expect(document.activeElement).not.toBe(screen.getByRole('combobox'))
    })

    test('does not open the listbox when clicking the description', async () => {
      render(<Autocomplete options={fruitOptions} label="Fruit" description="Pick your favorite." />)
      await userEvent.click(screen.getByText('Pick your favorite.'))
      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('does not render the label as a labelling element', () => {
      render(<Autocomplete options={fruitOptions} label="Fruit" />)
      const label = screen.getByText('Fruit')
      expect(label.tagName).toBe('SPAN')
      expect(label.getAttribute('for')).toBeNull()
    })

    test('opens the listbox when clicking the input', async () => {
      render(<Autocomplete options={fruitOptions} label="Fruit" />)
      await userEvent.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeDefined()
    })
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

  describe('isActive', () => {
    function getInputWrapper() {
      return screen.getByRole('combobox').parentElement as HTMLElement
    }

    test('does nothing by default', () => {
      render(<Autocomplete options={fruitOptions} />)
      expect(getInputWrapper().className).not.toContain('--easyui-color-primary')
    })

    test('turns the border primary on a bordered autocomplete', () => {
      render(<Autocomplete options={fruitOptions} isActive />)
      expect(getInputWrapper().className).toContain('border-(--easyui-color-primary)')
    })

    test('draws an inset ring on flat, which has no border', () => {
      render(<Autocomplete options={fruitOptions} variant="flat" isActive />)
      expect(getInputWrapper().className).toContain('inset-ring-(--easyui-color-primary)')
    })

    test('the error state wins over the active state', () => {
      render(<Autocomplete options={fruitOptions} isActive error="Required" />)
      expect(getInputWrapper().className).toContain('border-(--easyui-color-error)')
      expect(getInputWrapper().className).not.toContain('border-(--easyui-color-primary)')
    })

    test('the activeInputWrapper slot applies only while active', () => {
      const { rerender } = render(
        <Autocomplete options={fruitOptions} classNames={{ activeInputWrapper: 'instance-active' }} />,
      )
      expect(getInputWrapper().classList.contains('instance-active')).toBe(false)
      rerender(<Autocomplete options={fruitOptions} isActive classNames={{ activeInputWrapper: 'instance-active' }} />)
      expect(getInputWrapper().classList.contains('instance-active')).toBe(true)
    })

    test('the activeInputWrapper slot is configurable globally', () => {
      render(
        <EasyUIProvider config={{ wrappers: { autocomplete: { activeInputWrapper: 'global-active' } } }}>
          <Autocomplete options={fruitOptions} isActive />
        </EasyUIProvider>,
      )
      expect(getInputWrapper().classList.contains('global-active')).toBe(true)
    })
  })

  describe('triggerText', () => {
    test('is displayed instead of the committed value while blurred', () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" triggerText="Fruit" />)
      expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Fruit')
    })

    test('gives way to an empty input on focus, and comes back on blur', async () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" triggerText="Fruit" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      expect(input.value).toBe('')
      expect(screen.getByRole('listbox')).toBeDefined()

      fireEvent.blur(input)
      expect(input.value).toBe('Fruit')
    })

    test('lets the user filter while focused', async () => {
      render(<Autocomplete options={fruitOptions} triggerText="Fruit" />)
      const input = screen.getByRole('combobox') as HTMLInputElement
      await userEvent.click(input)
      await userEvent.type(input, 'ban')
      expect(input.value).toBe('ban')
      expect(screen.getAllByRole('option')).toHaveLength(1)
    })

    test('replaces the chips in multiple mode', () => {
      render(
        <Autocomplete
          options={fruitOptions}
          selectionMode="multiple"
          defaultValue={['apple', 'banana']}
          triggerText="Fruit"
        />,
      )
      expect(screen.queryByRole('button', { name: 'Remove Apple' })).toBeNull()
      expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('Fruit')
    })

    test('describes the selection for screen readers', () => {
      render(<Autocomplete options={fruitOptions} defaultValue="apple" triggerText="Fruit" />)
      const describedBy = screen.getByRole('combobox').getAttribute('aria-describedby') as string
      expect(document.getElementById(describedBy)?.textContent).toBe('Selected: Apple')
    })

    test('adds no description when nothing is selected', () => {
      render(<Autocomplete options={fruitOptions} triggerText="Fruit" />)
      expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBeNull()
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
