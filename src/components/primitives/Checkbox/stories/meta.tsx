import type { Meta } from '@storybook/react-vite'
import { Checkbox } from '../index.ts'

export const CHECKBOX_STORY_WIDTH = '360px'

export const checkboxMeta = {
  component: Checkbox,
  title: 'Primitives/Checkbox',
  decorators: [
    (Story) => (
      <div style={{ width: CHECKBOX_STORY_WIDTH }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Accept the terms',
    color: 'primary',
    size: 'md',
    radius: 'sm',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    descriptionPlacement: { control: 'select', options: ['label', 'element'] },
    icon: { control: false },
    indeterminateIcon: { control: false },
    validations: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Checkbox>
