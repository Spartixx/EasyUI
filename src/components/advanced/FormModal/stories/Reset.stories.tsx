import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../../Form'
import { formModalMeta } from './meta.ts'
import { FormModalWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/Reset',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Full name', isRequired: true },
  country: {
    type: 'selector',
    label: 'Country',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
    ],
  },
} satisfies FormFields

export const ResetOnClose: Story = {
  render: function ResetOnCloseFormModal() {
    const form = useForm(fields)
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="New user"
        description="Type something, close the modal, then reopen it: the fields start fresh. This is the default."
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}

export const KeepValuesOnClose: Story = {
  render: function KeepValuesFormModal() {
    const form = useForm(fields)
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="New user"
        description="isResetOnClose={false}: closing and reopening keeps what was typed, so the user resumes where they left off."
        isResetOnClose={false}
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}
