import type { Meta, StoryObj } from '@storybook/react-vite'
import { buttonMeta } from './meta.ts'

const meta = { ...buttonMeta, title: 'Primitives/Button/Sizes' } satisfies Meta<typeof buttonMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSize: Story = { args: { size: undefined } }
export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}
