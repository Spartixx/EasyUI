import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        description="Add as many tags as you need."
        initialValues={[{ value: 'react' }, { value: 'typescript' }]}
      />
    </div>
  ),
}

export const MaxItems: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Phone numbers"
        description="Up to 3 phone numbers (the add button is disabled once reached)."
        maxItems={3}
        initialValues={[{ value: '+33 6 00 00 00 00' }]}
      />
    </div>
  ),
}
