import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = { ...checkboxMeta, title: 'Primitives/Checkbox' } satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
