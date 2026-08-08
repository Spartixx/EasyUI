import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, Minus, X } from 'lucide-react'
import { Checkbox } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/Icons' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj

export const DefaultIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Checked" defaultSelected />
      <Checkbox label="Indeterminate" isIndeterminate />
    </div>
  ),
}

export const CustomIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Checked" defaultSelected icon={<X className="size-full" strokeWidth={3} />} />
      <Checkbox
        label="Indeterminate"
        isIndeterminate
        indeterminateIcon={<Check className="size-full" strokeWidth={3} />}
      />
    </div>
  ),
}

export const IconsFromTheGlobalConfig: Story = {
  render: () => (
    <EasyUIProvider
      config={{
        defaults: {
          checkbox: {
            icon: <Check className="size-full" strokeWidth={4} />,
            indeterminateIcon: <Minus className="size-full" strokeWidth={4} />,
          },
        },
      }}
    >
      <div className="flex flex-col gap-3">
        <Checkbox label="Checked" defaultSelected />
        <Checkbox label="Indeterminate" isIndeterminate />
      </div>
    </EasyUIProvider>
  ),
}
