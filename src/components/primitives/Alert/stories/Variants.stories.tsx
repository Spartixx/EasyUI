import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from '../index.ts'
import { alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Variants' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const VARIANTS = [
  { variant: 'solid', label: 'Solid' },
  { variant: 'flat', label: 'Flat' },
  { variant: 'outlined', label: 'Outlined' },
  { variant: 'faded', label: 'Faded' },
] as const

const renderEveryVariant =
  (hasDescription: boolean, isClosable: boolean = false): Story['render'] =>
  (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {VARIANTS.map((entry) => (
        <Alert
          key={entry.variant}
          {...args}
          variant={entry.variant}
          title={entry.label}
          isClosable={isClosable}
          description={hasDescription ? `${entry.label} variant with a description.` : undefined}
        />
      ))}
    </div>
  )

export const DefaultVariant: Story = { args: { variant: undefined } }
export const Solid: Story = { args: { variant: 'solid' } }
export const Outlined: Story = { args: { variant: 'outlined' } }
export const Flat: Story = { args: { variant: 'flat' } }
export const Faded: Story = { args: { variant: 'faded' } }

export const AllWithoutDescription: Story = { render: renderEveryVariant(false) }
export const AllWithDescription: Story = { render: renderEveryVariant(true) }
export const AllClosable: Story = { render: renderEveryVariant(false, true) }
