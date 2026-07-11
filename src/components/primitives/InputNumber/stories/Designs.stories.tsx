import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/Designs' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const End: Story = { args: { stepperPlacement: 'end', label: 'Stepper at the end' } }
export const Sides: Story = { args: { stepperPlacement: 'sides', label: 'Minus and plus on the sides' } }
export const SidesWithBounds: Story = {
  args: { stepperPlacement: 'sides', defaultValue: 1, min: 0, max: 5, step: 1, label: 'Between 0 and 5' },
}
export const SidesBordered: Story = { args: { stepperPlacement: 'sides', variant: 'bordered' } }
export const SidesSmall: Story = { args: { stepperPlacement: 'sides', size: 'sm' } }
export const SidesLarge: Story = { args: { stepperPlacement: 'sides', size: 'lg' } }
