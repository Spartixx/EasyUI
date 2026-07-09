import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Actions',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  title: { type: 'input', label: 'Title', isRequired: true },
} satisfies FormFields

function useDemoForm() {
  return useForm(fields)
}

export const SubmitOnly: Story = {
  render: function SubmitOnlyForm() {
    const form = useDemoForm()
    return (
      <div style={{ width: 340 }}>
        <Form form={form} onSubmit={() => {}} />
      </div>
    )
  },
}

export const WithCancel: Story = {
  render: function WithCancelForm() {
    const form = useDemoForm()
    return (
      <div style={{ width: 340 }}>
        <Form
          form={form}
          onSubmit={() => {}}
          actions={{ submitLabel: 'Save', cancelLabel: 'Discard', onCancel: () => form.reset() }}
        />
      </div>
    )
  },
}
