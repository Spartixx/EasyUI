import type { Meta, StoryObj } from '@storybook/react-vite'
import { Autocomplete, Input, Selector } from '../../../primitives'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/Body',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const countryOptions = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'pt', label: 'Portugal' },
]

export const Text: Story = {
  args: {
    children: (
      <p className="text-sm text-(--easyui-color-foreground)">
        Every task attached to this project will be removed as well. Members will lose access immediately.
      </p>
    ),
  },
}

export const RichContent: Story = {
  args: {
    title: 'Review the changes',
    description: 'Three files will be overwritten.',
    children: (
      <ul className="flex flex-col gap-2 text-sm text-(--easyui-color-foreground)">
        <li className="flex justify-between gap-4">
          <span>src/index.ts</span>
          <span className="text-(--easyui-color-foreground)/60">+12 −3</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>src/theme.css</span>
          <span className="text-(--easyui-color-foreground)/60">+4 −0</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>README.md</span>
          <span className="text-(--easyui-color-foreground)/60">+1 −1</span>
        </li>
      </ul>
    ),
  },
}

export const WithFields: Story = {
  args: {
    title: 'Invite a teammate',
    description: undefined,
    children: (
      <div className="flex flex-col gap-4">
        <Input label="Email" placeholder="teammate@example.com" isFullWidth />
        <Selector label="Role" options={[{ value: 'admin', label: 'Admin' }]} isFullWidth />
      </div>
    ),
  },
}

export const WithOpenListbox: Story = {
  args: {
    title: 'Pick a country',
    description: 'The listbox overlays the modal instead of being trapped inside it.',
    children: (
      <div className="flex flex-col gap-4">
        <Selector label="Country" options={countryOptions} isFullWidth />
        <Autocomplete label="Billing country" options={countryOptions} isFullWidth />
      </div>
    ),
  },
}

export const WithoutHeader: Story = {
  args: {
    title: undefined,
    description: undefined,
    children: (
      <p className="text-sm text-(--easyui-color-foreground)">
        No title, no description, no close icon: the body carries the whole message, the footer carries the actions.
      </p>
    ),
    isCloseIconHidden: true,
  },
}

export const BodyOnly: Story = {
  args: {
    title: undefined,
    description: undefined,
    isCloseIconHidden: true,
    actions: { isSubmitButtonHidden: true, showCancel: false },
    children: (
      <p className="text-sm text-(--easyui-color-foreground)">
        Neither header nor footer: a bare panel. Escape and a click on the backdrop still close it.
      </p>
    ),
  },
}

export const LongScrollingBody: Story = {
  args: {
    title: 'Terms of service',
    description: 'The backdrop scrolls, the panel keeps its natural height.',
    children: (
      <div className="flex flex-col gap-3 text-sm text-(--easyui-color-foreground)">
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index}>
            Section {index + 1}. This paragraph exists to make the modal taller than the viewport so the scrolling
            behaviour is visible.
          </p>
        ))}
      </div>
    ),
  },
}
