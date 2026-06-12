import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = { ...buttonMeta, title: 'Primitives/Button/Radius' } satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultRadius: Story = { args: { radius: undefined } }
export const RadiusNone: Story = { args: { radius: 'none' } }
export const RadiusSmall: Story = { args: { radius: 'sm' } }
export const RadiusMedium: Story = { args: { radius: 'md' } }
export const RadiusLarge: Story = { args: { radius: 'lg' } }
export const RadiusFull: Story = { args: { radius: 'full' } }
