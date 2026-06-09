import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = {
  ...buttonMeta,
  title: 'Primitives/Button',
  args: { children: 'Button' },
} satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
