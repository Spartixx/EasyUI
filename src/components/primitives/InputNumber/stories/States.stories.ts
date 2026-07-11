import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/States' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultState: Story = {}
export const Loading: Story = { args: { isLoading: true } }
export const Disabled: Story = { args: { isDisabled: true } }
export const ReadOnly: Story = { args: { isReadOnly: true, defaultValue: 1200 } }
export const Required: Story = { args: { isRequired: true, label: 'Quantity' } }
export const WithError: Story = { args: { error: 'This field is required.' } }
export const WithBounds: Story = { args: { defaultValue: 5, min: 0, max: 10, label: 'Between 0 and 10' } }
export const WithValidation: Story = {
  args: {
    label: 'Age',
    defaultValue: null,
    validations: [(value: number | null) => (value !== null && value >= 18 ? null : 'Must be at least 18')],
  },
}
