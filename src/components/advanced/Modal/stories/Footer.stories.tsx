import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/Footer',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SubmitOnly: Story = {
  args: { actions: { showCancel: false, submitLabel: 'Got it' } },
}

export const CancelOnly: Story = {
  args: { actions: { isSubmitButtonHidden: true, cancelLabel: 'Close' } },
}

export const CustomLabels: Story = {
  args: { actions: { submitLabel: 'Delete', cancelLabel: 'Keep it' }, color: 'error' },
}

export const ColumnFullWidth: Story = {
  args: {
    actions: { submitLabel: 'Delete', cancelLabel: 'Keep it' },
    color: 'error',
    classNames: {
      footer: 'flex-col-reverse items-stretch',
      submitButton: 'w-full',
      cancelButton: 'w-full',
    },
  },
}

export const SpaceBetween: Story = {
  args: {
    actions: { submitLabel: 'Delete', cancelLabel: 'Keep it' },
    classNames: { footer: 'justify-between' },
  },
}

export const CustomFooter: Story = {
  args: {
    footer: <p className="text-xs text-(--easyui-color-foreground)/60">Contact support to undo this later.</p>,
  },
}
