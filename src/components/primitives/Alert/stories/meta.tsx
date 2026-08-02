import type { Meta } from '@storybook/react-vite'
import { Alert } from '../index.ts'

export const ALERT_STORY_WIDTH = '550px'

export const ALERT_COLORS = ['default', 'primary', 'secondary', 'success', 'warning', 'error'] as const

export const alertMeta = {
  component: Alert,
  title: 'Primitives/Alert',
  decorators: [
    (Story) => (
      <div style={{ width: ALERT_STORY_WIDTH }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Update available',
    description: 'A new version of the application is ready to install.',
    color: 'primary',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['solid', 'outlined', 'flat', 'faded'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    icon: { control: false },
    closeIcon: { control: false },
    endContent: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Alert>
