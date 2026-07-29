import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/AddButton',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup label="Tags" addButtonPlacement="full-width" initialValues={[{ value: 'react' }]} />
    </div>
  ),
}

export const Left: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup label="Tags" addButtonPlacement="left" initialValues={[{ value: 'react' }]} />
    </div>
  ),
}

export const Right: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup label="Tags" addButtonPlacement="right" initialValues={[{ value: 'react' }]} />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup label="Tags" addButtonLabel="Add a tag" initialValues={[{ value: 'react' }]} />
    </div>
  ),
}
