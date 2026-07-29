import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/Required',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const ProtectedInitialLines: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Team owners"
        description="The first two owners are mandatory and cannot be removed."
        initialValues={[
          { value: 'owner@example.com', isRequired: true },
          { value: '', isRequired: true },
          { value: 'guest@example.com' },
        ]}
      />
    </div>
  ),
}

export const SharedValidation: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Usernames"
        description="Each value must be at least 3 characters long."
        initialValues={[{ value: 'ab' }, { value: 'valid-name' }]}
        validations={[(value) => (value.length >= 3 ? null : 'Too short (min 3 characters)')]}
      />
    </div>
  ),
}
