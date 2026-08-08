import type { Meta, StoryObj } from '@storybook/react-vite'
import { modalMeta } from './meta.ts'

const meta = {
  ...modalMeta,
  title: 'Advanced/Modal/Header',
} satisfies Meta<typeof modalMeta.component>

export default meta
type Story = StoryObj<typeof meta>

export const RichDescription: Story = {
  args: {
    title: 'Delete this project?',
    description: (
      <>
        This removes <strong className="font-semibold">3 boards</strong> and every task attached to them.{' '}
        <a href="https://example.com" className="underline">
          What gets kept
        </a>
      </>
    ),
    children: <p className="text-sm">Members lose access as soon as the project is deleted.</p>,
  },
}
