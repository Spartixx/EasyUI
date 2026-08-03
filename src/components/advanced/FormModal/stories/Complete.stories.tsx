import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../../Form'
import type { InputsGroupTextInitialValue } from '../../InputsGroup'
import { formModalMeta } from './meta.ts'
import { FormModalWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formModalMeta,
  title: 'Advanced/FormModal/Complete',
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

const countryOptions = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
]

const cityOptions = [
  { value: 'paris', label: 'Paris' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'madrid', label: 'Madrid' },
]

const languageOptions = [
  { value: 'fr', label: 'French' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
]

const skillOptions = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
]

const aliasRows: InputsGroupTextInitialValue[] = [{ value: '', isRequired: true }, { value: '' }]

const completeFields = {
  name: { type: 'input', label: 'Full name', isRequired: true, defaultValue: 'Ada Lovelace' },
  email: {
    type: 'input',
    kind: 'email',
    label: 'Email',
    isRequired: true,
    validators: [(value: string) => (value.includes('@') ? null : 'Enter a valid email address')],
  },
  password: {
    type: 'input',
    kind: 'password',
    label: 'Password',
    isRequired: true,
    validators: [(value: string) => (value.length >= 8 ? null : 'At least 8 characters')],
  },
  confirmPassword: {
    type: 'input',
    kind: 'password',
    label: 'Confirm password',
    isRequired: true,
    validators: [
      (value: string, values) => (value === values.password ? null : 'Both passwords must match'),
    ],
  },
  age: {
    type: 'number',
    label: 'Age',
    validators: [(value: number | null) => (value === null || value >= 18 ? null : 'Must be 18 or older')],
  },
  country: { type: 'selector', label: 'Country', isRequired: true, options: countryOptions },
  city: { type: 'autocomplete', label: 'City', options: cityOptions },
  languages: { type: 'selector', selectionMode: 'multiple', label: 'Languages', options: languageOptions },
  skills: { type: 'autocomplete', selectionMode: 'multiple', label: 'Skills', options: skillOptions },
  aliases: {
    type: 'inputs-group',
    label: 'Aliases',
    description: 'The first row is required and cannot be removed.',
    initialValues: aliasRows,
  },
  newsletter: {
    type: 'custom',
    defaultValue: '',
    label: 'Newsletter',
    render: (ctx) => (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={ctx.value === 'yes'}
          disabled={ctx.isDisabled}
          onBlur={ctx.onBlur}
          onChange={(event) => ctx.setValue(event.target.checked ? 'yes' : '')}
        />
        Subscribe to the newsletter
      </label>
    ),
  },
  accepted: {
    type: 'custom',
    defaultValue: '',
    isRequired: true,
    validators: [(value: string) => (value === 'yes' ? null : 'Please accept the terms')],
    render: (ctx) => (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={ctx.value === 'yes'}
          disabled={ctx.isDisabled}
          onBlur={ctx.onBlur}
          onChange={(event) => ctx.setValue(event.target.checked ? 'yes' : '')}
        />
        I accept the terms
        {ctx.error && <span className="text-(--easyui-color-error)">{ctx.error}</span>}
      </label>
    ),
  },
  companyName: {
    type: 'input',
    label: 'Company name',
    isRequired: true,
    dependsOn: { accountType: 'company' },
  },
  accountType: {
    type: 'selector',
    label: 'Account type',
    defaultValue: 'personal',
    options: [
      { value: 'personal', label: 'Personal' },
      { value: 'company', label: 'Company' },
    ],
  },
} satisfies FormFields

export const Everything: Story = {
  render: function EverythingFormModal() {
    const form = useForm(completeFields, { validateOn: 'blur' })
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="Create an account"
        description="Every built-in field type, with validation on blur. Pick “Company” to reveal a conditional field."
        size="lg"
        color="default"
        actions={{ submitLabel: 'Create the account', cancelLabel: 'Discard' }}
        formProps={{
          onSubmit: () => {},
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages: { 409: 'This email address is already taken' },
        }}
      />
    )
  },
}

export const EverythingFailingSubmit: Story = {
  render: function EverythingFailingFormModal() {
    const form = useForm(completeFields, { validateOn: 'blur' })
    return (
      <FormModalWithSubmittedValues
        form={form}
        title="Create an account"
        description="Same form, but the submit always fails with HTTP 409: the modal stays open and shows the mapped message."
        size="lg"
        color="default"
        actions={{ submitLabel: 'Create the account' }}
        formProps={{
          onSubmit: () => Promise.reject(new HttpError(409)),
          getSubmitErrorStatus: readHttpStatus,
          submitErrorMessages: { 409: 'This email address is already taken' },
        }}
      />
    )
  },
}
