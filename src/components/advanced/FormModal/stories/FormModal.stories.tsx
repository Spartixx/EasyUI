import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormModal } from '../index.ts'
import { useForm, type FormFields } from '../../Form'
import { formModalMeta } from './meta.ts'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Full name', isRequired: true },
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true },
  country: {
    type: 'selector',
    label: 'Country',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  },
} satisfies FormFields

export const Default: Story = {
  render: function DefaultFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="Fill in the details to create the account."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const WithCustomLabels: Story = {
  render: function CustomLabelsFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        color="default"
        actions={{ submitLabel: 'Create', cancelLabel: 'Discard' }}
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}
