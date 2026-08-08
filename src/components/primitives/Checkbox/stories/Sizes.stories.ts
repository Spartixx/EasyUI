import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox/Sizes' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSize: Story = { args: { size: undefined, defaultSelected: true } }
export const Small: Story = { args: { size: 'sm', defaultSelected: true } }
export const Medium: Story = { args: { size: 'md', defaultSelected: true } }
export const Large: Story = { args: { size: 'lg', defaultSelected: true } }
