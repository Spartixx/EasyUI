import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../Button'
import { Alert } from '../index.ts'
import { ALERT_COLORS, alertMeta } from './meta.tsx'

const meta = { ...alertMeta, title: 'Primitives/Alert/Contents' } satisfies Meta<typeof alertMeta.component>

export default meta
type Story = StoryObj<typeof meta>

const LONG_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in enim blandit, sagittis dolor a, pharetra risus. Praesent ligula nibh, viverra nec tellus id, aliquam placerat velit'

const narrow: Story['decorators'] = [
  (Story) => (
    <div style={{ width: '360px' }}>
      <Story />
    </div>
  ),
]

export const TitleOnly: Story = { args: { description: undefined } }

export const LongDescription: Story = { args: { description: LONG_DESCRIPTION } }

export const WrappingDescriptionAndClosable: Story = {
  args: { description: LONG_DESCRIPTION, isClosable: true },
  decorators: narrow,
}

export const WrappingTitleAndDescription: Story = {
  args: {
    title: 'A rather long title that will wrap onto a second line as well',
    description: LONG_DESCRIPTION,
    isClosable: true,
  },
  decorators: narrow,
}

export const WrappingDescriptionWithoutIcon: Story = {
  args: { description: LONG_DESCRIPTION, isIconHidden: true, isClosable: true },
  decorators: narrow,
}

export const NodeDescription: Story = {
  args: {
    title: 'Some fields need your attention',
    description: (
      <ul className="list-disc ps-5">
        <li>The email address is already taken</li>
        <li>The password must be at least 12 characters long</li>
      </ul>
    ),
    color: 'error',
    isClosable: true,
  },
}

export const WithEndContent: Story = {
  args: {
    endContent: (
      <Button size="sm" variant="outlined" color="primary">
        Install
      </Button>
    ),
  },
}

export const EndContentAndClosable: Story = {
  args: {
    isClosable: true,
    endContent: (
      <Button size="sm" variant="outlined" color="primary">
        Install
      </Button>
    ),
  },
}

export const AllWithoutDescription: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ALERT_COLORS.map((color) => (
        <Alert key={color} {...args} color={color} description={undefined} />
      ))}
    </div>
  ),
}
