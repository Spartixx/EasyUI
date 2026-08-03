import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <p className="text-sm">Every task attached to this project will be removed as well.</p>,
  },
}
