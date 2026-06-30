import type { Meta } from '@storybook/react-vite'
import { Autocomplete } from '../index.ts'
import { fruitOptions } from '../../../internal/listbox/listboxOptionFixtures.tsx'

export const autocompleteMeta = {
  component: Autocomplete,
  title: 'Primitives/Autocomplete',
  args: {
    options: fruitOptions,
    placeholder: 'Search a fruit...',
    color: 'primary',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['bordered', 'faded', 'flat', 'underlined'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    arrowPlacement: { control: 'select', options: ['start', 'end'] },
    options: { control: false },
    startContent: { control: false },
    endContent: { control: false },
    arrow: { control: false },
    classNames: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Autocomplete>
