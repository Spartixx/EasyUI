import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../index.ts'
import { inputMeta } from './meta.ts'

const meta = { ...inputMeta, title: 'Primitives/Input/States' } satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultState: Story = {}
export const Loading: Story = { args: { isLoading: true } }
export const Disabled: Story = { args: { isDisabled: true } }
export const ReadOnly: Story = { args: { isReadOnly: true, value: 'Read-only value' } }
export const Required: Story = { args: { isRequired: true, label: 'Email' } }
export const RequiredWithCustomMessage: Story = {
  args: { isRequired: true, isRequiredMessage: 'An email address is mandatory', label: 'Email' },
}
export const ActivePerVariant: Story = {
  args: { isActive: true, defaultValue: 'Filtered value' },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['bordered', 'faded', 'flat', 'underlined'] as const).map((variant) => (
        <Input {...args} key={variant} variant={variant} label={variant} />
      ))}
    </div>
  ),
}
export const WithError: Story = { args: { error: 'This field is required.' } }
export const WithValidation: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    validations: [(v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email address')],
  },
}
