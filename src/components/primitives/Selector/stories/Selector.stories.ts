import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectorMeta } from './meta.ts'

const meta = {
  ...selectorMeta,
  title: 'Primitives/Selector',
} satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
