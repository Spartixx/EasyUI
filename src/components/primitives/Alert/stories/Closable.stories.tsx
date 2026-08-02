import type { Meta, StoryObj } from '@storybook/react-vite'
import { Trash2 } from 'lucide-react'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Closable' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const NotClosable: Story = { args: { isClosable: false } }
export const Closable: Story = { args: { isClosable: true } }
export const CustomCloseIcon: Story = {
  args: { isClosable: true, closeIcon: <Trash2 className="size-full" /> },
}
export const CustomCloseLabel: Story = {
  args: { isClosable: true, closeButtonLabel: 'Dismiss notification' },
}
