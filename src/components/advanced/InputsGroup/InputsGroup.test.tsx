import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { InputsGroup } from './index'
import { EasyUIProvider } from '../../../providers'
import type { EasyUIConfig } from '../../../config/easyui.config.types'

describe('InputsGroup', () => {
  test('renders one input per initial value', () => {
    render(<InputsGroup label="Tags" initialValues={[{ value: 'react' }, { value: 'vue' }]} />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs).toHaveLength(2)
    expect(inputs[0].value).toBe('react')
    expect(inputs[1].value).toBe('vue')
  })

  test('label and description render only on the first line', () => {
    render(<InputsGroup label="Tags" description="Helper text" initialValues={[{ value: 'a' }, { value: 'b' }]} />)
    expect(screen.getAllByText('Tags')).toHaveLength(1)
    expect(screen.getAllByText('Helper text')).toHaveLength(1)
  })

  test('add button appends a line and reports raw + filtered values', async () => {
    const onValuesChange = vi.fn()
    const onNonEmptyValuesChange = vi.fn()
    render(
      <InputsGroup
        label="Tags"
        initialValues={[{ value: 'react' }]}
        onValuesChange={onValuesChange}
        onNonEmptyValuesChange={onNonEmptyValuesChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Add/ }))
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(onValuesChange).toHaveBeenLastCalledWith(['react', ''])
    expect(onNonEmptyValuesChange).toHaveBeenLastCalledWith(['react'])
  })

  test('remove button deletes the matching line', async () => {
    const onValuesChange = vi.fn()
    render(
      <InputsGroup label="Tags" initialValues={[{ value: 'a' }, { value: 'b' }]} onValuesChange={onValuesChange} />,
    )
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    expect(removeButtons).toHaveLength(2)
    await userEvent.click(removeButtons[0])
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(onValuesChange).toHaveBeenLastCalledWith(['b'])
  })

  test('initial required lines are protected from removal', () => {
    render(
      <InputsGroup label="Owners" initialValues={[{ value: 'a', isRequired: true }, { value: 'b' }]} />,
    )
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1)
  })

  test('added lines are always removable even in a required group', async () => {
    render(<InputsGroup label="Owners" initialValues={[{ value: 'a', isRequired: true }]} />)
    expect(screen.queryAllByRole('button', { name: 'Remove' })).toHaveLength(0)
    await userEvent.click(screen.getByRole('button', { name: /Add/ }))
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1)
  })

  test('typing updates raw and filtered values', async () => {
    const onValuesChange = vi.fn()
    const onNonEmptyValuesChange = vi.fn()
    render(
      <InputsGroup
        label="Tags"
        initialValues={[{ value: '' }]}
        onValuesChange={onValuesChange}
        onNonEmptyValuesChange={onNonEmptyValuesChange}
      />,
    )
    await userEvent.type(screen.getByRole('textbox'), 'x')
    expect(onValuesChange).toHaveBeenLastCalledWith(['x'])
    expect(onNonEmptyValuesChange).toHaveBeenLastCalledWith(['x'])
  })

  test('maxItems disables the add button once reached', () => {
    render(<InputsGroup label="Tags" maxItems={2} initialValues={[{ value: 'a' }, { value: 'b' }]} />)
    expect((screen.getByRole('button', { name: /Add/ }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('isAddButtonHidden hides the add button', () => {
    render(<InputsGroup label="Tags" isAddButtonHidden initialValues={[{ value: 'a' }]} />)
    expect(screen.queryByRole('button', { name: /Add/ })).toBeNull()
  })

  test('a fixed list (required initials equal to maxItems) hides the add button', () => {
    render(
      <InputsGroup
        label="Tags"
        maxItems={2}
        initialValues={[
          { value: 'a', isRequired: true },
          { value: 'b', isRequired: true },
        ]}
      />,
    )
    expect(screen.queryByRole('button', { name: /Add/ })).toBeNull()
    expect(screen.queryAllByRole('button', { name: 'Remove' })).toHaveLength(0)
  })

  test('number mode keeps null in raw values but filters it out of nonEmptyValues', async () => {
    const onValuesChange = vi.fn()
    const onNonEmptyValuesChange = vi.fn()
    render(
      <InputsGroup
        type="number"
        label="Amounts"
        initialValues={[{ value: 10 }]}
        onValuesChange={onValuesChange}
        onNonEmptyValuesChange={onNonEmptyValuesChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Add/ }))
    expect(onValuesChange).toHaveBeenLastCalledWith([10, null])
    expect(onNonEmptyValuesChange).toHaveBeenLastCalledWith([10])
  })

  test('renderRemoveButton replaces the default remove button', () => {
    render(
      <InputsGroup
        label="Tags"
        initialValues={[{ value: 'a' }]}
        renderRemoveButton={({ onRemove }) => (
          <button type="button" onClick={onRemove}>
            custom-remove
          </button>
        )}
      />,
    )
    expect(screen.getByRole('button', { name: 'custom-remove' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
  })

  test('addButtonLabel overrides the default label', () => {
    render(<InputsGroup label="Tags" addButtonLabel="Add a tag" initialValues={[{ value: 'a' }]} />)
    expect(screen.getByRole('button', { name: 'Add a tag' })).toBeDefined()
  })

  test('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<InputsGroup ref={ref} label="Tags" initialValues={[{ value: 'a' }]} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('the error prop is rendered once, under the first input', () => {
    render(<InputsGroup label="Tags" error="Group error" initialValues={[{ value: 'a' }, { value: 'b' }]} />)
    expect(screen.getAllByText('Group error')).toHaveLength(1)
  })

  test('isDisabled cascades to every input and to the buttons', () => {
    render(<InputsGroup label="Tags" isDisabled initialValues={[{ value: 'a' }, { value: 'b' }]} />)
    for (const input of screen.getAllByRole('textbox') as HTMLInputElement[]) {
      expect(input.disabled).toBe(true)
    }
    for (const button of screen.getAllByRole('button') as HTMLButtonElement[]) {
      expect(button.disabled).toBe(true)
    }
  })

  test('number mode reports numeric values as they are typed', async () => {
    const onValuesChange = vi.fn()
    render(
      <InputsGroup type="number" label="Amounts" initialValues={[{ value: null }]} onValuesChange={onValuesChange} />,
    )
    await userEvent.type(screen.getByRole('textbox'), '5')
    expect(onValuesChange).toHaveBeenLastCalledWith([5])
  })

  test('renders no rows when initialValues is omitted, and add still works', async () => {
    const onValuesChange = vi.fn()
    render(<InputsGroup label="Tags" onValuesChange={onValuesChange} />)
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    await userEvent.click(screen.getByRole('button', { name: /Add/ }))
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(onValuesChange).toHaveBeenLastCalledWith([''])
  })

  test('editing one line preserves the others', async () => {
    const onValuesChange = vi.fn()
    render(
      <InputsGroup label="Tags" initialValues={[{ value: 'a' }, { value: 'b' }]} onValuesChange={onValuesChange} />,
    )
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[1], 'c')
    expect(onValuesChange).toHaveBeenLastCalledWith(['a', 'bc'])
  })

  test('renderRemoveButton onRemove removes the matching line', async () => {
    const onValuesChange = vi.fn()
    render(
      <InputsGroup
        label="Tags"
        initialValues={[{ value: 'a' }, { value: 'b' }]}
        onValuesChange={onValuesChange}
        renderRemoveButton={({ onRemove }) => (
          <button type="button" onClick={onRemove}>
            custom-remove
          </button>
        )}
      />,
    )
    const buttons = screen.getAllByRole('button', { name: 'custom-remove' })
    expect(buttons).toHaveLength(2)
    await userEvent.click(buttons[0])
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(onValuesChange).toHaveBeenLastCalledWith(['b'])
  })

  test('addLine respects maxItems even when the add button is force-enabled', async () => {
    render(
      <InputsGroup
        label="Tags"
        maxItems={2}
        addButtonProps={{ isDisabled: false }}
        initialValues={[{ value: 'a' }, { value: 'b' }]}
      />,
    )
    const addButton = screen.getByRole('button', { name: /Add/ }) as HTMLButtonElement
    expect(addButton.disabled).toBe(false)
    await userEvent.click(addButton)
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  test('isFullWidth spans the root full width', () => {
    const { container } = render(<InputsGroup label="Tags" isFullWidth initialValues={[{ value: 'a' }]} />)
    expect((container.firstChild as HTMLElement).className).toContain('w-full')
  })

  test('renders the header with a description and no label', () => {
    const { container } = render(<InputsGroup description="Only description" initialValues={[{ value: 'a' }]} />)
    expect(screen.getByText('Only description')).toBeDefined()
    expect(container.querySelector('label')).toBeNull()
  })

  test('renders no header when neither label nor description is provided', () => {
    const { container } = render(<InputsGroup initialValues={[{ value: 'a' }]} />)
    expect(container.querySelector('label')).toBeNull()
    expect(screen.getByRole('textbox')).toBeDefined()
  })

  describe('remove button placement', () => {
    test('"right" (default) renders the remove button after the input', () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: 'a' }]} />)
      const input = screen.getByRole('textbox')
      const removeButton = screen.getByRole('button', { name: 'Remove' })
      expect(input.compareDocumentPosition(removeButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('"left" renders the remove button before the input', () => {
      render(<InputsGroup label="Tags" removeButtonPlacement="left" initialValues={[{ value: 'a' }]} />)
      const input = screen.getByRole('textbox')
      const removeButton = screen.getByRole('button', { name: 'Remove' })
      expect(removeButton.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  describe('controlled values', () => {
    test('the values prop drives what each line displays', () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: 'a' }, { value: 'b' }]} values={['x', 'y']} />)
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['x', 'y'])
    })

    test('typing does not move the UI when the parent ignores the change', async () => {
      const onValuesChange = vi.fn()
      render(<InputsGroup label="Tags" values={['a']} onValuesChange={onValuesChange} />)
      const input = screen.getAllByRole('textbox')[0] as HTMLInputElement
      await userEvent.type(input, 'bc')
      expect(onValuesChange).toHaveBeenCalled()
      expect(input.value).toBe('a')
    })

    test('a longer array appends removable lines', () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: 'a' }]} values={['a', 'b', 'c']} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(3)
      expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(3)
    })

    test('a shorter array drops trailing lines', () => {
      render(
        <InputsGroup label="Tags" initialValues={[{ value: 'a' }, { value: 'b' }, { value: 'c' }]} values={['x']} />,
      )
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['x'])
    })

    test('a shorter array never drops a protected line, it empties it instead', () => {
      render(
        <InputsGroup
          label="Tags"
          initialValues={[{ value: 'a' }, { value: 'b', isRequired: true }, { value: 'c' }]}
          values={['x']}
        />,
      )
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['x', ''])
      expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1)
    })

    test('protection stays attached to the line, not to its position', async () => {
      const onValuesChange = vi.fn()
      render(
        <InputsGroup
          label="Tags"
          initialValues={[{ value: 'a' }, { value: 'b', isRequired: true }]}
          onValuesChange={onValuesChange}
        />,
      )
      await userEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
      expect(onValuesChange).toHaveBeenLastCalledWith(['b'])
      expect(screen.queryAllByRole('button', { name: 'Remove' })).toHaveLength(0)
    })

    test('an uncontrolled group is unaffected when values is omitted', async () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: 'a' }]} />)
      const input = screen.getAllByRole('textbox')[0] as HTMLInputElement
      await userEvent.type(input, 'bc')
      expect(input.value).toBe('abc')
    })

    test('number mode accepts a controlled array holding null', () => {
      render(
        <InputsGroup
          type="number"
          label="Scores"
          initialValues={[{ value: 1 }, { value: 2 }]}
          values={[7, null]}
        />,
      )
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['7', ''])
    })
  })

  describe('validation', () => {
    test('shared validations show an error under the row on blur', async () => {
      render(
        <InputsGroup
          label="Usernames"
          initialValues={[{ value: '' }]}
          validations={[(value) => (value.length >= 3 ? null : 'Too short')]}
        />,
      )
      await userEvent.type(screen.getByRole('textbox'), 'ab')
      await userEvent.tab()
      expect(screen.getByText('Too short')).toBeDefined()
    })

    test('a protected required line shows the required error when left empty', async () => {
      render(<InputsGroup label="Owners" initialValues={[{ value: '', isRequired: true }]} />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('a non-required row never triggers the required error', async () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: '' }]} />)
      await userEvent.click(screen.getByRole('textbox'))
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
    })
  })

  describe('defaults config', () => {
    test('uses defaults.inputsGroup.addLabel for the add button', () => {
      render(
        <EasyUIProvider config={{ defaults: { inputsGroup: { addLabel: 'Add more' } } }}>
          <InputsGroup label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Add more' })).toBeDefined()
    })

    test('instance addButtonLabel overrides the default', () => {
      render(
        <EasyUIProvider config={{ defaults: { inputsGroup: { addLabel: 'Add more' } } }}>
          <InputsGroup label="Tags" addButtonLabel="Instance" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Instance' })).toBeDefined()
    })
  })

  describe('global wrappers config', () => {
    const config: EasyUIConfig = {
      wrappers: { inputsGroup: { base: 'wrapper-base-class', items: 'wrapper-items-class', addButton: 'wrapper-add-class' } },
    }

    test('applies the global wrapper slot classes across slots', () => {
      const { container } = render(
        <EasyUIProvider config={config}>
          <InputsGroup label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(container.querySelector('.wrapper-base-class')).not.toBeNull()
      expect(container.querySelector('.wrapper-items-class')).not.toBeNull()
      expect(screen.getByRole('button', { name: /Add/ }).className).toContain('wrapper-add-class')
    })

    test('instance classNames win over the global wrapper on the same slot', () => {
      render(
        <EasyUIProvider config={config}>
          <InputsGroup label="Tags" classNames={{ addButton: 'instance-add-class' }} initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      const addButton = screen.getByRole('button', { name: /Add/ })
      expect(addButton.className).toContain('wrapper-add-class')
      expect(addButton.className).toContain('instance-add-class')
    })

    test('no provider leaves the rendering unchanged', () => {
      render(<InputsGroup label="Tags" initialValues={[{ value: 'a' }]} />)
      expect(screen.getByRole('button', { name: /Add/ }).className).not.toContain('wrapper-add-class')
    })
  })

  describe('presets config', () => {
    const config: EasyUIConfig = {
      presets: {
        inputsGroup: {
          compact: { props: { addButtonLabel: 'Add row' }, classNames: { addButton: 'preset-add-class' } },
        },
      },
    }

    test('preset props change the rendering', () => {
      render(
        <EasyUIProvider config={config}>
          <InputsGroup preset="compact" label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Add row' })).toBeDefined()
    })

    test('preset classNames apply to the slot', () => {
      render(
        <EasyUIProvider config={config}>
          <InputsGroup preset="compact" label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Add row' }).className).toContain('preset-add-class')
    })

    test('instance addButtonLabel wins over preset', () => {
      render(
        <EasyUIProvider config={config}>
          <InputsGroup preset="compact" addButtonLabel="Instance" label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Instance' })).toBeDefined()
    })

    test('unknown preset falls back to defaults', () => {
      render(
        <EasyUIProvider config={config}>
          <InputsGroup preset="does-not-exist" label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: /Add/ })).toBeDefined()
    })

    test('a preset with only props (no classNames) renders', () => {
      render(
        <EasyUIProvider config={{ presets: { inputsGroup: { minimal: { props: { addButtonLabel: 'Add one' } } } } }}>
          <InputsGroup preset="minimal" label="Tags" initialValues={[{ value: 'a' }]} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Add one' })).toBeDefined()
    })
  })
})
