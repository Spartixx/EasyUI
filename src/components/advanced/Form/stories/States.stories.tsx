import { useEffect, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/States',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Name', defaultValue: 'Ada Lovelace' },
  role: {
    type: 'selector',
    label: 'Role',
    defaultValue: 'dev',
    options: [
      { value: 'dev', label: 'Developer' },
      { value: 'design', label: 'Designer' },
    ],
  },
} satisfies FormFields

const pendingSubmit = () => new Promise<void>(() => {})

function StateForm(props: { isDisabled?: boolean; isLoading?: boolean }) {
  const form = useForm(fields)
  return (
    <div style={{ width: 360 }}>
      <Form
        form={form}
        onSubmit={() => {}}
        title="Team member"
        description="Edit the member details."
        loadingMessage="Loading options…"
        disabledMessage="Editing is currently locked."
        actions={{ loadingLabel: 'Loading…', submittingLabel: 'Saving…' }}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
      />
    </div>
  )
}

export const Disabled: Story = {
  render: () => <StateForm isDisabled />,
}

export const Loading: Story = {
  render: () => <StateForm isLoading />,
}

function SubmittingForm() {
  const form = useForm(fields)
  const startedRef = useRef(false)
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    void form.handleSubmit(pendingSubmit)
  }, [form])
  return (
    <div style={{ width: 360 }}>
      <Form
        form={form}
        onSubmit={pendingSubmit}
        title="Team member"
        actions={{ submittingLabel: 'Saving…' }}
      />
    </div>
  )
}

export const Submitting: Story = {
  render: () => <SubmittingForm />,
}
