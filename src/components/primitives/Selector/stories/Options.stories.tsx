import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectorMeta } from './meta.ts'
import {
  optionsWithDisabledOption,
  manyOptions,
  optionsWithDescription,
  optionsWithStartContent,
  optionsWithEndContent,
  optionsWithEverything,
} from '../../../internal/listbox/listboxOptionFixtures.tsx'

const meta = { ...selectorMeta, title: 'Primitives/Selector/Options' } satisfies Meta<typeof selectorMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const DisabledOption: Story = { args: { options: optionsWithDisabledOption } }
export const ManyOptions: Story = { args: { options: manyOptions } }
export const WithDescription: Story = { args: { options: optionsWithDescription } }
export const WithStartContent: Story = { args: { options: optionsWithStartContent } }
export const WithEndContent: Story = { args: { options: optionsWithEndContent } }
export const WithEverything: Story = { args: { options: optionsWithEverything } }
export const ValidatedOptions: Story = {
  args: {
    validations: [(option) => (option.value === 'cherry' ? 'Out of season' : null)],
  },
}
