import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Autocomplete } from '../index.ts'
import { autocompleteMeta } from './meta.ts'

const meta = {
  ...autocompleteMeta,
  title: 'Primitives/Autocomplete/Filter',
} satisfies Meta<typeof autocompleteMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const FixedTriggerText: Story = {
  args: { triggerText: 'Fruit', defaultValue: 'apple' },
}

export const Active: Story = {
  args: { triggerText: 'Fruit', defaultValue: 'apple', isActive: true },
}

export const ActivePerVariant: Story = {
  args: { isActive: true },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['bordered', 'faded', 'flat', 'underlined'] as const).map((variant) => (
        <Autocomplete {...args} key={variant} variant={variant} triggerText={variant} />
      ))}
    </div>
  ),
}

export const MultipleFilter: Story = {
  args: { selectionMode: 'multiple' },
  render: function MultipleFilterAutocomplete({ options, size, color, radius, variant }) {
    const [values, setValues] = useState<string[]>(['apple', 'banana'])
    return (
      <Autocomplete
        options={options}
        size={size}
        color={color}
        radius={radius}
        variant={variant}
        selectionMode="multiple"
        triggerText={values.length > 0 ? `Fruit (${values.length})` : 'Fruit'}
        value={values}
        onValueChange={setValues}
        isActive={values.length > 0}
      />
    )
  },
}

export const CustomActiveStyle: Story = {
  args: {
    triggerText: 'Fruit',
    isActive: true,
    classNames: { activeInputWrapper: 'border-(--easyui-color-success) bg-(--easyui-color-success)/10' },
  },
}
