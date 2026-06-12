import type { Meta } from '@storybook/react-vite'
import { Button } from '../index.ts'

export const buttonMeta = {
  component: Button,
  title: 'Primitives/Button',
  args: {
    children: 'Button',
    color: 'primary',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['solid', 'outlined', 'flat', 'light'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    startContent: { control: false },
    endContent: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Button>
