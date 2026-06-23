import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDown } from 'lucide-react'
import { selectorMeta } from './meta.ts'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Arrow' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultArrow: Story = {}
export const Hidden: Story = { args: { isArrowHidden: true } }
export const StartPlacement: Story = { args: { arrowPlacement: 'start' } }
export const CustomIcon: Story = { args: { arrow: <ChevronsUpDown size={16} /> } }
