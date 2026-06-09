import type { Meta, StoryObj } from '@storybook/react-vite'
import { spinnerMeta } from './meta.ts'

const meta = { ...spinnerMeta, title: 'Primitives/Spinner/Sizes' } satisfies Meta<typeof spinnerMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }
