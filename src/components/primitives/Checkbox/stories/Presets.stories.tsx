import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import type { EasyUIConfig } from '../../../../config/easyui.config.types'
import { checkboxMeta } from './meta.tsx'

const meta = {
  ...checkboxMeta,
  title: 'Primitives/Checkbox/Presets',
} satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj

const config: EasyUIConfig = {
  presets: {
    checkbox: {
      compact: {
        props: { size: 'sm', radius: 'none' },
        classNames: { label: 'text-(--easyui-color-default-foreground)/70' },
      },
      danger: {
        props: { color: 'error', radius: 'full' },
        className: 'font-medium',
      },
    },
  },
}

export const Compact: Story = {
  render: () => (
    <EasyUIProvider config={config}>
      <Checkbox preset="compact" label="Hide this column permanently" defaultSelected />
    </EasyUIProvider>
  ),
}

export const Danger: Story = {
  render: () => (
    <EasyUIProvider config={config}>
      <Checkbox preset="danger" label="I understand this cannot be undone" defaultSelected />
    </EasyUIProvider>
  ),
}

export const InstanceOverride: Story = {
  render: () => (
    <EasyUIProvider config={config}>
      <Checkbox preset="compact" size="lg" label="The instance size wins over the preset" defaultSelected />
    </EasyUIProvider>
  ),
}
