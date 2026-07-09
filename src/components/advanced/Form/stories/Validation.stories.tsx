import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields, type ValidateMode } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Validation',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const isEmail = (value: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? null : 'Invalid email')

const fields = {
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true, validators: [isEmail] },
  password: {
    type: 'input',
    kind: 'password',
    label: 'Password',
    isRequired: true,
    validators: [(value: string) => (value.length >= 8 ? null : 'At least 8 characters')],
  },
  confirm: {
    type: 'input',
    kind: 'password',
    label: 'Confirm password',
    isRequired: true,
    validators: [(value: string, values) => (value === values.password ? null : 'Passwords do not match')],
  },
} satisfies FormFields

function ValidationForm(props: { validateOn?: ValidateMode }) {
  const form = useForm(fields, { validateOn: props.validateOn })
  return (
    <div style={{ width: 340 }}>
      <Form form={form} onSubmit={() => {}} actions={{ submitLabel: 'Create account' }} />
    </div>
  )
}

export const Default: Story = {
  render: () => <ValidationForm />,
}

export const OnBlur: Story = {
  render: () => <ValidationForm validateOn="blur" />,
}

export const OnChange: Story = {
  render: () => <ValidationForm validateOn="change" />,
}
