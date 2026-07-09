import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Header',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  firstName: { type: 'input', label: 'First name', isRequired: true },
  email: { type: 'input', kind: 'email', label: 'Email' },
} satisfies FormFields

function HeaderForm(props: { title?: string; description?: string }) {
  const form = useForm(fields)
  return (
    <div style={{ width: 360 }}>
      <Form form={form} onSubmit={() => {}} title={props.title} description={props.description} />
    </div>
  )
}

export const Default: Story = {
  render: () => <HeaderForm />,
}

export const TitleOnly: Story = {
  render: () => <HeaderForm title="Create your profile" />,
}

export const DescriptionOnly: Story = {
  render: () => <HeaderForm description="Fill in the fields below to get started." />,
}

export const TitleAndDescription: Story = {
  render: () => (
    <HeaderForm title="Create your profile" description="Fill in the fields below to get started." />
  ),
}
