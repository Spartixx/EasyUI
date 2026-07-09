import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Form, useForm, type FormFields } from '../index.ts'
import { EasyUIProvider } from '../../../../providers'
import type { EasyUIConfig } from '../../../../config/easyui.config.types'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Wrappers',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  name: { type: 'input', label: 'Name', defaultValue: 'Ada' },
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

function WrappedForm({ config, children }: { config: EasyUIConfig; children?: ReactNode }) {
  const form = useForm(fields)
  return (
    <EasyUIProvider config={config}>
      <div style={{ width: 360 }}>
        <Form form={form} onSubmit={() => {}} actions={{ onCancel: () => {} }} />
        {children}
      </div>
    </EasyUIProvider>
  )
}

export const NoFormBorder: Story = {
  render: () => (
    <WrappedForm config={{ wrappers: { form: { base: 'border-none' } } }} />
  ),
}

export const FieldStyles: Story = {
  render: () => (
    <WrappedForm
      config={{
        wrappers: {
          form: {
            inputField: 'ring-2 ring-emerald-400 rounded-lg',
            selectorField: 'ring-2 ring-sky-400 rounded-lg',
          },
        },
      }}
    />
  ),
}

export const ButtonStyles: Story = {
  render: () => (
    <WrappedForm
      config={{
        wrappers: {
          form: {
            submitButton: 'rounded-full px-8 uppercase tracking-wide',
            cancelButton: 'rounded-full',
          },
        },
      }}
    />
  ),
}
