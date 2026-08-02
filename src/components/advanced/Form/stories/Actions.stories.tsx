import { useId } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import { Button } from '../../../primitives'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/Actions',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const fields = {
  title: { type: 'input', label: 'Title', isRequired: true },
} satisfies FormFields

function useDemoForm() {
  return useForm(fields)
}

export const SubmitOnly: Story = {
  render: function SubmitOnlyForm() {
    const form = useDemoForm()
    return (
      <div style={{ width: 340 }}>
        <FormWithSubmittedValues form={form} />
      </div>
    )
  },
}

export const WithCancel: Story = {
  render: function WithCancelForm() {
    const form = useDemoForm()
    return (
      <div style={{ width: 340 }}>
        <FormWithSubmittedValues
          form={form}
          actions={{ submitLabel: 'Save', cancelLabel: 'Discard', onCancel: () => form.reset() }}
        />
      </div>
    )
  },
}

export const SubmitFromOutside: Story = {
  render: function SubmitFromOutsideForm() {
    const form = useDemoForm()
    const formId = useId()
    return (
      <div style={{ width: 340 }} className="flex flex-col gap-3">
        <FormWithSubmittedValues
          id={formId}
          form={form}
          actions={{ isSubmitButtonHidden: true }}
        />
        <div className="flex justify-end">
          <Button type="submit" form={formId} isLoading={form.isSubmitting}>
            Save from outside the form
          </Button>
        </div>
      </div>
    )
  },
}
