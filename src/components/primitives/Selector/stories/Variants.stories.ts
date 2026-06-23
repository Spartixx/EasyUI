import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectorMeta } from './meta.ts'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Variants' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultVariant: Story = { args: { variant: undefined } }
export const Bordered: Story = { args: { variant: 'bordered' } }
export const Faded: Story = { args: { variant: 'faded' } }
export const Flat: Story = { args: { variant: 'flat' } }
export const Underlined: Story = { args: { variant: 'underlined' } }
