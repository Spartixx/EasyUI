import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/CheckboxField',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true },
  hasAcceptedTerms: {
    type: 'checkbox',
    label: 'Accept the terms',
    description: 'Required to create the account.',
    isRequired: true,
  },
  isSubscribed: { type: 'checkbox', label: 'Subscribe to the newsletter', defaultValue: true },
} satisfies FormFields

function CheckboxForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 340 }}>
      <FormWithSubmittedValues form={form} />
    </div>
  )
}

export const Default: Story = {
  render: () => <CheckboxForm />,
}

const conditionalFields = {
  hasBillingAddress: { type: 'checkbox', label: 'Use a different billing address' },
  billingStreet: {
    type: 'input',
    label: 'Billing street',
    isRequired: true,
    isHidden: (values) => values.hasBillingAddress !== true,
  },
} satisfies FormFields

function ConditionalCheckboxForm() {
  const form = useForm(conditionalFields)
  return (
    <div style={{ width: 340 }}>
      <FormWithSubmittedValues form={form} />
    </div>
  )
}

export const RevealsAnotherField: Story = {
  render: () => <ConditionalCheckboxForm />,
}
