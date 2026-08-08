import { describe, test, expect, vi, type Mock } from 'vitest'
import { render, screen, renderHook, act, waitFor } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef, useState, type ReactNode, type Ref } from 'react'
import { Form, useForm } from './index'
import type {
  FormActionsConfig,
  FormColor,
  FormFieldPropsByType,
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
  fieldProps?: FormFieldPropsByType
  color?: FormColor
  preset?: string
  title?: string
  description?: ReactNode
  loadingMessage?: string
  disabledMessage?: string
  isDisabled?: boolean
  isLoading?: boolean
  isHeaderHidden?: boolean
  isResetOnCancel?: boolean
  isResetOnSubmit?: boolean
  className?: string
  classNames?: Record<string, string>
  error?: string
  submitErrorMessages?: Record<string | number, string>
  getSubmitErrorStatus?: (error: Error) => string | null
  onUnhandledSubmitError?: (error: Error) => void
  id?: string
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

  test('accepts markup as the description', () => {
    renderForm({
      fields: { name: { type: 'input', label: 'Name' } },
      title: 'My form',
      description: (
        <span>
          Read the <a href="https://example.com">guidelines</a> first.
        </span>
      ),
    })
    expect(screen.getByRole('link', { name: 'guidelines' })).toBeDefined()
  })

  test('omits the header when neither title nor description is set', () => {
    renderForm({ fields: { name: { type: 'input', label: 'Name' } } })
    expect(screen.queryByRole('heading')).toBeNull()
  })

  test('isHeaderHidden removes the header even when a title and a description are set', () => {
    renderForm({
      fields: { name: { type: 'input', label: 'Name' } },
      title: 'My form',
      description: 'A short description.',
      isHeaderHidden: true,
    })
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.queryByText('A short description.')).toBeNull()
  })

  test('isHeaderHidden also removes the header the loading message would have brought back', () => {
    renderForm(
      { fields: { name: { type: 'input', label: 'Name' } }, isLoading: true, isHeaderHidden: true },
      { defaults: { form: { loadingMessage: 'Loading the form…' } } },
    )
    expect(screen.queryByText('Loading the form…')).toBeNull()
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

  describe('loading and disabled messages from the global config', () => {
    const fields: FormFields = { name: { type: 'input', label: 'Name' } }
    const config: EasyUIConfig = {
      defaults: { form: { loadingMessage: 'Loading resources…', disabledMessage: 'Editing is locked' } },
    }

    test('the global loadingMessage replaces the description while loading', () => {
      renderForm({ fields, description: 'Helper text', isLoading: true }, config)
      expect(screen.getByText('Loading resources…')).toBeDefined()
      expect(screen.queryByText('Helper text')).toBeNull()
    })

    test('the global disabledMessage replaces the description while disabled', () => {
      renderForm({ fields, description: 'Helper text', isDisabled: true }, config)
      expect(screen.getByText('Editing is locked')).toBeDefined()
    })

    test('an instance message wins over the global one', () => {
      renderForm({ fields, isLoading: true, loadingMessage: 'Fetching options…' }, config)
      expect(screen.getByText('Fetching options…')).toBeDefined()
      expect(screen.queryByText('Loading resources…')).toBeNull()
    })

    test('the description is untouched when neither state applies', () => {
      renderForm({ fields, description: 'Helper text' }, config)
      expect(screen.getByText('Helper text')).toBeDefined()
    })
  })

  describe('submission errors', () => {
    const fields: FormFields = { name: { type: 'input', label: 'Name' } }

    class HttpError extends Error {
      response: { status: number }
      constructor(status: number) {
        super(`HTTP ${status}`)
        this.response = { status }
      }
    }

    const readHttpStatus = (error: Error) =>
      error instanceof HttpError ? String(error.response.status) : null

    async function collectUnhandledRejections(run: () => Promise<void>) {
      const rejections: PromiseRejectionEvent[] = []
      const collect = (event: PromiseRejectionEvent) => {
        rejections.push(event)
        event.preventDefault()
      }
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      window.addEventListener('unhandledrejection', collect)
      try {
        await run()
        await waitFor(() => expect(rejections).toHaveLength(1))
      } finally {
        window.removeEventListener('unhandledrejection', collect)
        consoleError.mockRestore()
      }
      return rejections
    }

    test('renders no alert when there is no error', () => {
      renderForm({ fields })
      expect(screen.queryByRole('alert')).toBeNull()
    })

    test('the error prop is displayed in an alert', () => {
      renderForm({ fields, error: 'The server is unreachable' })
      expect(screen.getByText('The server is unreachable')).toBeDefined()
    })

    test('a rejected submit whose status is mapped shows the mapped message', async () => {
      renderForm({
        fields,
        onSubmit: () => Promise.reject(new HttpError(409)),
        getSubmitErrorStatus: readHttpStatus,
        submitErrorMessages: { 409: 'This resource already exists' },
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('This resource already exists')).toBeDefined()
    })

    test('an unmapped status shows nothing, the error is left to the caller', async () => {
      const unmapped = new HttpError(503)
      const rejections = await collectUnhandledRejections(async () => {
        renderForm({
          fields,
          onSubmit: () => Promise.reject(unmapped),
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages: { 409: 'This resource already exists' },
        })
        await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      })
      expect(screen.queryByRole('alert')).toBeNull()
      expect(rejections[0].reason).toBe(unmapped)
    })

    test('an extractor that blows up on an unexpected error shape is neutralised', async () => {
      const plainError = new Error('plain error')
      const rejections = await collectUnhandledRejections(async () => {
        renderForm({
          fields,
          onSubmit: () => Promise.reject(plainError),
          getSubmitErrorStatus: (error) => (error as HttpError).response.status.toString(),
          submitErrorMessages: { 409: 'This resource already exists' },
        })
        await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      })
      expect(screen.queryByRole('alert')).toBeNull()
      expect(rejections[0].reason).toBe(plainError)
    })

    test('onUnhandledSubmitError receives the errors the mapping did not cover', async () => {
      const onUnhandledSubmitError = vi.fn()
      const unmapped = new HttpError(503)
      renderForm({
        fields,
        onSubmit: () => Promise.reject(unmapped),
        getSubmitErrorStatus: readHttpStatus,
        submitErrorMessages: { 409: 'This resource already exists' },
        onUnhandledSubmitError,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onUnhandledSubmitError).toHaveBeenCalledWith(unmapped)
      expect(screen.queryByRole('alert')).toBeNull()
    })

    test('onUnhandledSubmitError is not called for a mapped error', async () => {
      const onUnhandledSubmitError = vi.fn()
      renderForm({
        fields,
        onSubmit: () => Promise.reject(new HttpError(409)),
        getSubmitErrorStatus: readHttpStatus,
        submitErrorMessages: { 409: 'This resource already exists' },
        onUnhandledSubmitError,
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onUnhandledSubmitError).not.toHaveBeenCalled()
      expect(screen.getByText('This resource already exists')).toBeDefined()
    })

    test('onUnhandledSubmitError alone receives every failure, without any mapping', async () => {
      const onUnhandledSubmitError = vi.fn()
      const failure = new Error('network down')
      renderForm({ fields, onSubmit: () => Promise.reject(failure), onUnhandledSubmitError })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onUnhandledSubmitError).toHaveBeenCalledWith(failure)
    })

    test('the error prop wins over a mapped submission error', async () => {
      renderForm({
        fields,
        error: 'Controlled message',
        onSubmit: () => Promise.reject(new HttpError(409)),
        getSubmitErrorStatus: readHttpStatus,
        submitErrorMessages: { 409: 'Mapped message' },
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Controlled message')).toBeDefined()
      expect(screen.queryByText('Mapped message')).toBeNull()
    })

    test('a mapped error is cleared when the form is submitted again', async () => {
      let shouldFail = true
      renderForm({
        fields,
        onSubmit: () => (shouldFail ? Promise.reject(new HttpError(409)) : Promise.resolve()),
        getSubmitErrorStatus: readHttpStatus,
        submitErrorMessages: { 409: 'This resource already exists' },
      })
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('This resource already exists')).toBeDefined()

      shouldFail = false
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.queryByText('This resource already exists')).toBeNull()
    })

    test('the global config provides both the extractor and the messages', async () => {
      renderForm(
        { fields, onSubmit: () => Promise.reject(new HttpError(500)) },
        {
          defaults: {
            form: {
              getSubmitErrorStatus: readHttpStatus,
              submitErrorMessages: { 500: 'Server error, please retry' },
            },
          },
        },
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Server error, please retry')).toBeDefined()
    })

    test('instance messages merge with the global ones, key by key', async () => {
      renderForm(
        {
          fields,
          onSubmit: () => Promise.reject(new HttpError(500)),
          submitErrorMessages: { 409: 'Overridden conflict' },
        },
        {
          defaults: {
            form: {
              getSubmitErrorStatus: readHttpStatus,
              submitErrorMessages: { 409: 'Global conflict', 500: 'Global server error' },
            },
          },
        },
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Global server error')).toBeDefined()
    })

    test('an instance message overrides the global one for the same status', async () => {
      renderForm(
        {
          fields,
          onSubmit: () => Promise.reject(new HttpError(409)),
          submitErrorMessages: { 409: 'Overridden conflict' },
        },
        {
          defaults: {
            form: {
              getSubmitErrorStatus: readHttpStatus,
              submitErrorMessages: { 409: 'Global conflict' },
            },
          },
        },
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByText('Overridden conflict')).toBeDefined()
      expect(screen.queryByText('Global conflict')).toBeNull()
    })
  })

  describe('hiding the submit button', () => {
    test('isSubmitButtonHidden removes the submit button', () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        actions: { isSubmitButtonHidden: true },
      })
      expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
    })

    test('the cancel button survives on its own', () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        actions: { isSubmitButtonHidden: true, onCancel: () => {} },
      })
      expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined()
    })

    test('the actions row is not rendered at all when it would be empty', () => {
      const { container } = renderForm({
        fields: { name: { type: 'input', label: 'Name' } },
        actions: { isSubmitButtonHidden: true },
      })
      expect(container.querySelector('form > .justify-end')).toBeNull()
    })

    test('a submit button outside the form still submits it through the native form attribute', async () => {
      const onSubmit = vi.fn()
      render(
        <>
          <TestForm
            fields={{ name: { type: 'input', label: 'Name' } }}
            onSubmit={onSubmit}
            actions={{ isSubmitButtonHidden: true }}
            id="external-form"
          />
          <button type="submit" form="external-form">
            Save from outside
          </button>
        </>,
      )
      await userEvent.type(screen.getByLabelText('Name'), 'Ada')
      await userEvent.click(screen.getByRole('button', { name: 'Save from outside' }))
      expectSubmittedWith(onSubmit, { name: 'Ada' })
    })

    test('validation still blocks a submit triggered from outside the form', async () => {
      const onSubmit = vi.fn()
      render(
        <>
          <TestForm
            fields={{ name: { type: 'input', label: 'Name', isRequired: true } }}
            onSubmit={onSubmit}
            actions={{ isSubmitButtonHidden: true }}
            id="guarded-form"
          />
          <button type="submit" form="guarded-form">
            Save from outside
          </button>
        </>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Save from outside' }))
      expect(onSubmit).not.toHaveBeenCalled()
      expect(screen.getByText('This field is required')).toBeDefined()
    })
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

  describe('resetting after cancel and submit', () => {
    const nameField = { name: { type: 'input', label: 'Name', defaultValue: 'Ada' } } satisfies FormFields

    async function typeGrace() {
      const input = screen.getByLabelText('Name') as HTMLInputElement
      await userEvent.clear(input)
      await userEvent.type(input, 'Grace')
      return input
    }

    function readName() {
      return (screen.getByLabelText('Name') as HTMLInputElement).value
    }

    test('cancelling restores the initial values', async () => {
      renderForm({ fields: nameField, actions: { onCancel: () => {} } })
      await typeGrace()
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(readName()).toBe('Ada')
    })

    test('cancelling still calls onCancel', async () => {
      const onCancel = vi.fn()
      renderForm({ fields: nameField, actions: { onCancel } })
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onCancel).toHaveBeenCalled()
    })

    test('isResetOnCancel false keeps what was typed', async () => {
      renderForm({ fields: nameField, isResetOnCancel: false, actions: { onCancel: () => {} } })
      await typeGrace()
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(readName()).toBe('Grace')
    })

    test('a successful submit restores the initial values', async () => {
      const onSubmit = vi.fn()
      renderForm({ fields: nameField, onSubmit })
      await typeGrace()
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expectSubmittedWith(onSubmit, { name: 'Grace' })
      expect(readName()).toBe('Ada')
    })

    test('isResetOnSubmit false keeps the submitted values in place', async () => {
      renderForm({ fields: nameField, isResetOnSubmit: false })
      await typeGrace()
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(readName()).toBe('Grace')
    })

    test('a failed validation does not reset anything', async () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name', isRequired: true, defaultValue: 'Ada' } },
      })
      const input = screen.getByRole('textbox') as HTMLInputElement
      await userEvent.clear(input)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText('This field is required')).toBeDefined()
      expect(input.value).toBe('')
    })

    test('a rejected submit does not reset anything', async () => {
      const swallow = (event: PromiseRejectionEvent) => event.preventDefault()
      window.addEventListener('unhandledrejection', swallow)
      renderForm({
        fields: nameField,
        onSubmit: () => Promise.reject(new Error('boom')),
        onUnhandledSubmitError: () => {},
      })
      await typeGrace()
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(readName()).toBe('Grace'))
      window.removeEventListener('unhandledrejection', swallow)
    })
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

    test('a button preset on an action wins over the default color of the footer', () => {
      renderForm(
        {
          fields: { name: { type: 'input', label: 'Name' } },
          actions: { submitProps: { preset: 'cta' } },
        },
        { presets: { button: { cta: { props: { color: 'secondary' } } } } },
      )
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      expect(submitButton.classList.contains('bg-(--easyui-color-secondary)')).toBe(true)
      expect(submitButton.classList.contains('bg-(--easyui-color-primary)')).toBe(false)
    })

    test('the color of the form wins over a button preset on an action', () => {
      renderForm(
        {
          fields: { name: { type: 'input', label: 'Name' } },
          actions: { submitProps: { preset: 'cta' } },
          color: 'warning',
        },
        { presets: { button: { cta: { props: { color: 'secondary' } } } } },
      )
      expect(
        screen.getByRole('button', { name: 'Submit' }).classList.contains('bg-(--easyui-color-warning)'),
      ).toBe(true)
    })

    test('a field preset applies its props even when the form sets no variant nor color', () => {
      renderForm(
        {
          fields: {
            name: { type: 'input', label: 'Name', props: { preset: 'base', autoComplete: 'off' } },
          },
        },
        { presets: { input: { base: { props: { variant: 'faded', color: 'success' } } } } },
      )
      const input = screen.getByLabelText('Name')
      expect(input.getAttribute('autocomplete')).toBe('off')
      expect(input.parentElement?.classList.contains('bg-(--easyui-color-success)/30')).toBe(true)
    })
  })

  describe('fieldProps', () => {
    test('applies to every field of the matching type', () => {
      renderForm({
        fields: {
          first: { type: 'input', label: 'First' },
          second: { type: 'input', label: 'Second' },
        },
        fieldProps: { input: { autoComplete: 'off' } },
      })
      expect(screen.getByLabelText('First').getAttribute('autocomplete')).toBe('off')
      expect(screen.getByLabelText('Second').getAttribute('autocomplete')).toBe('off')
    })

    test('does not leak to fields of another type', () => {
      renderForm({
        fields: {
          name: { type: 'input', label: 'Name' },
          amount: { type: 'number', label: 'Amount' },
        },
        fieldProps: { input: { autoComplete: 'off' } },
      })
      expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('off')
      expect(screen.getByLabelText('Amount').getAttribute('autocomplete')).toBeNull()
    })

    test('the props of a field win over fieldProps', () => {
      renderForm({
        fields: { name: { type: 'input', label: 'Name', props: { autoComplete: 'email' } } },
        fieldProps: { input: { autoComplete: 'off' } },
      })
      expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('email')
    })

    test('merges classNames slot by slot instead of replacing them', () => {
      renderForm({
        fields: {
          name: { type: 'input', label: 'Name', props: { classNames: { input: 'own-input' } } },
        },
        fieldProps: { input: { classNames: { label: 'inherited-label' } } },
      })
      expect(screen.getByLabelText('Name').classList.contains('own-input')).toBe(true)
      expect(screen.getByText('Name').classList.contains('inherited-label')).toBe(true)
    })

    test('a preset on a field makes that field ignore fieldProps entirely', () => {
      renderForm(
        {
          fields: {
            plain: { type: 'input', label: 'Plain' },
            special: { type: 'input', label: 'Special', props: { preset: 'hero' } },
          },
          fieldProps: { input: { autoComplete: 'off' } },
        },
        { presets: { input: { hero: { props: { autoComplete: 'email' } } } } },
      )
      expect(screen.getByLabelText('Plain').getAttribute('autocomplete')).toBe('off')
      expect(screen.getByLabelText('Special').getAttribute('autocomplete')).toBe('email')
    })

    test('a form preset can carry fieldProps', () => {
      renderForm(
        {
          fields: { name: { type: 'input', label: 'Name' } },
          preset: 'compact',
        },
        { presets: { form: { compact: { props: { fieldProps: { input: { autoComplete: 'off' } } } } } } },
      )
      expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('off')
    })

    test('the fieldProps of the instance merge with the ones of the form preset', () => {
      renderForm(
        {
          fields: { name: { type: 'input', label: 'Name' } },
          preset: 'compact',
          fieldProps: { input: { classNames: { label: 'instance-label' } } },
        },
        { presets: { form: { compact: { props: { fieldProps: { input: { autoComplete: 'off' } } } } } } },
      )
      expect(screen.getByLabelText('Name').getAttribute('autocomplete')).toBe('off')
      expect(screen.getByText('Name').classList.contains('instance-label')).toBe(true)
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
