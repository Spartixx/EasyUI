import type { Meta } from '@storybook/react-vite'
import { Selector } from '../index.ts'
import type { SelectorOption } from '../index.ts'

export const fruitOptions: SelectorOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
]

export const selectorMeta = {
  component: Selector,
  title: 'Primitives/Selector',
  args: {
    options: fruitOptions,
    placeholder: 'Select a fruit...',
    color: 'primary',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['bordered', 'faded', 'flat', 'underlined'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    arrowPlacement: { control: 'select', options: ['start', 'end'] },
    options: { control: false },
    startContent: { control: false },
    endContent: { control: false },
    arrow: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Selector>
