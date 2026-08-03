import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/SubmitError',
} satisfies Meta<typeof modalMeta.component>

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
  409: 'This project still has open tasks',
  500: 'Server error, please try again',
}

export const ControlledError: Story = {
  render: function ControlledErrorModal() {
    const [error, setError] = useState<string | undefined>(undefined)
    return (
      <Modal
        isOpen
        onOpenChange={() => {}}
        title="Delete this project?"
        description="Submitting always fails after 300ms. The message is held in your own state and passed through the error prop."
        actions={{ submitLabel: 'Delete' }}
        color="error"
        error={error}
        onSubmit={async () => {
          setError(undefined)
          await new Promise((resolve) => setTimeout(resolve, 300))
          setError('The project could not be deleted.')
        }}
      />
    )
  },
}

export const MappedError: Story = {
  render: function MappedErrorModal() {
    return (
      <Modal
        isOpen
        onOpenChange={() => {}}
        title="Delete this project?"
        description="Submitting always fails with HTTP 409, which the mapping covers."
        actions={{ submitLabel: 'Delete' }}
        color="error"
        onSubmit={() => Promise.reject(new HttpError(409))}
        getSubmitErrorStatus={readHttpStatus}
        submitErrorMessages={submitErrorMessages}
      />
    )
  },
}

export const UnhandledError: Story = {
  render: function UnhandledErrorModal() {
    const [reported, setReported] = useState<string | null>(null)
    return (
      <div className="flex flex-col gap-3">
        <Modal
          isOpen
          onOpenChange={() => {}}
          title="Delete this project?"
          description="Submitting fails with HTTP 503, which the mapping does not cover. No alert is shown: onUnhandledSubmitError receives it instead."
          actions={{ submitLabel: 'Delete' }}
          color="error"
          onSubmit={() => Promise.reject(new HttpError(503))}
          getSubmitErrorStatus={readHttpStatus}
          submitErrorMessages={submitErrorMessages}
          onUnhandledSubmitError={(error) => setReported(error.message)}
          footer={reported ? <p className="text-xs">Reported to the caller: {reported}</p> : undefined}
        />
      </div>
    )
  },
}

export const GlobalFallback: Story = {
  render: function GlobalFallbackModal() {
    return (
      <EasyUIProvider
        config={{ defaults: { modal: { getSubmitErrorStatus: readHttpStatus, submitErrorMessages } } }}
      >
        <Modal
          isOpen
          onOpenChange={() => {}}
          title="Delete this project?"
          description="The mapping comes from defaults.modal, so this modal declares nothing."
          actions={{ submitLabel: 'Delete' }}
          color="error"
          onSubmit={() => Promise.reject(new HttpError(500))}
        />
      </EasyUIProvider>
    )
  },
}
