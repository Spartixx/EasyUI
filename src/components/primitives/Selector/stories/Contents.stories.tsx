import type { Meta, StoryObj } from '@storybook/react-vite'
import { Apple, Mail } from 'lucide-react'
import { selectorMeta } from './meta.ts'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Contents' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultContent: Story = {}
export const WithStartContent: Story = { args: { startContent: <Apple size={16} /> } }
export const WithEndContent: Story = { args: { endContent: <Mail size={16} /> } }
export const StartContentOutside: Story = {
  args: { startContent: <Apple size={16} />, startContentPlacement: 'outside' },
}
export const EndContentOutside: Story = {
  args: { endContent: <Mail size={16} />, endContentPlacement: 'outside' },
}
export const BothOutside: Story = {
  args: {
    startContent: <Apple size={16} />,
    startContentPlacement: 'outside',
    endContent: <Mail size={16} />,
    endContentPlacement: 'outside',
  },
}
