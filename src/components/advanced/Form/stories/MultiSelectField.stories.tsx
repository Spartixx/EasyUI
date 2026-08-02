import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues } from './submittedValues.tsx'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/MultiSelectField',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

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

const fields = {
  name: { type: 'input', label: 'Name' },
  languages: {
    type: 'selector',
    selectionMode: 'multiple',
    label: 'Languages',
    isRequired: true,
    options: languageOptions,
  },
  skills: {
    type: 'autocomplete',
    selectionMode: 'multiple',
    label: 'Skills',
    options: skillOptions,
  },
} satisfies FormFields

function MultiSelectForm() {
  const form = useForm(fields)
  return (
    <div style={{ width: 340 }}>
      <FormWithSubmittedValues form={form} />
    </div>
  )
}

const mixedFields = {
  country: { type: 'selector', label: 'Country (single)', options: languageOptions },
  languages: {
    type: 'selector',
    selectionMode: 'multiple',
    label: 'Languages (multiple)',
    options: languageOptions,
    defaultValue: ['fr'],
  },
} satisfies FormFields

function MixedSelectionForm() {
  const form = useForm(mixedFields)
  return (
    <div style={{ width: 340 }}>
      <FormWithSubmittedValues form={form} />
    </div>
  )
}

export const Default: Story = { render: () => <MultiSelectForm /> }
export const SingleAndMultiple: Story = { render: () => <MixedSelectionForm /> }
