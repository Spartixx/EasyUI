import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/Types',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const Text: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        type="text"
        label="Email addresses"
        initialValues={[{ value: 'ada@example.com' }, { value: '' }]}
        inputProps={{ placeholder: 'name@example.com' }}
      />
    </div>
  ),
}

export const Number: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        type="number"
        label="Amounts"
        description="Only numeric values are allowed."
        initialValues={[{ value: 10 }, { value: 25 }, { value: null }]}
        inputProps={{ prefix: '$', min: 0 }}
      />
    </div>
  ),
}
