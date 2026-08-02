import type { Meta, StoryObj } from '@storybook/react-vite'
import { Rocket } from 'lucide-react'
import { Alert } from '../index.ts'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Icon' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const SHAPES = [
  { color: 'default', title: 'Default', description: 'Filled circle with a cut-out letter.' },
  { color: 'primary', title: 'Primary', description: 'Filled circle with a cut-out letter.' },
  { color: 'secondary', title: 'Secondary', description: 'Filled circle with a cut-out letter.' },
  { color: 'success', title: 'Success', description: 'Filled circle with a cut-out check.' },
  { color: 'warning', title: 'Warning', description: 'Filled shield with a cut-out exclamation.' },
  { color: 'error', title: 'Error', description: 'Filled hexagon with a cut-out exclamation.' },
] as const

const renderEveryShape: Story['render'] = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {SHAPES.map((shape) => (
      <Alert
        key={shape.color}
        {...args}
        color={shape.color}
        title={shape.title}
        description={shape.description}
      />
    ))}
  </div>
)

export const DefaultIcon: Story = {}

export const AllShapes: Story = { render: renderEveryShape }

export const CustomIcon: Story = { args: { icon: <Rocket className="size-full" /> } }
export const Hidden: Story = { args: { isIconHidden: true } }
export const WrapperHidden: Story = { args: { isIconWrapperHidden: true } }

export const WrapperHiddenAllShapes: Story = {
  args: { isIconWrapperHidden: true },
  render: renderEveryShape,
}
