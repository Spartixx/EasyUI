import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Selector } from '../index.ts'
import { selectorMeta } from './meta.ts'

const meta = {
  ...selectorMeta,
  title: 'Primitives/Selector/Filter',
} satisfies Meta<typeof selectorMeta.component>

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
        <Selector {...args} key={variant} variant={variant} triggerText={variant} />
      ))}
    </div>
  ),
}

export const MultipleFilter: Story = {
  args: { selectionMode: 'multiple' },
  render: function MultipleFilterSelector({ options, size, color, radius, variant }) {
    const [values, setValues] = useState<string[]>(['apple', 'banana'])
    return (
      <Selector
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
    classNames: { activeTrigger: 'border-(--easyui-color-success) bg-(--easyui-color-success)/10' },
  },
}
