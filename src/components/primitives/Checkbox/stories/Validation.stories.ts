import type { Meta, StoryObj } from '@storybook/react-vite'
import { checkboxMeta } from './meta.tsx'

const meta = {
  ...checkboxMeta,
  title: 'Primitives/Checkbox/Validation',
} satisfies Meta<typeof checkboxMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const ExternalError: Story = {
  args: { isRequired: true, error: 'You must accept the terms to continue' },
}

export const ErrorWithDescription: Story = {
  args: {
    isRequired: true,
    description: 'You can change this later in your settings.',
    descriptionPlacement: 'element',
    error: 'You must accept the terms to continue',
  },
}

export const RequiredOnBlur: Story = {
  args: { isRequired: true },
}

export const CustomRequiredMessage: Story = {
  args: { isRequired: true, isRequiredMessage: 'Please tick this box before continuing' },
}

export const CustomValidations: Story = {
  args: {
    label: 'Confirm the deletion',
    validations: [(isSelected: boolean) => (isSelected ? null : 'Confirmation is mandatory')],
  },
}
