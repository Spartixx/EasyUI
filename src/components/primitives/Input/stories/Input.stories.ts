import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputMeta } from './meta.ts'

const meta = {
  ...inputMeta,
  title: 'Primitives/Input',
} satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
