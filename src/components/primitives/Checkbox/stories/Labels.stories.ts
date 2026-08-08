import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/Labels' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const LabelOnly: Story = { args: { description: undefined } }

export const WithDescription: Story = {
  args: { description: 'You can change this later in your settings.' },
}

export const DescriptionUnderTheElement: Story = {
  args: {
    description: 'You can change this later in your settings.',
    descriptionPlacement: 'element',
  },
}

export const LongLabel: Story = {
  args: {
    label:
      'I agree to receive product updates, occasional surveys and the monthly newsletter at the address above.',
    description: 'Unsubscribing takes one click.',
  },
}

export const WithoutLabel: Story = {
  args: { label: undefined, description: undefined, 'aria-label': 'Select row' },
}
