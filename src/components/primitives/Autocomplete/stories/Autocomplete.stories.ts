import type { Meta, StoryObj } from '@storybook/react-vite'
import { autocompleteMeta } from './meta.ts'

const meta = {
  ...autocompleteMeta,
  title: 'Primitives/Autocomplete',
} satisfies Meta<typeof autocompleteMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
