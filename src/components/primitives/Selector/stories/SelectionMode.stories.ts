import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectorMeta } from './meta.ts'
import { optionsWithEndContent } from '../../../internal/listbox/listboxOptionFixtures.tsx'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Selection mode' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = { args: { selectionMode: 'single', defaultValue: 'apple' } }
export const Multiple: Story = { args: { selectionMode: 'multiple', label: 'Fruits' } }
export const MultipleWithSelection: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['apple', 'banana'], label: 'Fruits' },
}
export const MultipleWithEverySelection: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['apple', 'banana', 'cherry', 'date'], label: 'Fruits' },
}
export const MultipleDisabled: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['apple', 'banana'], isDisabled: true },
}
export const WithoutSelectionIndicator: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['apple'], selectionIndicator: 'none' },
}
export const SingleWithEndContent: Story = {
  args: { options: optionsWithEndContent, defaultValue: 'apple', label: 'Fruit' },
}
export const MultipleWithEndContent: Story = {
  args: {
    selectionMode: 'multiple',
    options: optionsWithEndContent,
    defaultValue: ['apple', 'banana'],
    label: 'Fruits',
  },
}
export const MultipleWithEndContentWithoutSelectionIndicator: Story = {
  args: {
    selectionMode: 'multiple',
    selectionIndicator: 'none',
    options: optionsWithEndContent,
    defaultValue: ['apple', 'banana'],
    label: 'Fruits',
  },
}
