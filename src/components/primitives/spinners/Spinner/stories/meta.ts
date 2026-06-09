import type { Meta } from '@storybook/react-vite'
import { Spinner } from '../index.ts'

export const spinnerMeta = {
  component: Spinner,
  title: 'Primitives/Spinner',
  args: { size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spinner>
