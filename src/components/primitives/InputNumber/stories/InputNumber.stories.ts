import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = {
  ...inputNumberMeta,
  title: 'Primitives/InputNumber',
} satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
