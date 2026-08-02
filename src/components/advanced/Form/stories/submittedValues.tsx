import { useState } from 'react'
import { Form } from '../index.ts'
import type {
  FormAllValues,
  FormFields,
  FormProps,
  FormSubmitHandler,
  FormVisibleValues,
} from '../index.ts'

interface SubmittedPayloads<TFields extends FormFields> {
  values: FormVisibleValues<TFields>
  allValues: FormAllValues<TFields>
}

const PANEL_CLASSES =
  'mt-3 flex flex-col gap-1 rounded-(--easyui-radius-md) border-solid border-[length:var(--easyui-border-width-sm)] border-(--easyui-color-default) p-3'

export function ValuesPanel<TValues>({ title, values }: { title: string; values: TValues }) {
  return (
    <div className={PANEL_CLASSES}>
      <p className="text-xs font-medium text-(--easyui-color-foreground)">{title}</p>
      <pre className="text-xs text-(--easyui-color-foreground)/70">{JSON.stringify(values, null, 2)}</pre>
    </div>
  )
}

function SubmittedValuesPanel<TFields extends FormFields>({
  submitted,
}: {
  submitted: SubmittedPayloads<TFields> | null
}) {
  if (submitted === null) return null

  const showAllValues =
    JSON.stringify(submitted.allValues) !== JSON.stringify(submitted.values)

  return (
    <>
      <ValuesPanel title="Submitted values" values={submitted.values} />
      {showAllValues && (
        <ValuesPanel title="Submitted allValues — hidden fields included" values={submitted.allValues} />
      )}
    </>
  )
}

export function FormWithSubmittedValues<TFields extends FormFields, TSubmitError = Error>({
  onSubmit,
  ...formProps
}: Omit<FormProps<TFields, TSubmitError>, 'onSubmit'> & { onSubmit?: FormSubmitHandler<TFields> }) {
  const [submitted, setSubmitted] = useState<SubmittedPayloads<TFields> | null>(null)

  const handleSubmit: FormSubmitHandler<TFields> = async (values, allValues) => {
    setSubmitted({ values, allValues })
    await onSubmit?.(values, allValues)
  }

  return (
    <>
      <Form {...formProps} onSubmit={handleSubmit} />
      <ValuesPanel title="Current values (live)" values={formProps.form.values} />
      <SubmittedValuesPanel submitted={submitted} />
    </>
  )
}
