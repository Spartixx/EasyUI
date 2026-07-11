import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, Hash } from 'lucide-react'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/Contents' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultContent: Story = {}
export const WithStartContent: Story = { args: { startContent: <Hash size={16} /> } }
export const WithEndContent: Story = { args: { endContent: <CreditCard size={16} /> } }
export const StartContentOutside: Story = {
  args: { startContent: <Hash size={16} />, startContentPlacement: 'outside' },
}
export const EndContentOutside: Story = {
  args: { endContent: <CreditCard size={16} />, endContentPlacement: 'outside' },
}
