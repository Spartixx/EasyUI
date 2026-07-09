import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormColor, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Colors',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Name', defaultValue: 'Ada' },
  country: {
    type: 'selector',
    label: 'Country',
    defaultValue: 'fr',
    options: [{ value: 'fr', label: 'France' }],
  },
} satisfies FormFields

function ColorForm(props: { color: FormColor }) {
  const form = useForm(fields)
  return (
    <div style={{ width: 360 }}>
      <Form form={form} onSubmit={() => {}} variant="faded" color={props.color} />
    </div>
  )
}

export const Primary: Story = { render: () => <ColorForm color="primary" /> }
export const Secondary: Story = { render: () => <ColorForm color="secondary" /> }
export const Success: Story = { render: () => <ColorForm color="success" /> }
export const Warning: Story = { render: () => <ColorForm color="warning" /> }
export const Error: Story = { render: () => <ColorForm color="error" /> }
