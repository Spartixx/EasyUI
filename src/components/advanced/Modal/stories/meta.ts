import type { Meta } from '@storybook/react-vite'
import { Modal } from '../index.ts'

export const modalMeta = {
  component: Modal,
  title: 'Advanced/Modal',
  args: {
    isOpen: true,
    onOpenChange: () => {},
    title: 'Delete this project?',
    description: 'This action cannot be undone.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['solid', 'outlined', 'flat', 'light'] },
    actions: { control: false },
    footer: { control: false },
    children: { control: false },
    onSubmit: { control: false },
    onOpenChange: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Modal>
