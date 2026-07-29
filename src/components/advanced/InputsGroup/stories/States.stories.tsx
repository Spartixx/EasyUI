import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/States',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup label="Tags" isDisabled initialValues={[{ value: 'react' }, { value: 'vue' }]} />
    </div>
  ),
}
