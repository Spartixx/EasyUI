import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/CustomField',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const swatches = ['#4f46e5', '#059669', '#dc2626', '#d97706']

const fields = {
  label: { type: 'input', label: 'Label' },
  color: {
    type: 'custom',
    defaultValue: '',
    isRequired: true,
    validators: [(value: string) => (value ? null : 'Please pick a color')],
    render: (ctx) => (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Color</span>
        <div className="flex gap-2">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              disabled={ctx.isDisabled}
              onClick={() => ctx.setValue(swatch)}
              style={{ backgroundColor: swatch }}
              className={ctx.value === swatch ? 'size-6 rounded-full ring-2 ring-offset-2' : 'size-6 rounded-full'}
            />
          ))}
        </div>
        {ctx.error && <span className="text-xs text-(--easyui-color-error)">{ctx.error}</span>}
      </div>
    ),
  },
} satisfies FormFields

function CustomFieldForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 340 }}>
      <Form form={form} onSubmit={() => {}} />
    </div>
  )
}

export const Default: Story = {
  render: () => <CustomFieldForm />,
}
