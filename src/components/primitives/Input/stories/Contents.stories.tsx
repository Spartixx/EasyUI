import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mail, Search } from 'lucide-react'
import { inputMeta } from './meta.ts'

const meta = { ...inputMeta, title: 'Primitives/Input/Contents' } satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultContent: Story = {}
export const WithStartContent: Story = { args: { startContent: <Search size={16} /> } }
export const WithEndContent: Story = { args: { endContent: <Mail size={16} /> } }
export const StartContentOutside: Story = {
  args: { startContent: <Search size={16} />, startContentPlacement: 'outside' },
}
export const EndContentOutside: Story = {
  args: { endContent: <Mail size={16} />, endContentPlacement: 'outside' },
}
export const BothOutside: Story = {
  args: {
    startContent: <Search size={16} />,
    startContentPlacement: 'outside',
    endContent: <Mail size={16} />,
    endContentPlacement: 'outside',
  },
}
