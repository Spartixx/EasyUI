import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { Button } from '../../../primitives'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/RemoveButton',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const PlacementRight: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        removeButtonPlacement="right"
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
      />
    </div>
  ),
}

export const PlacementLeft: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        removeButtonPlacement="left"
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
      />
    </div>
  ),
}

export const CustomRemoveButton: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
        renderRemoveButton={({ onRemove, isDisabled }) => (
          <Button type="button" variant="light" color="error" isDisabled={isDisabled} onClick={onRemove}>
            Remove
          </Button>
        )}
      />
    </div>
  ),
}
