import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormModal } from '../index.ts'
import { useForm, type FormFields } from '../../Form'
import { EasyUIProvider } from '../../../../providers'
import { formModalMeta } from './meta.ts'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/SubmitError',
} satisfies Meta<typeof formModalMeta.component>

export default meta
type Story = StoryObj

class HttpError extends Error {
  response: { status: number }
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.response = { status }
  }
}

const readHttpStatus = (error: Error) => (error instanceof HttpError ? error.response.status.toString() : null)

const submitErrorMessages = {
  409: 'This email address is already taken',
  500: 'Server error, please try again',
}

const fields = {
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true, defaultValue: 'ada@example.com' },
} satisfies FormFields

export const MappedError: Story = {
  render: function MappedErrorFormModal() {
    const form = useForm(fields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="Create an account"
        description="Submitting always fails with HTTP 409, which the mapping covers. The modal stays open."
        formProps={{
          onSubmit: () => Promise.reject(new HttpError(409)),
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages,
        }}
      />
    )
  },
}

export const UnhandledError: Story = {
  render: function UnhandledErrorFormModal() {
    const form = useForm(fields)
    const [reported, setReported] = useState<string | null>(null)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="Create an account"
        description="Submitting fails with HTTP 503, outside the mapping. No alert: onUnhandledSubmitError receives it."
        footer={
          reported ? (
            <p className="text-xs text-(--easyui-color-foreground)/60">Reported to the caller: {reported}</p>
          ) : undefined
        }
        formProps={{
          onSubmit: () => Promise.reject(new HttpError(503)),
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages,
          onUnhandledSubmitError: (error) => setReported(error.message),
        }}
      />
    )
  },
}

export const ControlledError: Story = {
  render: function ControlledErrorFormModal() {
    const form = useForm(fields)
    const [error, setError] = useState<string | undefined>(undefined)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="Create an account"
        description="Submitting fails after 300ms. The message is held in your own state and passed through the form error prop."
        formProps={{
          error,
          onSubmit: async () => {
            setError(undefined)
            await new Promise((resolve) => setTimeout(resolve, 300))
            setError('Your account could not be created.')
          },
        }}
      />
    )
  },
}

export const GlobalFallback: Story = {
  render: function GlobalFallbackFormModal() {
    const form = useForm(fields)
    return (
      <EasyUIProvider
        config={{ defaults: { form: { getSubmitErrorStatus: readHttpStatus, submitErrorMessages } } }}
      >
        <FormModal
          form={form}
          isOpen
          onOpenChange={() => {}}
          title="Create an account"
          description="The mapping comes from defaults.form, so this modal declares nothing."
          formProps={{ onSubmit: () => Promise.reject(new HttpError(500)) }}
        />
      </EasyUIProvider>
    )
  },
}

export const ValidationBeforeSubmit: Story = {
  render: function ValidationBeforeSubmitFormModal() {
    const form = useForm({
      email: { type: 'input', kind: 'email', label: 'Email', isRequired: true },
    } satisfies FormFields)
    return (
      <FormModal
        form={form}
        isOpen
        onOpenChange={() => {}}
        title="Create an account"
        description="The field is empty: validation fails, onSubmit is never reached and no submit error can appear."
        formProps={{
          onSubmit: () => Promise.reject(new HttpError(409)),
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages,
        }}
      />
    )
  },
}
