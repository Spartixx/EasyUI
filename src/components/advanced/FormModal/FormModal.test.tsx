import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { useState, type ReactNode } from 'react'
import type { Mock } from 'vitest'
import { FormModal } from './index'
import type { FormModalSlots } from './index'
import { useForm, type FormFields } from '../Form'
import type { ModalActionsConfig } from '../Modal'
import { EasyUIProvider } from '../../../providers'
import type { EasyUIConfig } from '../../../config/easyui.config.types'

const fields = {
  title: { type: 'input', label: 'Title', isRequired: true },
} satisfies FormFields

function FormModalHarness({
  onSubmit = vi.fn(),
  onOpenChange,
  ...overrides
}: {
  onSubmit?: Mock | ((values: { title: string }) => void | Promise<void>)
  onOpenChange?: (isOpen: boolean) => void
  title?: string
  description?: ReactNode
  isClosedOnSubmit?: boolean
  isResetOnClose?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  preset?: string
  actions?: ModalActionsConfig
  classNames?: Partial<Record<FormModalSlots, string>>
}) {
  const [isOpen, setIsOpen] = useState(true)
  const form = useForm(fields)
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        reopen the modal
      </button>
      <FormModal
        form={form}
        isOpen={isOpen}
        onOpenChange={(nextOpen) => {
          setIsOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
        formProps={{ onSubmit: (values) => onSubmit(values) }}
        {...overrides}
      />
    </>
  )
}

describe('FormModal', () => {
  test('renders the form inside the dialog', () => {
    render(<FormModalHarness title="New user" />)
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByRole('textbox')).toBeDefined()
  })

  test('renders the title in the modal header, not in the form', () => {
    render(<FormModalHarness title="New user" description="Fill in the details" />)
    const dialog = screen.getByRole('dialog')
    const heading = screen.getByRole('heading', { name: 'New user' })
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id)
    const formElement = dialog.querySelector('form') as HTMLElement
    expect(formElement.contains(heading)).toBe(false)
  })

  test('accepts markup as the modal header description', () => {
    render(
      <FormModalHarness
        title="New user"
        description={
          <span>
            Read the <a href="https://example.com">guidelines</a> first.
          </span>
        }
      />,
    )
    const dialog = screen.getByRole('dialog')
    const link = screen.getByRole('link', { name: 'guidelines' })
    const formElement = dialog.querySelector('form') as HTMLElement
    expect(formElement.contains(link)).toBe(false)
  })

  test('the form renders no header of its own even while loading', () => {
    render(
      <EasyUIProvider config={{ defaults: { form: { loadingMessage: 'Loading the form…' } } }}>
        <FormModalHarness title="New user" isLoading />
      </EasyUIProvider>,
    )
    expect(screen.queryByText('Loading the form…')).toBeNull()
  })

  test('renders a single submit button, in the modal footer', () => {
    render(<FormModalHarness title="New user" />)
    expect(screen.getAllByRole('button', { name: 'Submit' })).toHaveLength(1)
  })

  test('the footer submit button submits the form', async () => {
    const onSubmit = vi.fn()
    render(<FormModalHarness title="New user" onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Hello' }))
  })

  test('closes after a successful submit', async () => {
    render(<FormModalHarness title="New user" />)
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  test('isClosedOnSubmit false keeps the modal open after a successful submit', async () => {
    const onSubmit = vi.fn()
    render(<FormModalHarness title="New user" isClosedOnSubmit={false} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Hello' }))
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  test('a failed validation keeps the modal open and never calls onSubmit', async () => {
    const onSubmit = vi.fn()
    render(<FormModalHarness title="New user" onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('This field is required')).toBeDefined()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  test('the cancel button closes the modal without submitting', async () => {
    const onSubmit = vi.fn()
    render(<FormModalHarness title="New user" onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  describe('resetting on close', () => {
    test('clears what was typed when the modal is closed by the cancel button', async () => {
      render(<FormModalHarness title="New user" />)
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      await userEvent.click(screen.getByRole('button', { name: 'reopen the modal' }))
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
    })

    test('clears what was typed when the modal is closed by the close icon', async () => {
      render(<FormModalHarness title="New user" />)
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      await userEvent.click(screen.getByRole('button', { name: 'reopen the modal' }))
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
    })

    test('clears the validation errors too', async () => {
      render(<FormModalHarness title="New user" />)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText('This field is required')).toBeDefined()
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      await userEvent.click(screen.getByRole('button', { name: 'reopen the modal' }))
      expect(screen.queryByText('This field is required')).toBeNull()
    })

    test('starts fresh after a successful submit', async () => {
      render(<FormModalHarness title="New user" />)
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      await userEvent.click(screen.getByRole('button', { name: 'reopen the modal' }))
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
    })

    test('isResetOnClose false keeps what was typed', async () => {
      render(<FormModalHarness title="New user" isResetOnClose={false} />)
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      await userEvent.click(screen.getByRole('button', { name: 'reopen the modal' }))
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Hello')
    })
  })

  describe('presets config', () => {
    function renderWithConfig(
      props: Parameters<typeof FormModalHarness>[0],
      config: EasyUIConfig,
    ) {
      return render(
        <EasyUIProvider config={config}>
          <FormModalHarness {...props} />
        </EasyUIProvider>,
      )
    }

    test('a single preset drives both the action buttons and the fields', () => {
      renderWithConfig(
        { preset: 'delete' },
        {
          presets: {
            formModal: {
              delete: {
                props: {
                  actions: { submitLabel: 'Delete' },
                  formProps: { fieldProps: { input: { autoComplete: 'off' } } },
                },
              },
            },
          },
        },
      )
      expect(screen.getByRole('button', { name: 'Delete' })).toBeDefined()
      expect(screen.getByRole('textbox').getAttribute('autocomplete')).toBe('off')
    })

    test('the formProps of the instance no longer wipe the ones of the preset', () => {
      renderWithConfig(
        { preset: 'delete' },
        {
          presets: {
            formModal: {
              delete: { props: { formProps: { fieldProps: { input: { autoComplete: 'off' } } } } },
            },
          },
        },
      )
      expect(screen.getByRole('textbox').getAttribute('autocomplete')).toBe('off')
    })

    test('the actions of the instance merge with the ones of the preset', () => {
      renderWithConfig(
        { preset: 'delete', actions: { cancelLabel: 'Back' } },
        {
          presets: {
            formModal: { delete: { props: { actions: { submitLabel: 'Delete' } } } },
          },
        },
      )
      expect(screen.getByRole('button', { name: 'Delete' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Back' })).toBeDefined()
    })

    test('isDisabled of a preset survives the relay to the form', () => {
      renderWithConfig(
        { preset: 'locked' },
        { presets: { formModal: { locked: { props: { isDisabled: true } } } } },
      )
      expect(screen.getByRole('textbox').hasAttribute('disabled')).toBe(true)
    })

    test('the classNames of a preset reach the slots of the modal', () => {
      renderWithConfig(
        { preset: 'delete', title: 'Delete this user' },
        {
          presets: {
            formModal: { delete: { classNames: { title: 'preset-title' } } },
          },
        },
      )
      expect(
        screen.getByRole('heading', { name: 'Delete this user' }).classList.contains('preset-title'),
      ).toBe(true)
    })

    test('the classNames of the instance apply over the ones of the preset', () => {
      renderWithConfig(
        { preset: 'delete', title: 'Delete this user', classNames: { title: 'instance-title' } },
        {
          presets: {
            formModal: { delete: { classNames: { title: 'preset-title' } } },
          },
        },
      )
      const heading = screen.getByRole('heading', { name: 'Delete this user' })
      expect(heading.classList.contains('preset-title')).toBe(true)
      expect(heading.classList.contains('instance-title')).toBe(true)
    })

    test('a formModal preset can name a button preset and a field preset instead of raw props', () => {
      renderWithConfig(
        { preset: 'delete' },
        {
          presets: {
            button: { danger: { props: { color: 'error' } } },
            input: { compact: { props: { autoComplete: 'off' } } },
            formModal: {
              delete: {
                props: {
                  actions: { submitLabel: 'Delete', submitProps: { preset: 'danger' } },
                  formProps: { fieldProps: { input: { preset: 'compact' } } },
                },
              },
            },
          },
        },
      )
      const submitButton = screen.getByRole('button', { name: 'Delete' })
      expect(submitButton.classList.contains('bg-(--easyui-color-error)')).toBe(true)
      expect(submitButton.classList.contains('bg-(--easyui-color-primary)')).toBe(false)
      expect(screen.getByRole('textbox').getAttribute('autocomplete')).toBe('off')
    })

    test('an unknown preset name leaves the modal unchanged', () => {
      renderWithConfig({ preset: 'missing' }, { presets: { formModal: {} } })
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined()
    })
  })

  describe('submit errors', () => {
    class HttpError extends Error {
      response: { status: number }
      constructor(status: number) {
        super(`HTTP ${status}`)
        this.response = { status }
      }
    }

    function FailingFormModal() {
      const [isOpen, setIsOpen] = useState(true)
      const form = useForm(fields)
      return (
        <FormModal
          form={form}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="New user"
          formProps={{
            onSubmit: () => Promise.reject(new HttpError(409)),
            getSubmitErrorStatus: (error) => (error instanceof HttpError ? String(error.response.status) : null),
            submitErrorMessages: { 409: 'This resource already exists' },
          }}
        />
      )
    }

    test('a mapped submit error is shown and the modal stays open', async () => {
      render(<FailingFormModal />)
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText('This resource already exists')).toBeDefined()
      expect(screen.getByRole('dialog')).toBeDefined()
    })
  })
})
