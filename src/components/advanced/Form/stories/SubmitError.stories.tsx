import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues, ValuesPanel } from './submittedValues.tsx'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/SubmitError',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  email: { type: 'input', kind: 'email', label: 'Email', isRequired: true, defaultValue: 'ada@example.com' },
} satisfies FormFields

class HttpError extends Error {
  response: { status: number }
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.response = { status }
  }
}

const readHttpStatus = (error: Error) =>
  error instanceof HttpError ? error.response.status.toString() : null

function ControlledErrorForm() {
  const form = useForm(fields)
  const [error, setError] = useState<string | null>(null)

  return (
    <div style={{ width: 380 }}>
      <FormWithSubmittedValues
        form={form}
        title="Create an account"
        description="Submitting always fails after 300ms. The message is held in your own state and passed through the error prop."
        error={error ?? undefined}
        onSubmit={async () => {
          setError(null)
          await new Promise((resolve) => setTimeout(resolve, 300))
          setError('Your account could not be created.')
        }}
      />
    </div>
  )
}

function MappedErrorForm() {
  const form = useForm(fields)

  return (
    <div style={{ width: 380 }}>
      <FormWithSubmittedValues
        form={form}
        title="Create an account"
        description="Submitting always fails with HTTP 409, which the mapping covers."
        onSubmit={() => Promise.reject(new HttpError(409))}
        getSubmitErrorStatus={readHttpStatus}
        submitErrorMessages={{
          409: 'This email address is already taken',
          500: 'Server error, please try again',
        }}
      />
    </div>
  )
}

function GlobalFallbackForm() {
  const form = useForm(fields)

  return (
    <EasyUIProvider
      config={{
        defaults: {
          form: {
            getSubmitErrorStatus: readHttpStatus,
            submitErrorMessages: { 409: 'A conflict occurred, the resource already exists' },
          },
        },
      }}
    >
      <div style={{ width: 380 }}>
        <FormWithSubmittedValues
          form={form}
          title="Create an account"
          description="Submitting always fails with HTTP 409. This form declares no mapping: both the extractor and the message come from the global configuration."
          onSubmit={() => Promise.reject(new HttpError(409))}
        />
      </div>
    </EasyUIProvider>
  )
}

function UnhandledErrorForm() {
  const form = useForm(fields)
  const [status, setStatus] = useState('409')
  const [caught, setCaught] = useState<string[]>([])

  return (
    <div style={{ width: 380 }} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-(--easyui-color-foreground)">
        Status the submit will fail with
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="409">409 — mapped, shows the alert below the title</option>
          <option value="503">503 — not mapped, reaches onUnhandledSubmitError</option>
        </select>
      </label>
      <FormWithSubmittedValues
        form={form}
        title="Create an account"
        description="Submitting always fails. Pick a status above, submit, and compare the two paths."
        onSubmit={() => Promise.reject(new HttpError(Number(status)))}
        getSubmitErrorStatus={readHttpStatus}
        submitErrorMessages={{ 409: 'This email address is already taken' }}
        onUnhandledSubmitError={(error) => setCaught((previous) => [...previous, error.message])}
      />
      <ValuesPanel title="Reached onUnhandledSubmitError" values={caught} />
    </div>
  )
}

export const ControlledError: Story = { render: () => <ControlledErrorForm /> }
export const UnhandledError: Story = { render: () => <UnhandledErrorForm /> }
export const MappedConflict: Story = { render: () => <MappedErrorForm /> }
export const GlobalFallback: Story = { render: () => <GlobalFallbackForm /> }
