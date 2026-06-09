import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Plus } from 'lucide-react'
import { buttonMeta } from './meta.ts'

const meta = { ...buttonMeta, title: 'Primitives/Button/Contents' } satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultContent: Story = {}
export const WithStartContent: Story = { args: { startContent: <Plus size={16} /> } }
export const WithEndContent: Story = { args: { endContent: <ArrowRight size={16} /> } }
export const StartContentOutside: Story = {
  args: { startContent: <Plus size={16} />, startContentPlacement: 'outside' },
}
export const EndContentOutside: Story = {
  args: { endContent: <ArrowRight size={16} />, endContentPlacement: 'outside' },
}
