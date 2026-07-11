import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = {
  ...inputNumberMeta,
  title: 'Primitives/InputNumber/Labels',
  args: { ...inputNumberMeta.args, label: 'Quantity' },
} satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultLabel: Story = { args: { label: undefined } }
export const WithLabel: Story = {}
export const WithDescription: Story = {
  args: { label: undefined, description: 'How many items to order.' },
}
export const WithLabelAndDescription: Story = { args: { description: 'How many items to order.' } }
export const DescriptionBelowLabel: Story = {
  args: { description: 'How many items to order.', descriptionPlacement: 'label' },
}
export const WithLabelAndError: Story = { args: { error: 'Quantity is too high.' } }
export const LabelInside: Story = { args: { labelPlacement: 'inside' } }
export const LabelInsideRequired: Story = { args: { labelPlacement: 'inside', isRequired: true } }
export const LabelInsideWithError: Story = {
  args: { labelPlacement: 'inside', error: 'Quantity is too high.' },
}
