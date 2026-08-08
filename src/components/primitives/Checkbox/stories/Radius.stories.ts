import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/Radius' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const None: Story = { args: { radius: 'none', defaultSelected: true } }
export const Small: Story = { args: { radius: 'sm', defaultSelected: true } }
export const Medium: Story = { args: { radius: 'md', defaultSelected: true } }
export const Large: Story = { args: { radius: 'lg', defaultSelected: true } }
export const Full: Story = { args: { radius: 'full', defaultSelected: true } }
