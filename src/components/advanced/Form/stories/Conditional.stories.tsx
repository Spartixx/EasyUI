import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Conditional',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  hosting: {
    type: 'selector',
    label: 'Hosting',
    defaultValue: 'shared',
    options: [
      { value: 'shared', label: 'Shared' },
      { value: 'custom', label: 'Custom domain' },
    ],
  },
  domain: { type: 'input', label: 'Domain', isRequired: true, dependsOn: { hosting: 'custom' } },
  tld: {
    type: 'selector',
    label: 'TLD',
    dependsOn: { domain: null },
    options: [
      { value: 'com', label: '.com' },
      { value: 'io', label: '.io' },
    ],
  },
} satisfies FormFields

function ConditionalForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 340 }}>
      <Form form={form} onSubmit={() => {}} />
    </div>
  )
}

export const Default: Story = {
  render: () => <ConditionalForm />,
}

const isHiddenFields = {
  plan: {
    type: 'selector',
    label: 'Plan',
    defaultValue: 'pro',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
    ],
  },
  seats: { type: 'number', label: 'Seats', isHidden: (values) => values.plan === 'free' },
} satisfies FormFields

export const IsHidden: Story = {
  render: function IsHiddenForm() {
    const form = useForm(isHiddenFields)
    return (
      <div style={{ width: 340 }}>
        <Form form={form} onSubmit={() => {}} />
      </div>
    )
  },
}
