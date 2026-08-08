import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import type { EasyUIConfig } from '../../../../config/easyui.config.types'
import { checkboxMeta } from './meta.tsx'

const meta = {
  ...checkboxMeta,
  title: 'Primitives/Checkbox/Wrappers',
} satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj

function WrappedCheckbox({ config }: { config: EasyUIConfig }) {
  return (
    <EasyUIProvider config={config}>
      <div className="flex flex-col gap-3">
        <Checkbox label="Accept the terms" defaultSelected />
        <Checkbox label="Subscribe to the newsletter" />
      </div>
    </EasyUIProvider>
  )
}

export const RoundedBox: Story = {
  render: () => <WrappedCheckbox config={{ wrappers: { checkbox: { wrapper: 'rounded-full' } } }} />,
}

export const BoldLabel: Story = {
  render: () => (
    <WrappedCheckbox config={{ wrappers: { checkbox: { label: 'font-semibold uppercase tracking-wide' } } }} />
  ),
}

export const SpacedRow: Story = {
  render: () => <WrappedCheckbox config={{ wrappers: { checkbox: { base: 'p-2 bg-(--easyui-color-default)/20 rounded-lg' } } }} />,
}
