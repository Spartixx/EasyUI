import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormModal } from '../index.ts'
import { useForm, type FormFields } from '../../Form'
import { EasyUIProvider } from '../../../../providers'
import type { EasyUIConfig } from '../../../../config/easyui.config.types'
import { formModalMeta } from './meta.ts'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/Presets',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const deleteFields = {
  confirmation: { type: 'input', label: 'Type the user name to confirm', isRequired: true },
} satisfies FormFields

const createFields = {
  name: { type: 'input', label: 'Full name', isRequired: true },
  role: {
    type: 'selector',
    label: 'Role',
    options: [
      { value: 'member', label: 'Member' },
      { value: 'admin', label: 'Admin' },
    ],
  },
  headline: { type: 'input', label: 'Headline', props: { preset: 'hero' } },
} satisfies FormFields

const config: EasyUIConfig = {
  presets: {
    button: {
      danger: {
        props: { variant: 'solid', color: 'error' },
        classNames: { base: 'font-semibold' },
      },
      action: {
        props: { variant: 'solid', color: 'primary' },
        classNames: { base: 'font-semibold' },
      },
      ghost: { props: { variant: 'light', color: 'default' } },
    },
    input: {
      compact: { props: { size: 'sm', variant: 'bordered' } },
      hero: { props: { size: 'lg', variant: 'faded', color: 'primary' } },
    },
    selector: {
      compact: { props: { size: 'sm', variant: 'bordered' } },
    },
    formModal: {
      delete: {
        props: {
          size: 'sm',
          actions: {
            submitLabel: 'Delete',
            cancelLabel: 'Keep it',
            submitProps: { color: 'error' },
          },
          formProps: {
            fieldProps: { input: { size: 'sm', variant: 'bordered' } },
          },
        },
        classNames: { title: 'text-(--easyui-color-error)' },
      },
      deleteFromPresets: {
        props: {
          size: 'sm',
          actions: {
            submitLabel: 'Delete',
            cancelLabel: 'Keep it',
            submitProps: { preset: 'danger' },
            cancelProps: { preset: 'ghost' },
          },
          formProps: {
            fieldProps: { input: { preset: 'compact' } },
          },
        },
        classNames: { title: 'text-(--easyui-color-error)' },
      },
      createFromPresets: {
        props: {
          actions: {
            submitLabel: 'Create',
            submitProps: { preset: 'create' },
            cancelProps: { preset: 'ghost' },
          },
          formProps: {
            fieldProps: {
              input: { preset: 'compact' },
              selector: { preset: 'compact' },
            },
          },
        },
      },
    },
  },
}

export const Delete: Story = {
  render: function DeleteFormModal() {
    const form = useForm(deleteFields)
    return (
      <EasyUIProvider config={config}>
        <FormModal
          preset="delete"
          form={form}
          isOpen
          onOpenChange={() => {}}
          title="Delete this user"
          description="This action cannot be undone."
          formProps={{ onSubmit: () => {} }}
        />
      </EasyUIProvider>
    )
  },
}

export const DeleteFromPresets: Story = {
  render: function DeleteFromPresetsFormModal() {
    const form = useForm(deleteFields)
    return (
      <EasyUIProvider config={config}>
        <FormModal
          preset="deleteFromPresets"
          form={form}
          isOpen
          onOpenChange={() => {}}
          title="Delete this user"
          description="This action cannot be undone."
          formProps={{ onSubmit: () => {} }}
        />
      </EasyUIProvider>
    )
  },
}

export const CreateFromPresets: Story = {
  render: function CreateFromPresetsFormModal() {
    const form = useForm(createFields)
    return (
      <EasyUIProvider config={config}>
        <FormModal
          preset="createFromPresets"
          form={form}
          isOpen
          onOpenChange={() => {}}
          title="New user"
          description="Headline declares its own preset, so it ignores fieldProps."
          formProps={{ onSubmit: () => {} }}
        />
      </EasyUIProvider>
    )
  },
}
