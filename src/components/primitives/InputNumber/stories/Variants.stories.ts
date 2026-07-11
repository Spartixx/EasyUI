import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/Variants' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultVariant: Story = { args: { variant: undefined } }
export const Bordered: Story = { args: { variant: 'bordered' } }
export const Faded: Story = { args: { variant: 'faded' } }
export const Flat: Story = { args: { variant: 'flat' } }
export const Underlined: Story = { args: { variant: 'underlined' } }
