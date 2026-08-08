import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/Colors' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultColor: Story = { args: { color: 'default', defaultSelected: true } }
export const Primary: Story = { args: { color: 'primary', defaultSelected: true } }
export const Secondary: Story = { args: { color: 'secondary', defaultSelected: true } }
export const Success: Story = { args: { color: 'success', defaultSelected: true } }
export const Warning: Story = { args: { color: 'warning', defaultSelected: true } }
export const Error: Story = { args: { color: 'error', defaultSelected: true } }
