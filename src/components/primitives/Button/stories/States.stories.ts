import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = { ...buttonMeta, title: 'Primitives/Button/States' } satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultState: Story = {}
export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }
