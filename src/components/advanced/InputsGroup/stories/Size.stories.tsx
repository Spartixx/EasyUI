import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/Size',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const Small: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup size="sm" label="Tags" initialValues={[{ value: 'react' }, { value: 'vue' }]} />
    </div>
  ),
}

export const Medium: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup size="md" label="Tags" initialValues={[{ value: 'react' }, { value: 'vue' }]} />
    </div>
  ),
}

export const Large: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup size="lg" label="Tags" initialValues={[{ value: 'react' }, { value: 'vue' }]} />
    </div>
  ),
}
