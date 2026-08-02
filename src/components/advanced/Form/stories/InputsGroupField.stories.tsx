import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm, type FormFields } from '../index.ts'
import type { InputsGroupNumberInitialValue, InputsGroupTextInitialValue } from '../../InputsGroup'
import { formMeta } from './meta.ts'
import { FormWithSubmittedValues, ValuesPanel } from './submittedValues.tsx'

const meta = {
  ...formMeta,
  title: 'Advanced/Form/InputsGroupField',
} satisfies Meta<typeof formMeta.component>

export default meta
type Story = StoryObj

const aliasRows: InputsGroupTextInitialValue[] = [{ value: '', isRequired: true }, { value: '' }]
const amountRows: InputsGroupNumberInitialValue[] = [{ value: 10, isRequired: true }, { value: null }]

function InputsGroupForm() {
  const [nonEmptyValues, setNonEmptyValues] = useState<string[]>(() =>
    aliasRows.map((row) => row.value).filter((value) => value !== ''),
  )

  const fields = useMemo(
    () =>
      ({
        projectName: { type: 'input', label: 'Project name' },
        aliases: {
          type: 'inputs-group',
          label: 'Aliases',
          description: 'The first row is required and cannot be removed.',
          initialValues: aliasRows,
          props: { onNonEmptyValuesChange: setNonEmptyValues },
        },
      }) satisfies FormFields,
    [],
  )

  const form = useForm(fields)

  return (
    <div style={{ width: 380 }}>
      <FormWithSubmittedValues form={form} />
      <ValuesPanel title="Non-empty values (live, via onNonEmptyValuesChange)" values={nonEmptyValues} />
    </div>
  )
}

function NumberInputsGroupForm() {
  const [nonEmptyValues, setNonEmptyValues] = useState<number[]>(() =>
    amountRows.map((row) => row.value).filter((value): value is number => value !== null),
  )

  const fields = useMemo(
    () =>
      ({
        invoice: { type: 'input', label: 'Invoice' },
        amounts: {
          type: 'inputs-group',
          itemsType: 'number',
          label: 'Amounts',
          initialValues: amountRows,
          props: { inputProps: { prefix: '$' }, onNonEmptyValuesChange: setNonEmptyValues },
        },
      }) satisfies FormFields,
    [],
  )

  const form = useForm(fields)

  return (
    <div style={{ width: 380 }}>
      <FormWithSubmittedValues form={form} />
      <ValuesPanel title="Non-empty values (live, via onNonEmptyValuesChange)" values={nonEmptyValues} />
    </div>
  )
}

export const Default: Story = { render: () => <InputsGroupForm /> }
export const NumberItems: Story = { render: () => <NumberInputsGroupForm /> }
