import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = {
  ...buttonMeta,
  title: 'Primitives/Button/Labels',
  args: { ...buttonMeta.args, label: 'Account' },
} satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultLabel: Story = { args: { label: undefined } }
export const Label: Story = {}
export const Description: Story = { args: { label: undefined, description: 'This action cannot be undone.' } }
export const LabelAndDescription: Story = { args: { description: 'This action cannot be undone.' } }
export const DescriptionBelowLabel: Story = {
  args: { description: 'This action cannot be undone.', descriptionPlacement: 'label' },
}
