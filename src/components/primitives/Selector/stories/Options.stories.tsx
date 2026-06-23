import type { Meta, StoryObj } from '@storybook/react-vite'
import { Apple, Citrus, Grape } from 'lucide-react'
import { selectorMeta } from './meta.ts'
import type { SelectorOption } from '../index.ts'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Options' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const optionsWithDisabledOption: SelectorOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', isDisabled: true },
  { value: 'date', label: 'Date' },
]

const manyOptions: SelectorOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}))

const optionsWithDescription: SelectorOption[] = [
  { value: 'apple', label: 'Apple', description: 'Crisp and sweet' },
  { value: 'banana', label: 'Banana', description: 'Soft and creamy' },
  { value: 'cherry', label: 'Cherry', description: 'Small and tart' },
]

const optionsWithStartContent: SelectorOption[] = [
  { value: 'apple', label: 'Apple', startContent: <Apple size={16} /> },
  { value: 'citrus', label: 'Citrus', startContent: <Citrus size={16} /> },
  { value: 'grape', label: 'Grape', startContent: <Grape size={16} /> },
]

const optionsWithEndContent: SelectorOption[] = [
  { value: 'apple', label: 'Apple', endContent: <span className="text-xs opacity-60">12 in stock</span> },
  { value: 'banana', label: 'Banana', endContent: <span className="text-xs opacity-60">5 in stock</span> },
  { value: 'cherry', label: 'Cherry', endContent: <span className="text-xs opacity-60">0 in stock</span> },
]

const optionsWithEverything: SelectorOption[] = [
  {
    value: 'apple',
    label: 'Apple',
    description: 'Crisp and sweet',
    startContent: <Apple size={16} />,
    endContent: <span className="text-xs opacity-60">12 in stock</span>,
  },
  {
    value: 'citrus',
    label: 'Citrus',
    description: 'Tangy and juicy',
    startContent: <Citrus size={16} />,
    endContent: <span className="text-xs opacity-60">5 in stock</span>,
  },
  {
    value: 'grape',
    label: 'Grape',
    description: 'Sweet and juicy',
    startContent: <Grape size={16} />,
    endContent: <span className="text-xs opacity-60">0 in stock</span>,
  },
]

export const DisabledOption: Story = { args: { options: optionsWithDisabledOption } }
export const ManyOptions: Story = { args: { options: manyOptions } }
export const WithDescription: Story = { args: { options: optionsWithDescription } }
export const WithStartContent: Story = { args: { options: optionsWithStartContent } }
export const WithEndContent: Story = { args: { options: optionsWithEndContent } }
export const WithEverything: Story = { args: { options: optionsWithEverything } }
