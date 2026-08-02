import type { Meta, StoryObj } from '@storybook/react-vite'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
