import type { Meta } from '@storybook/react-vite'
import { FormModal } from '../index.ts'

export const formModalMeta = {
  component: FormModal,
  title: 'Advanced/FormModal',
  argTypes: {
    form: { control: false },
    formProps: { control: false },
    actions: { control: false },
    footer: { control: false },
    onOpenChange: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof FormModal>
