import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = { ...buttonMeta, title: 'Primitives/Button/Variants' } satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultVariant: Story = { args: { variant: undefined } }
export const Solid: Story = { args: { variant: 'solid' } }
export const Outlined: Story = { args: { variant: 'outlined' } }
export const Flat: Story = { args: { variant: 'flat', color: 'warning' } }
export const Light: Story = { args: { variant: 'light' } }
