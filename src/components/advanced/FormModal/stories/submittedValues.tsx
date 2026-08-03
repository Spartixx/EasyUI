import { useState } from 'react'
import { FormModal } from '../index.ts'
import type { FormModalProps } from '../index.ts'
import type { FormAllValues, FormFields, FormSubmitHandler, FormVisibleValues } from '../../Form'

interface SubmittedPayloads<TFields extends FormFields> {
  values: FormVisibleValues<TFields>
  allValues: FormAllValues<TFields>
}

const PANEL_CLASSES =
  'flex flex-col gap-1 rounded-(--easyui-radius-md) border-solid border-[length:var(--easyui-border-width-sm)] border-(--easyui-color-default) p-3'

export function ValuesPanel<TValues>({ title, values }: { title: string; values: TValues }) {
  return (
    <div className={PANEL_CLASSES}>
      <p className="text-xs font-medium text-(--easyui-color-foreground)">{title}</p>
      <pre className="text-xs text-(--easyui-color-foreground)/70">{JSON.stringify(values, null, 2)}</pre>
    </div>
  )
}

export function FormModalWithSubmittedValues<TFields extends FormFields, TSubmitError = Error>({
  form,
  formProps,
  ...modalProps
}: Omit<FormModalProps<TFields, TSubmitError>, 'isOpen' | 'onOpenChange'>) {
  const [isOpen, setIsOpen] = useState(true)
  const [submitted, setSubmitted] = useState<SubmittedPayloads<TFields> | null>(null)

  const handleSubmit: FormSubmitHandler<TFields> = async (values, allValues) => {
    await formProps.onSubmit(values, allValues)
    setSubmitted({ values, allValues })
  }

  return (
    <div className="flex flex-col gap-3" style={{ width: 380 }}>
      <button
        type="button"
        className="self-start text-sm underline cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Open the modal
      </button>
      <ValuesPanel title="Current values (live)" values={form.values} />
      {submitted && (
        <>
          <ValuesPanel title="Submitted values" values={submitted.values} />
          <ValuesPanel title="Submitted allValues — hidden fields included" values={submitted.allValues} />
        </>
      )}
      <FormModal
        {...modalProps}
        form={form}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formProps={{ ...formProps, onSubmit: handleSubmit }}
      />
    </div>
  )
}
