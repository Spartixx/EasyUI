import type { Meta } from '@storybook/react-vite'
import { InputsGroup } from '../index.ts'

export const inputsGroupMeta = {
  component: InputsGroup,
  title: 'Advanced/InputsGroup',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    removeButtonPlacement: { control: 'select', options: ['left', 'right'] },
    addButtonPlacement: { control: 'select', options: ['left', 'right', 'full-width'] },
    initialValues: { control: false },
    onValuesChange: { control: false },
    onNonEmptyValuesChange: { control: false },
    validations: { control: false },
    inputProps: { control: false },
    addButtonProps: { control: false },
    removeButtonProps: { control: false },
    renderRemoveButton: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof InputsGroup>
