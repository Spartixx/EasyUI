import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../../Form'
import { formModalMeta } from './meta.ts'
import { FormModalWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/Validation',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const requiredFields = {
  name: { type: 'input', label: 'Full name', isRequired: true },
  country: {
    type: 'selector',
    label: 'Country',
    isRequired: true,
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  },
} satisfies FormFields

const passwordFields = {
  email: {
    type: 'input',
    kind: 'email',
    label: 'Email',
    isRequired: true,
    validators: [(value: string) => (value.includes('@') ? null : 'Enter a valid email address')],
  },
  password: {
    type: 'input',
    kind: 'password',
    label: 'Password',
    isRequired: true,
    validators: [(value: string) => (value.length >= 8 ? null : 'At least 8 characters')],
  },
  confirmPassword: {
    type: 'input',
    kind: 'password',
    label: 'Confirm password',
    isRequired: true,
    validators: [(value: string, values) => (value === values.password ? null : 'Both passwords must match')],
  },
} satisfies FormFields

const conditionalFields = {
  accountType: {
    type: 'selector',
    label: 'Account type',
    defaultValue: 'personal',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'company', label: 'Company' },
    ],
  },
  companyName: {
    type: 'input',
    label: 'Company name',
    isRequired: true,
    dependsOn: { accountType: 'company' },
  },
} satisfies FormFields

export const RequiredOnSubmit: Story = {
  render: function RequiredFormModal() {
    const form = useForm(requiredFields)
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="New user"
        description="Both fields are required. Submitting empty keeps the modal open and shows the errors."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const ValidateOnBlur: Story = {
  render: function BlurFormModal() {
    const form = useForm(passwordFields, { validateOn: 'blur' })
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="Create an account"
        description="Each field is validated when it loses the focus."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const ValidateOnChange: Story = {
  render: function ChangeFormModal() {
    const form = useForm(passwordFields, { validateOn: 'change' })
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="Create an account"
        description="Each field is validated from the first keystroke, cross-field rules included."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const CrossFieldValidation: Story = {
  render: function CrossFieldFormModal() {
    const form = useForm(passwordFields)
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="Create an account"
        description="Confirm password compares itself to password through the second validator argument."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const ConditionalField: Story = {
  render: function ConditionalFormModal() {
    const form = useForm(conditionalFields)
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="New account"
        description="Company name only appears — and is only required — when the account type is Company."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}
