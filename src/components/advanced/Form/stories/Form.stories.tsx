import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  firstName: { type: 'input', label: 'First name', isRequired: true },
  email: { type: 'input', kind: 'email', label: 'Email', description: 'We never share it.' },
  country: {
    type: 'selector',
    label: 'Country',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'es', label: 'Spain' },
    ],
  },
} satisfies FormFields

function BasicForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 360 }}>
      <Form
        form={form}
        title="Create your profile"
        description="Fill in the fields below to get started."
        onSubmit={() => {}}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <BasicForm />,
}

const completeFields = {
  name: { type: 'input', label: 'Full name', isRequired: true, defaultValue: 'John Doe' },
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true },
  age: { type: 'number', label: 'Age' },
  country: {
    type: 'selector',
    label: 'Country',
    defaultValue: 'fr',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  },
  city: { type: 'autocomplete', label: 'City', options: [{ value: 'paris', label: 'Paris' }] },
  accepted: {
    type: 'custom',
    defaultValue: '',
    isRequired: true,
    validators: [(value: string) => (value === 'yes' ? null : 'Please accept the terms')],
    render: (ctx) => (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={ctx.value === 'yes'}
          disabled={ctx.isDisabled}
          onChange={(event) => ctx.setValue(event.target.checked ? 'yes' : '')}
        />
        I accept the terms
        {ctx.error && <span className="text-(--easyui-color-error)">{ctx.error}</span>}
      </label>
    ),
  },
} satisfies FormFields

export const Complete: Story = {
  render: function CompleteForm() {
    const form = useForm(completeFields)
    return (
      <div style={{ width: 380 }}>
        <Form
          form={form}
          title="Registration"
          description="Every built-in field type with a custom checkbox field in one form."
          onSubmit={() => {form.reset()}}
          actions={{ submitLabel: 'Register', onCancel: () => form.reset() }}
        />
      </div>
    )
  },
}
