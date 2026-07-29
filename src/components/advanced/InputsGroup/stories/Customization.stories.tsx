import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/Customization',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

export const SolidAddButtonAndBorderedInputs: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        description="Solid primary add button with white text, bordered inputs."
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
        validations={[(value) => (value.length >= 3 ? null : 'Too short (min 3 characters)')]}
        inputProps={{ variant: 'bordered' }}
        addButtonProps={{ variant: 'solid', color: 'primary' }}
        classNames={{ addButton: 'text-white' }}
      />
    </div>
  ),
}

export const StyledSlots: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <InputsGroup
        label="Tags"
        description="Card container, wider row spacing and a colored remove button."
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
        classNames={{
          base: 'p-4 rounded-(--easyui-radius-lg) bg-(--easyui-color-default)/20',
          items: 'gap-4',
          removeButton: 'text-(--easyui-color-error)',
        }}
      />
    </div>
  ),
}
