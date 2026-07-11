import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/Radius' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultRadius: Story = { args: { radius: undefined } }
export const None: Story = { args: { radius: 'none' } }
export const Small: Story = { args: { radius: 'sm' } }
export const Medium: Story = { args: { radius: 'md' } }
export const Large: Story = { args: { radius: 'lg' } }
export const Full: Story = { args: { radius: 'full' } }
