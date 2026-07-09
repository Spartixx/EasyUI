import type { Meta } from '@storybook/react-vite'
import { Form } from '../index.ts'

export const formMeta = {
  component: Form,
  title: 'Advanced/Form',
  argTypes: {
    form: { control: false },
    onSubmit: { control: false },
    actions: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Form>
