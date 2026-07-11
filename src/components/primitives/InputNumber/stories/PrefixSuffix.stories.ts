import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputNumberMeta } from './meta.ts'

const meta = { ...inputNumberMeta, title: 'Primitives/InputNumber/PrefixSuffix' } satisfies Meta<typeof inputNumberMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const Prefix: Story = { args: { prefix: '€', defaultValue: 1250 } }
export const Suffix: Story = { args: { suffix: 'kg', defaultValue: 75 } }
export const PrefixAndSuffix: Story = { args: { prefix: '$', suffix: 'USD', defaultValue: 99 } }
export const PrefixSuffixSides: Story = {
  args: { prefix: '€', suffix: 'TTC', defaultValue: 49, stepperPlacement: 'sides' },
}
