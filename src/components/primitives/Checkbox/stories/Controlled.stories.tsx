import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from '../index.ts'
import { checkboxMeta } from './meta.tsx'

const meta = {
  ...checkboxMeta,
  title: 'Primitives/Checkbox/Controlled',
} satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj

export const Uncontrolled: Story = {
  render: () => <Checkbox label="Accept the terms" defaultSelected />,
}

export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [isSelected, setIsSelected] = useState(false)
    return (
      <div className="flex flex-col gap-3">
        <Checkbox label="Accept the terms" isSelected={isSelected} onValueChange={setIsSelected} />
        <span className="text-sm text-(--easyui-color-default-foreground)/60">
          Current value: {String(isSelected)}
        </span>
      </div>
    )
  },
}

export const SelectAll: Story = {
  render: function SelectAllCheckboxes() {
    const [selected, setSelected] = useState<string[]>(['react'])
    const options = ['react', 'vue', 'svelte']
    const isAllSelected = selected.length === options.length

    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          label="Select all"
          isSelected={isAllSelected}
          isIndeterminate={selected.length > 0 && !isAllSelected}
          onValueChange={(next) => setSelected(next ? options : [])}
        />
        <div className="flex flex-col gap-2 pl-6">
          {options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              isSelected={selected.includes(option)}
              onValueChange={(next) =>
                setSelected((previous) =>
                  next ? [...previous, option] : previous.filter((entry) => entry !== option),
                )
              }
            />
          ))}
        </div>
      </div>
    )
  },
}
