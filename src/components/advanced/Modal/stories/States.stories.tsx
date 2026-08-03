import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/States',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = { args: { isLoading: true, actions: { loadingLabel: 'Loading…' } } }
export const Disabled: Story = { args: { isDisabled: true } }
export const WithError: Story = { args: { error: 'The server is unreachable.' } }
export const WithoutCloseIcon: Story = { args: { isCloseIconHidden: true } }
export const HeaderOnly: Story = { args: { description: undefined } }
