import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/NumberField',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  product: { type: 'input', label: 'Product' },
  quantity: { type: 'number', label: 'Quantity', defaultValue: 1, isRequired: true },
  price: { type: 'number', label: 'Price' },
} satisfies FormFields

function NumberForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 340 }}>
      <Form form={form} onSubmit={() => {}} />
    </div>
  )
}

export const Default: Story = {
  render: () => <NumberForm />,
}
