import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/Colors',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { color: 'primary' } }
export const Secondary: Story = { args: { color: 'secondary' } }
export const Success: Story = { args: { color: 'success' } }
export const Warning: Story = { args: { color: 'warning' } }
export const Error: Story = { args: { color: 'error' } }
