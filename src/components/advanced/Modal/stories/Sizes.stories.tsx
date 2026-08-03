import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/Sizes',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const body = <p className="text-sm">Every task attached to this project will be removed as well.</p>

export const Small: Story = { args: { size: 'sm', children: body } }
export const Medium: Story = { args: { size: 'md', children: body } }
export const Large: Story = { args: { size: 'lg', children: body } }
