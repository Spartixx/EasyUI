import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields, type FormVariant } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Variants',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const options = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
]

const fields = {
  name: { type: 'input', label: 'Name' },
  country: { type: 'selector', label: 'Country', options },
  city: { type: 'autocomplete', label: 'City', options: [{ value: 'paris', label: 'Paris' }] },
} satisfies FormFields

function VariantForm(props: { variant: FormVariant }) {
  const form = useForm(fields)
  return (
    <div style={{ width: 360 }}>
      <Form form={form} onSubmit={() => {}} variant={props.variant} />
    </div>
  )
}

export const Flat: Story = { render: () => <VariantForm variant="flat" /> }
export const Bordered: Story = { render: () => <VariantForm variant="bordered" /> }
export const Faded: Story = { render: () => <VariantForm variant="faded" /> }
export const Underlined: Story = { render: () => <VariantForm variant="underlined" /> }

const overrideFields = {
  name: { type: 'input', label: 'Name' },
  country: { type: 'selector', label: 'Country', options, props: { variant: 'bordered' } },
} satisfies FormFields

export const PerFieldOverride: Story = {
  render: function PerFieldOverrideForm() {
    const form = useForm(overrideFields)
    return (
      <div style={{ width: 360 }}>
        <Form form={form} onSubmit={() => {}} variant="flat" />
      </div>
    )
  },
}
