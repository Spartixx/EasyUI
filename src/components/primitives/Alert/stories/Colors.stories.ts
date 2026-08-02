import type { Meta, StoryObj } from '@storybook/react-vite'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Colors' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultColor: Story = { args: { color: undefined } }
export const Primary: Story = { args: { color: 'primary' } }
export const Secondary: Story = { args: { color: 'secondary' } }
export const Success: Story = { args: { color: 'success' } }
export const Warning: Story = { args: { color: 'warning' } }
export const Error: Story = { args: { color: 'error' } }
