import type { Meta } from '@storybook/react-vite'
import { InputNumber } from '../index.ts'

export const inputNumberMeta = {
  component: InputNumber,
  title: 'Primitives/InputNumber',
  args: {
    placeholder: '0',
    color: 'default',
    size: 'md',
    radius: 'md',
    defaultValue: 1,
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['bordered', 'faded', 'flat', 'underlined'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    stepperPlacement: { control: 'select', options: ['end', 'sides'] },
    startContent: { control: false },
    endContent: { control: false },
    classNames: { control: false },
    ref: { control: false },
    validations: { control: false },
  },
} satisfies Meta<typeof InputNumber>
