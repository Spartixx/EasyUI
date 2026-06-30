import type { Meta, StoryObj } from '@storybook/react-vite'
import { autocompleteMeta } from './meta.ts'

const meta = {
  ...autocompleteMeta,
  title: 'Primitives/Autocomplete/Labels',
  args: { ...autocompleteMeta.args, label: 'Fruit' },
} satisfies Meta<typeof autocompleteMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultLabel: Story = { args: { label: undefined } }
export const WithLabel: Story = {}
export const WithDescription: Story = {
  args: { label: undefined, description: 'Pick your favorite fruit.' },
}
export const WithLabelAndDescription: Story = { args: { description: 'Pick your favorite fruit.' } }
export const DescriptionBelowLabel: Story = {
  args: { description: 'Pick your favorite fruit.', descriptionPlacement: 'label' },
}
export const WithError: Story = { args: { error: 'Please select a fruit.' } }
export const WithLabelAndError: Story = { args: { error: 'Please select a fruit.' } }
