import { describe, test, expect, vi, type Mock } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef, useState, type Ref } from 'react'
import { Form, useForm } from './index'
import type {
  FormActionsConfig,
  FormFields,
  FormInstance,
  FormSubmitHandler,
  FormValues,
  ValidateMode,
} from './Form.types'
import { EasyUIProvider } from '../../../providers'
import type { EasyUIConfig } from '../../../config/easyui.config.types'

interface HarnessProps {
  fields: FormFields
  onSubmit?: FormSubmitHandler
  validateOn?: ValidateMode
  actions?: FormActionsConfig
  preset?: string
  title?: string
  description?: string
  loadingMessage?: string
  disabledMessage?: string
  isDisabled?: boolean
  isLoading?: boolean
  className?: string
  classNames?: Record<string, string>
  formRef?: Ref<HTMLFormElement>
}

function TestForm({ fields, onSubmit = () => {}, validateOn, formRef, ...rest }: HarnessProps) {
  const form = useForm(fields, { validateOn })
  return <Form ref={formRef} form={form} onSubmit={onSubmit} {...rest} />
}

function renderForm(props: HarnessProps, config?: EasyUIConfig) {
  if (config) {
    return render(
      <EasyUIProvider config={config}>
        <TestForm {...props} />
      </EasyUIProvider>,
    )
  }
  return render(<TestForm {...props} />)
}

function FormWithControls({
  fields,
  onApply,
}: {
  fields: FormFields
  onApply?: (form: FormInstance) => void
}) {
  const form = useForm(fields)
  return (
    <>
      <Form form={form} onSubmit={() => {}} />
      {onApply && (
        <button type="button" onClick={() => onApply(form)}>
          apply
        </button>
      )}
      <button type="button" onClick={() => form.reset()}>
        reset form
      </button>
    </>
  )
}

function expectSubmittedWith(onSubmit: Mock, values: FormValues, allValues: FormValues = values) {
  expect(onSubmit).toHaveBeenCalledWith(values, allValues)
}

describe('Form', () => {
  test('renders every built-in field type from the config', () => {
    renderForm({
      fields: {
        firstName: { type: 'input', label: 'First name' },
        country: { type: 'selector', label: 'Country', options: [{ value: 'fr', label: 'France' }] },
        city: { type: 'autocomplete', label: 'City', options: [{ value: 'paris', label: 'Paris' }] },
        age: { type: 'number', label: 'Age' },
      },
    })
    expect(screen.getByLabelText('First name')).toBeDefined()
    expect(screen.getByText('Country')).toBeDefined()
    expect(screen.getByLabelText('City')).toBeDefined()
    expect(screen.getByLabelText('Age')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined()
  })

  test('renders an optional title and description', () => {
    renderForm({
      fields: { name: { type: 'input', label: 'Name' } },
      title: 'My form',
      description: 'A short description.',
    })
    expect(screen.getByRole('heading', { name: 'My form' })).toBeDefined()
    expect(screen.getByText('A short description.')).toBeDefined()
  })

  test('omits the header when neither title nor description is set', () => {
    renderForm({ fields: { name: { type: 'input', label: 'Name' } } })
    expect(screen.queryByRole('heading')).toBeNull()
  })

  test('maps input `kind` to the native input type', () => {
    renderForm({ fields: { email: { type: 'input', kind: 'email', label: 'Email' } } })
    expect(screen.getByLabelText('Email').getAttribute('type')).toBe('email')
  })

  test('updates the field value as the user types', async () => {
    renderForm({ fields: { name: { type: 'input', label: 'Name' } } })
    const input = screen.getByLabelText('Name') as HTMLInputElement
    await userEvent.type(input, 'Ada')
    expect(input.value).toBe('Ada')
  })

  test('runs custom validators and shows their message', async () => {
    const onSubmit = vi.fn()
    renderForm({
      fields: {
        email: {
          type: 'input',
          label: 'Email',
          validators: [(value: string) => (value.includes('@') ? null : 'Invalid email')],
        },
      },
      onSubmit,
    })
    await userEvent.type(screen.getByLabelText('Email'), 'nope')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('Invalid email')).toBeDefined()
  })

  test('supports cross-field validators via the values argument', async () => {
    const onSubmit = vi.fn()
    renderForm({
      fields: {
        password: { type: 'input', label: 'Password' },
        confirm: {
          type: 'input',
          label: 'Confirm',
          validators: [(value: string, values) => (value === values.password ? null : 'Mismatch')],
        },
      },
      onSubmit,
    })
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.type(screen.getByLabelText('Confirm'), 'other')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('Mismatch')).toBeDefined()
  })

  describe('validateOn', () => {
    test('"submit" (default) shows errors only after a submit attempt', async () => {
      renderForm({ fields: { name: { type: 'input', label: 'Name', isRequired: true } } })
      const input = screen.getByRole('textbox')
      input.focus()
      await userEvent.tab()
      expect(screen.queryByText('This field is required')).toBeNull()
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('"blur" shows a field error once it loses focus', async () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name', isRequired: true } },
        validateOn: 'blur',
      })
      const input = screen.getByRole('textbox')
      input.focus()
      expect(screen.queryByText('This field is required')).toBeNull()
      await userEvent.tab()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('"change" validates as the user types', async () => {
      renderForm({
        fields: {
          email: {
            type: 'input',
            label: 'Email',
            validators: [(value: string) => (value.includes('@') ? null : 'Invalid email')],
          },
        },
        validateOn: 'change',
      })
      const input = screen.getByLabelText('Email')
      await userEvent.type(input, 'x')
      expect(screen.getByText('Invalid email')).toBeDefined()
      await userEvent.type(input, '@y.z')
      expect(screen.queryByText('Invalid email')).toBeNull()
    })
  })

  describe('required message', () => {
    test('uses a per-field isRequiredMessage', async () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name', isRequired: true, isRequiredMessage: 'Name is mandatory' } },
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Name is mandatory')).toBeDefined()
    })

    test('falls back to the global default requiredMessage from config', async () => {
      renderForm(
        { fields: { name: { type: 'input', label: 'Name', isRequired: true } } },
        { defaults: { requiredMessage: 'Obligatoire' } },
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Obligatoire')).toBeDefined()
    })
  })

  test('submits the collected values', async () => {
    const onSubmit = vi.fn()
    renderForm({
      fields: {
        name: { type: 'input', label: 'Name' },
        role: { type: 'input', label: 'Role' },
      },
      onSubmit,
    })
    await userEvent.type(screen.getByLabelText('Name'), 'Ada')
    await userEvent.type(screen.getByLabelText('Role'), 'Dev')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expectSubmittedWith(onSubmit, { name: 'Ada', role: 'Dev' })
  })

  describe('number field', () => {
    test('collects a numeric value', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { age: { type: 'number', label: 'Age' } }, onSubmit })
      await userEvent.type(screen.getByLabelText('Age'), '42')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { age: 42 })
    })

    test('is empty (null) when blank, blocking a required field', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { age: { type: 'number', label: 'Age', isRequired: true } }, onSubmit })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('treats 0 as a valid (non-empty) value', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { qty: { type: 'number', label: 'Qty', isRequired: true } }, onSubmit })
      await userEvent.type(screen.getByRole('spinbutton'), '0')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { qty: 0 })
    })

    test('clearing the field sends the value back to null', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { age: { type: 'number', label: 'Age' } }, onSubmit })
      const input = screen.getByRole('spinbutton')
      await userEvent.type(input, '42')
      await userEvent.clear(input)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { age: null })
    })

    test('non-numeric keystrokes never reach the form, the native input rejects them', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { age: { type: 'number', label: 'Age' } }, onSubmit })
      await userEvent.type(screen.getByRole('spinbutton'), 'abc')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { age: null })
    })
  })

  describe('multi-selection fields', () => {
    const fruitOptions = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ]

    test('a multiple selector collects a list of values', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: { fruits: { type: 'selector', selectionMode: 'multiple', label: 'Fruits', options: fruitOptions } },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Apple'))
      await userEvent.click(screen.getByText('Banana'))
      await userEvent.keyboard('{Escape}')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { fruits: ['apple', 'banana'] })
    })

    test('a multiple autocomplete collects a list of values', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          fruits: { type: 'autocomplete', selectionMode: 'multiple', label: 'Fruits', options: fruitOptions },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Apple'))
      await userEvent.keyboard('{Escape}')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { fruits: ['apple'] })
    })

    test('an empty list blocks a required multiple selector', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          fruits: {
            type: 'selector',
            selectionMode: 'multiple',
            label: 'Fruits',
            isRequired: true,
            options: fruitOptions,
          },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('a single selector still submits a plain string', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: { fruit: { type: 'selector', label: 'Fruit', options: fruitOptions } },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('combobox'))
      await userEvent.click(screen.getByText('Apple'))
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { fruit: 'apple' })
    })
  })

  describe('inputs-group field', () => {
    test('submits the filtered list, while allValues keeps the empty rows', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          tags: { type: 'inputs-group', label: 'Tags', initialValues: [{ value: 'react' }, { value: '' }] },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { tags: ['react'] }, { tags: ['react', ''] })
    })

    test('typing in a row updates the form value', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: { tags: { type: 'inputs-group', label: 'Tags', initialValues: [{ value: '' }] } },
        onSubmit,
      })
      await userEvent.type(screen.getAllByRole('textbox')[0], 'vue')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { tags: ['vue'] })
    })

    test('adding a row keeps it visible, since the form controls the values', async () => {
      renderForm({
        fields: { tags: { type: 'inputs-group', label: 'Tags', initialValues: [{ value: 'react' }] } },
      })
      expect(screen.getAllByRole('textbox')).toHaveLength(1)
      await userEvent.click(screen.getByRole('button', { name: /Add/ }))
      expect(screen.getAllByRole('textbox')).toHaveLength(2)
    })

    test('a protected row left empty blocks the submit, even without a field-level isRequired', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          aliases: {
            type: 'inputs-group',
            label: 'Aliases',
            initialValues: [{ value: '', isRequired: true }, { value: '' }],
          },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('filling as many rows as there are protected ones unblocks the submit', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          aliases: {
            type: 'inputs-group',
            label: 'Aliases',
            initialValues: [{ value: '', isRequired: true }, { value: '' }],
          },
        },
        onSubmit,
      })
      await userEvent.type(screen.getAllByRole('textbox')[0], 'main')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { aliases: ['main'] }, { aliases: ['main', ''] })
    })

    test('two protected rows require two filled entries', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          aliases: {
            type: 'inputs-group',
            label: 'Aliases',
            initialValues: [{ value: '', isRequired: true }, { value: '', isRequired: true }],
          },
        },
        onSubmit,
      })
      await userEvent.type(screen.getAllByRole('textbox')[0], 'main')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).not.toHaveBeenCalled()

      await userEvent.type(screen.getAllByRole('textbox')[1], 'second')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { aliases: ['main', 'second'] })
    })

    test('a list of empty rows blocks a required group', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          tags: { type: 'inputs-group', label: 'Tags', isRequired: true, initialValues: [{ value: '' }] },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('This field is required')).toBeDefined()
    })

    test('the number variant submits numbers only, allValues keeping the null rows', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: {
          amounts: {
            type: 'inputs-group',
            itemsType: 'number',
            label: 'Amounts',
            initialValues: [{ value: 10 }, { value: null }],
          },
        },
        onSubmit,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { amounts: [10] }, { amounts: [10, null] })
    })

    test('a group without initialValues starts with no row and still accepts new ones', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: { tags: { type: 'inputs-group', label: 'Tags' } }, onSubmit })
      expect(screen.queryAllByRole('textbox')).toHaveLength(0)

      await userEvent.click(screen.getByRole('button', { name: /Add/ }))
      await userEvent.type(screen.getAllByRole('textbox')[0], 'react')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { tags: ['react'] })
    })

    test('a number group without initialValues submits an empty list', async () => {
      const onSubmit = vi.fn()
      renderForm({
        fields: { amounts: { type: 'inputs-group', itemsType: 'number', label: 'Amounts' } },
        onSubmit,
      })
      expect(screen.queryAllByRole('textbox')).toHaveLength(0)

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { amounts: [] })
    })

    test('form.setValue moves the rendered rows', async () => {
      render(
        <FormWithControls
          fields={{ tags: { type: 'inputs-group', label: 'Tags', initialValues: [{ value: 'react' }] } }}
          onApply={(form) => form.setValue('tags', ['a', 'b', 'c'])}
        />,
      )
      expect(screen.getAllByRole('textbox')).toHaveLength(1)

      await userEvent.click(screen.getByRole('button', { name: 'apply' }))
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['a', 'b', 'c'])
    })

    test('form.reset restores the initial rows and values', async () => {
      render(
        <FormWithControls
          fields={{ tags: { type: 'inputs-group', label: 'Tags', initialValues: [{ value: 'react' }] } }}
          onApply={(form) => form.setValue('tags', ['a', 'b'])}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'apply' }))
      expect(screen.getAllByRole('textbox')).toHaveLength(2)

      await userEvent.click(screen.getByRole('button', { name: 'reset form' }))
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      expect(inputs.map((input) => input.value)).toEqual(['react'])
    })
  })

  describe('conditional fields (dependsOn)', () => {
    const conditionalFields: FormFields = {
      trigger: { type: 'input', label: 'Trigger' },
      secret: { type: 'input', label: 'Secret', dependsOn: { trigger: 'show' } },
    }

    test('hides a field until its dependency matches', async () => {
      renderForm({ fields: conditionalFields })
      expect(screen.queryByLabelText('Secret')).toBeNull()
      await userEvent.type(screen.getByLabelText('Trigger'), 'show')
      expect(screen.getByLabelText('Secret')).toBeDefined()
    })

    test('resets a hidden field value and excludes it from submit', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: conditionalFields, onSubmit })
      await userEvent.type(screen.getByLabelText('Trigger'), 'show')
      await userEvent.type(screen.getByLabelText('Secret'), 'abc')

      await userEvent.clear(screen.getByLabelText('Trigger'))
      expect(screen.queryByLabelText('Secret')).toBeNull()

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { trigger: '' }, { trigger: '', secret: '' })

      await userEvent.type(screen.getByLabelText('Trigger'), 'show')
      expect((screen.getByLabelText('Secret') as HTMLInputElement).value).toBe('')
    })

    test('supports dependsOn: null and nested dependencies', async () => {
      renderForm({
        fields: {
          a: { type: 'input', label: 'A' },
          b: { type: 'input', label: 'B', dependsOn: { a: 'go' } },
          c: { type: 'input', label: 'C', dependsOn: { b: null } },
        },
      })
      expect(screen.queryByLabelText('B')).toBeNull()
      expect(screen.queryByLabelText('C')).toBeNull()
      await userEvent.type(screen.getByLabelText('A'), 'go')
      expect(screen.getByLabelText('B')).toBeDefined()
      expect(screen.getByLabelText('C')).toBeDefined()
    })

    test('hides a field via the isHidden predicate', async () => {
      renderForm({
        fields: {
          plan: { type: 'input', label: 'Plan' },
          coupon: { type: 'input', label: 'Coupon', isHidden: (values) => values.plan === 'free' },
        },
      })
      expect(screen.getByLabelText('Coupon')).toBeDefined()
      await userEvent.type(screen.getByLabelText('Plan'), 'free')
      expect(screen.queryByLabelText('Coupon')).toBeNull()
    })

    test('breaks a dependsOn cycle without infinite recursion', () => {
      renderForm({
        fields: {
          a: { type: 'input', label: 'A', dependsOn: { b: null } },
          b: { type: 'input', label: 'B', dependsOn: { a: null } },
        },
      })
      expect(screen.getByLabelText('A')).toBeDefined()
      expect(screen.getByLabelText('B')).toBeDefined()
    })
  })

  test('renders and wires a custom field to the form state', async () => {
    const onSubmit = vi.fn()
    renderForm({
      fields: {
        toggle: {
          type: 'custom',
          defaultValue: 'off',
          render: (ctx) => (
            <button type="button" onClick={() => ctx.setValue('on')}>
              value: {String(ctx.value)}
            </button>
          ),
        },
      },
      onSubmit,
    })
    const custom = screen.getByRole('button', { name: /value:/ })
    expect(custom.textContent).toContain('off')
    await userEvent.click(custom)
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expectSubmittedWith(onSubmit, { toggle: 'on' })
  })

  describe('actions', () => {
    test('shows only the submit button by default', () => {
      renderForm({ fields: { name: { type: 'input', label: 'Name' } } })
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined()
      expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    })

    test('shows a cancel button, before submit, when onCancel is provided', async () => {
      const onCancel = vi.fn()
      renderForm({ fields: { name: { type: 'input', label: 'Name' } }, actions: { onCancel } })
      const buttons = screen.getAllByRole('button')
      expect(buttons[0].textContent).toBe('Cancel')
      expect(buttons[1].textContent).toBe('Submit')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onCancel).toHaveBeenCalled()
    })

    test('uses custom labels', () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        actions: { submitLabel: 'Save', cancelLabel: 'Discard', onCancel: () => {} },
      })
      expect(screen.getByRole('button', { name: 'Save' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Discard' })).toBeDefined()
    })
  })

  describe('slots and styling', () => {
    test('applies the per-type field slot to the rendered field', () => {
      const { container } = renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        classNames: { inputField: 'my-input-field' },
      })
      expect(container.querySelector('.my-input-field')).not.toBeNull()
    })

    test('applies the submitButton slot', () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        classNames: { submitButton: 'my-submit' },
      })
      expect(screen.getByRole('button', { name: 'Submit' }).classList.contains('my-submit')).toBe(true)
    })

    test('applies global wrappers config for form slots', () => {
      renderForm(
        { fields: { name: { type: 'input', label: 'Name' } } },
        { wrappers: { form: { submitButton: 'global-submit' } } },
      )
      expect(screen.getByRole('button', { name: 'Submit' }).classList.contains('global-submit')).toBe(true)
    })
  })

  test('disables every field and action when the form is disabled', () => {
    renderForm({ fields: { name: { type: 'input', label: 'Name' } }, isDisabled: true })
    expect(screen.getByLabelText('Name').hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')).toBe(true)
  })

  test('replaces the description with loadingMessage / disabledMessage', () => {
    const baseFields: FormFields = { name: { type: 'input', label: 'Name' } }

    const loading = renderForm({
      fields: baseFields,
      description: 'A description.',
      loadingMessage: 'Saving…',
      isLoading: true,
    })
    expect(screen.getByText('Saving…')).toBeDefined()
    expect(screen.queryByText('A description.')).toBeNull()
    loading.unmount()

    renderForm({
      fields: baseFields,
      description: 'A description.',
      disabledMessage: 'Locked.',
      isDisabled: true,
    })
    expect(screen.getByText('Locked.')).toBeDefined()
    expect(screen.queryByText('A description.')).toBeNull()
  })

  test('uses loadingLabel while isLoading and submittingLabel while submitting', async () => {
    const loading = renderForm({
      fields: { name: { type: 'input', label: 'Name', defaultValue: 'x' } },
      isLoading: true,
      actions: { loadingLabel: 'Loading…' },
    })
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDefined()
    loading.unmount()

    renderForm({
      fields: { name: { type: 'input', label: 'Name', defaultValue: 'x' } },
      onSubmit: () => new Promise<void>(() => {}),
      actions: { submittingLabel: 'Saving…' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByRole('button', { name: 'Saving…' })).toBeDefined()
  })

  test('puts fields into their loading state when isLoading', () => {
    const { container } = renderForm({
      fields: { name: { type: 'input', label: 'Name' } },
      isLoading: true,
    })
    expect(screen.getByLabelText('Name').hasAttribute('disabled')).toBe(true)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  test('reset restores the initial values', async () => {
    function ResetForm() {
      const form = useForm({ name: { type: 'input', label: 'Name', defaultValue: 'Ada' } })
      return <Form form={form} onSubmit={() => {}} actions={{ cancelLabel: 'Reset', onCancel: () => form.reset() }} />
    }
    render(<ResetForm />)
    const input = screen.getByLabelText('Name') as HTMLInputElement
    await userEvent.clear(input)
    await userEvent.type(input, 'Grace')
    expect(input.value).toBe('Grace')
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Ada')
  })

  test('reset remounts the fields with a fresh DOM node', async () => {
    function ResetForm() {
      const form = useForm({ amount: { type: 'number', label: 'Amount' } })
      return <Form form={form} onSubmit={() => {}} actions={{ cancelLabel: 'Reset', onCancel: () => form.reset() }} />
    }
    render(<ResetForm />)
    const before = screen.getByLabelText('Amount')
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    const after = screen.getByLabelText('Amount')
    expect(after).not.toBe(before)
  })

  describe('presets config', () => {
    test('applies a form preset classNames from the global config', () => {
      renderForm(
        { fields: { name: { type: 'input', label: 'Name' } }, preset: 'compact' },
        { presets: { form: { compact: { classNames: { submitButton: 'preset-submit' } } } } },
      )
      expect(screen.getByRole('button', { name: 'Submit' }).classList.contains('preset-submit')).toBe(true)
    })

    test('a preset can set props', () => {
      renderForm(
        { fields: { name: { type: 'input', label: 'Name' } }, preset: 'locked' },
        { presets: { form: { locked: { props: { isDisabled: true } } } } },
      )
      expect(screen.getByLabelText('Name').hasAttribute('disabled')).toBe(true)
    })
  })

  describe('errors of fields that become hidden', () => {
    const fields: FormFields = {
      mode: { type: 'input', label: 'Mode' },
      detail: { type: 'input', label: 'Detail', isRequired: true, isHidden: (values) => values.mode === 'hide' },
    }

    test('a pending error is cleared when its field is hidden, and does not come back stale', () => {
      const { result } = renderHook(() => useForm(fields, { validateOn: 'blur' }))

      act(() => result.current.handleBlur('detail'))
      expect(result.current.fields.detail.error).toBe('This field is required')

      act(() => result.current.setValue('mode', 'hide'))
      expect(result.current.fields.detail.error).toBeNull()

      act(() => result.current.setValue('mode', 'show'))
      expect(result.current.fields.detail.error).toBeNull()
    })
  })

  describe('submitted payloads', () => {
    const fields: FormFields = {
      trigger: { type: 'input', label: 'Trigger' },
      secret: { type: 'input', label: 'Secret', defaultValue: 'initial', dependsOn: { trigger: 'show' } },
    }

    test('the first payload omits hidden fields, the second keeps them at their initial value', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields, onSubmit })
      await userEvent.type(screen.getByLabelText('Trigger'), 'nope')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { trigger: 'nope' }, { trigger: 'nope', secret: 'initial' })
    })

    test('both payloads agree once every field is visible', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields, onSubmit })
      await userEvent.type(screen.getByLabelText('Trigger'), 'show')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { trigger: 'show', secret: 'initial' })
    })
  })

  describe('field remounting on reset', () => {
    function StatefulProbe() {
      const [isTouched, setIsTouched] = useState(false)
      return (
        <button type="button" onClick={() => setIsTouched(true)}>
          {isTouched ? 'touched' : 'pristine'}
        </button>
      )
    }

    test('reset remounts every field, so a field holding its own state is re-seeded', async () => {
      render(<FormWithControls fields={{ stateful: { type: 'custom', render: () => <StatefulProbe /> } }} />)

      await userEvent.click(screen.getByRole('button', { name: 'pristine' }))
      expect(screen.getByRole('button', { name: 'touched' })).toBeDefined()

      await userEvent.click(screen.getByRole('button', { name: 'reset form' }))
      expect(screen.getByRole('button', { name: 'pristine' })).toBeDefined()
    })
  })

  describe('form instance', () => {
    test('validate() returns false and surfaces errors for invalid fields', () => {
      const { result } = renderHook(() => useForm({ name: { type: 'input', isRequired: true } }))
      let valid = true
      act(() => {
        valid = result.current.validate()
      })
      expect(valid).toBe(false)
      expect(result.current.fields.name.error).toBe('This field is required')
    })

    test('validate() returns true when every field is valid', () => {
      const { result } = renderHook(() =>
        useForm({ name: { type: 'input', isRequired: true, defaultValue: 'Ada' } }),
      )
      let valid = false
      act(() => {
        valid = result.current.validate()
      })
      expect(valid).toBe(true)
    })

    test('setValue updates a field value', () => {
      const { result } = renderHook(() => useForm({ name: { type: 'input' } }))
      act(() => {
        result.current.setValue('name', 'Ada')
      })
      expect(result.current.values.name).toBe('Ada')
      expect(result.current.fields.name.value).toBe('Ada')
    })

    test('getFieldState returns the field state by name', () => {
      const { result } = renderHook(() => useForm({ name: { type: 'input', defaultValue: 'Ada' } }))
      expect(result.current.getFieldState('name').value).toBe('Ada')
    })
  })

  describe('exhaustiveness guards', () => {
    test('initialValueFor throws for an unknown field type', () => {
      const badFields = { x: { type: 'unknown' } } as unknown as FormFields
      expect(() => renderHook(() => useForm(badFields))).toThrow('Unexpected value')
    })

    test('FormField throws for an unknown field type', () => {
      const badFields = { x: { type: 'unknown', defaultValue: '' } } as unknown as FormFields
      expect(() => render(<TestForm fields={badFields} />)).toThrow('Unexpected value')
    })
  })

  test('forwards ref to the form element', () => {
    const ref = createRef<HTMLFormElement>()
    renderForm({ fields: { name: { type: 'input', label: 'Name' } }, formRef: ref })
    expect(ref.current?.tagName).toBe('FORM')
  })
})
