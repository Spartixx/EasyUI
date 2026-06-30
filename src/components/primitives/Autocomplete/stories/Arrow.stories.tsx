import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDown } from 'lucide-react'
import { autocompleteMeta } from './meta.ts'

const meta = { ...autocompleteMeta, title: 'Primitives/Autocomplete/Arrow' } satisfies Meta<typeof autocompleteMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultArrow: Story = {}
export const Hidden: Story = { args: { isArrowHidden: true } }
export const StartPlacement: Story = { args: { arrowPlacement: 'start' } }
export const CustomIcon: Story = { args: { arrow: <ChevronsUpDown size={16} /> } }
