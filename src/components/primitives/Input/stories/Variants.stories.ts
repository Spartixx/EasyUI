import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputMeta } from './meta.ts'

const meta = { ...inputMeta, title: 'Primitives/Input/Variants' } satisfies Meta<typeof inputMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultVariant: Story = { args: { variant: undefined } }
export const Bordered: Story = { args: { variant: 'bordered' } }
export const Faded: Story = { args: { variant: 'faded' } }
export const Flat: Story = { args: { variant: 'flat' } }
export const Underlined: Story = { args: { variant: 'underlined' } }
