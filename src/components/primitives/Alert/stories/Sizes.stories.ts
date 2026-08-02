import type { Meta, StoryObj } from '@storybook/react-vite'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Sizes' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSize: Story = { args: { size: undefined } }
export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
