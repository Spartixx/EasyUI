import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormModal } from '../index.ts'
import { useForm, type FormFields } from '../../Form'
import { formModalMeta } from './meta.ts'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/States',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Full name', isRequired: true, defaultValue: 'Ada Lovelace' },
  country: {
    type: 'selector',
    label: 'Country',
    defaultValue: 'fr',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  },
} satisfies FormFields

export const Default: Story = {
  render: function DefaultStateFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="Nothing special: the form is idle."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const Loading: Story = {
  render: function LoadingFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="isLoading: the fields show a spinner while their options load, and the footer buttons are disabled."
        isLoading
        actions={{ loadingLabel: 'Loading…' }}
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const LoadingWithError: Story = {
  render: function LoadingWithErrorFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="isLoading together with an error the caller controls."
        isLoading
        actions={{ loadingLabel: 'Loading…' }}
        formProps={{ onSubmit: () => {}, error: 'The reference data could not be refreshed.' }}
      />
    )
  },
}

export const Disabled: Story = {
  render: function DisabledFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="isDisabled: every field and both footer buttons are disabled."
        isDisabled
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const DisabledWithError: Story = {
  render: function DisabledWithErrorFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="isDisabled together with an error explaining why."
        isDisabled
        formProps={{ onSubmit: () => {}, error: 'This account is locked and cannot be edited.' }}
      />
    )
  },
}

export const Submitting: Story = {
  render: function SubmittingFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="Submitting takes 3s: the footer button spins while the fields go into loading."
        actions={{ submittingLabel: 'Creating…' }}
        formProps={{ onSubmit: () => new Promise((resolve) => setTimeout(resolve, 3000)) }}
      />
    )
  },
}

export const WithoutCloseIcon: Story = {
  render: function WithoutCloseIconFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description="The close icon is hidden, so only the cancel button dismisses the modal."
        isCloseIconHidden
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}
