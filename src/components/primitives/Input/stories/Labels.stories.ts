import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputMeta } from './meta.ts'

const meta = {
  ...inputMeta,
  title: 'Primitives/Input/Labels',
  args: { ...inputMeta.args, label: 'Email' },
} satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultLabel: Story = { args: { label: undefined } }
export const WithLabel: Story = {}
export const WithDescription: Story = {
  args: { label: undefined, description: 'We will never share your email.' },
}
export const WithLabelAndDescription: Story = { args: { description: 'We will never share your email.' } }
export const DescriptionBelowLabel: Story = {
  args: { description: 'We will never share your email.', descriptionPlacement: 'label' },
}
export const WithError: Story = { args: { error: 'Invalid email address.' } }
export const WithLabelAndError: Story = { args: { error: 'Invalid email address.' } }
export const LabelInside: Story = { args: { labelPlacement: 'inside' } }
export const LabelInsideRequired: Story = { args: { labelPlacement: 'inside', isRequired: true } }
export const LabelInsideWithError: Story = {
  args: { labelPlacement: 'inside', error: 'Invalid email address.' },
}
