import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues } from './submittedValues.tsx'

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
      <FormWithSubmittedValues form={form} />
    </div>
  )
}

export const Default: Story = {
  render: () => <NumberForm />,
}
