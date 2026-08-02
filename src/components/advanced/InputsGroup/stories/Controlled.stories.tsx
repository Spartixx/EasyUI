import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'
import { inputsGroupMeta } from './meta.ts'

const meta = {
  ...inputsGroupMeta,
  title: 'Advanced/InputsGroup/Controlled',
} satisfies Meta<typeof inputsGroupMeta.component>

export default meta
type Story = StoryObj

function ControlledTagsExample() {
  const [values, setValues] = useState<string[]>(['react', 'vue'])

  return (
    <div style={{ width: 360 }} className="flex flex-col gap-4">
      <InputsGroup
        label="Tags"
        description="The parent owns the values."
        initialValues={[{ value: 'react' }, { value: 'vue' }]}
        values={values}
        onValuesChange={setValues}
      />
      <div className="flex gap-2">
        <button type="button" onClick={() => setValues(['a', 'b', 'c'])}>
          Set three values
        </button>
        <button type="button" onClick={() => setValues([''])}>
          Reset to one empty row
        </button>
      </div>
      <pre className="text-xs">{JSON.stringify(values)}</pre>
    </div>
  )
}

function ProtectedRowExample() {
  const [values, setValues] = useState<string[]>(['', ''])

  return (
    <div style={{ width: 360 }} className="flex flex-col gap-4">
      <InputsGroup
        label="Contacts"
        description="The second row is protected: a shorter array empties it instead of removing it."
        initialValues={[{ value: '' }, { value: '', isRequired: true }]}
        values={values}
        onValuesChange={setValues}
      />
      <button type="button" onClick={() => setValues(['only one'])}>
        Set a single value
      </button>
      <pre className="text-xs">{JSON.stringify(values)}</pre>
    </div>
  )
}

export const Controlled: Story = { render: () => <ControlledTagsExample /> }
export const WithProtectedRow: Story = { render: () => <ProtectedRowExample /> }
