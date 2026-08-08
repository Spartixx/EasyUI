import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/States' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = { args: { defaultSelected: false } }
export const Checked: Story = { args: { defaultSelected: true } }
export const Indeterminate: Story = { args: { label: 'Select all', isIndeterminate: true } }
export const Disabled: Story = { args: { isDisabled: true } }
export const DisabledChecked: Story = { args: { isDisabled: true, defaultSelected: true } }
export const ReadOnly: Story = { args: { isReadOnly: true, defaultSelected: true } }
export const Required: Story = { args: { isRequired: true } }
