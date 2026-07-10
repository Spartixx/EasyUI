import type { Meta, StoryObj } from '@storybook/react-vite'
import { Percent } from 'lucide-react'
import { inputMeta } from './meta.ts'

const meta = { ...inputMeta, title: 'Primitives/Input/Number' } satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { type: 'number', defaultValue: 10, step: 5 } }
export const AtMin: Story = { args: { type: 'number', defaultValue: 0, min: 0, label: 'Reached min' } }
export const AtMax: Story = { args: { type: 'number', defaultValue: 10, max: 10, label: 'Reached max' } }
export const WithEndContent: Story = {
  args: { type: 'number', defaultValue: 3, min: 0, max: 100, endContent: <Percent size={16} /> },
}
export const WithoutStepper: Story = { args: { type: 'number', defaultValue: 3, showStepper: false } }
export const Disabled: Story = { args: { type: 'number', defaultValue: 3, isDisabled: true } }
