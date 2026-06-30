import type { Meta, StoryObj } from '@storybook/react-vite'
import { autocompleteMeta } from './meta.ts'

const meta = { ...autocompleteMeta, title: 'Primitives/Autocomplete/States' } satisfies Meta<typeof autocompleteMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultState: Story = {}
export const Loading: Story = { args: { isLoading: true } }
export const Disabled: Story = { args: { isDisabled: true } }
export const Required: Story = { args: { isRequired: true, label: 'Fruit' } }
export const WithError: Story = { args: { error: 'Please select a fruit.' } }
