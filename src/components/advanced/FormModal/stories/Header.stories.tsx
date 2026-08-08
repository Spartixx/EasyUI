import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormModal } from '../index.ts'
import { useForm, type FormFields } from '../../Form'
import { formModalMeta } from './meta.ts'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/Header',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Full name', isRequired: true },
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true },
} satisfies FormFields

export const RichDescription: Story = {
  render: function RichDescriptionFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="New user"
        description={
          <>
            The account is created as a <strong className="font-semibold">member</strong>.{' '}
            <a href="https://example.com" className="underline">
              Compare the roles
            </a>
          </>
        }
        formProps={{ onSubmit: () => {} }}
      />
    )
  },
}
