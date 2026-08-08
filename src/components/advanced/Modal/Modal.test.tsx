import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { createRef, useState } from 'react'
import { Modal } from './index'
import type { ModalProps } from './index'
import { EasyUIProvider } from '../../../providers'

type HarnessProps = Omit<ModalProps, 'isOpen' | 'onOpenChange'> & {
  initialOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

function ModalHarness({ initialOpen = true, onOpenChange, ...modalProps }: HarnessProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        open the modal
      </button>
      <Modal
        {...modalProps}
        isOpen={isOpen}
        onOpenChange={(nextOpen) => {
          setIsOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
      />
    </>
  )
}

function getBackdrop() {
  return screen.getByRole('dialog').parentElement?.parentElement as HTMLElement
}

describe('Modal', () => {
  test('renders nothing when isOpen is false', () => {
    render(<ModalHarness initialOpen={false} title="Confirm" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('renders a dialog when isOpen is true', () => {
    render(<ModalHarness title="Confirm" />)
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  test('renders the title, the description and the body', () => {
    render(
      <ModalHarness title="Confirm" description="This cannot be undone.">
        <p>Body content</p>
      </ModalHarness>,
    )
    expect(screen.getByText('Confirm')).toBeDefined()
    expect(screen.getByText('This cannot be undone.')).toBeDefined()
    expect(screen.getByText('Body content')).toBeDefined()
  })

  test('accepts markup as the description and keeps it wired to aria-describedby', () => {
    render(
      <ModalHarness
        title="Confirm"
        description={
          <ul>
            <li>Every task is removed</li>
            <li>This cannot be undone</li>
          </ul>
        }
      />,
    )
    const list = screen.getByRole('list')
    expect(screen.getByRole('dialog').getAttribute('aria-describedby')).toBe(list.parentElement?.id)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  test('renders into a portal attached to the body, outside the React root', () => {
    const { container } = render(<ModalHarness title="Confirm" />)
    const dialog = screen.getByRole('dialog')
    expect(container.contains(dialog)).toBe(false)
    expect(document.body.contains(dialog)).toBe(true)
  })

  describe('closing', () => {
    test('the close icon closes the modal', async () => {
      const onOpenChange = vi.fn()
      render(<ModalHarness title="Confirm" onOpenChange={onOpenChange} />)
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    test('the cancel button closes the modal', async () => {
      render(<ModalHarness title="Confirm" />)
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    test('Escape closes the modal', async () => {
      render(<ModalHarness title="Confirm" />)
      await userEvent.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    test('Escape does nothing when isClosedOnEscape is false', async () => {
      render(<ModalHarness title="Confirm" isClosedOnEscape={false} />)
      await userEvent.keyboard('{Escape}')
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('a mousedown on the backdrop closes the modal', () => {
      render(<ModalHarness title="Confirm" />)
      fireEvent.mouseDown(getBackdrop())
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    test('a mousedown started inside the panel does not close the modal', () => {
      render(<ModalHarness title="Confirm" />)
      fireEvent.mouseDown(screen.getByRole('dialog'))
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('a mousedown released on the backdrop after starting inside does not close the modal', () => {
      render(
        <ModalHarness title="Confirm">
          <p>Body</p>
        </ModalHarness>,
      )
      fireEvent.mouseDown(screen.getByText('Body'))
      fireEvent.mouseUp(getBackdrop())
      fireEvent.click(getBackdrop())
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('the backdrop does nothing when isClosedOnBackdropClick is false', () => {
      render(<ModalHarness title="Confirm" isClosedOnBackdropClick={false} />)
      fireEvent.mouseDown(getBackdrop())
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('isCloseIconHidden removes the close icon', () => {
      render(<ModalHarness title="Confirm" isCloseIconHidden />)
      expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    })

    test('a custom onCancel replaces the default closing behaviour', async () => {
      const onCancel = vi.fn()
      render(<ModalHarness title="Confirm" actions={{ onCancel }} />)
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(onCancel).toHaveBeenCalled()
      expect(screen.getByRole('dialog')).toBeDefined()
    })
  })

  describe('submitting', () => {
    test('the submit button calls onSubmit', async () => {
      const onSubmit = vi.fn()
      render(<ModalHarness title="Confirm" onSubmit={onSubmit} />)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(onSubmit).toHaveBeenCalled()
    })

    test('the modal closes after a successful submit', async () => {
      render(<ModalHarness title="Confirm" onSubmit={() => Promise.resolve()} />)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    })

    test('isClosedOnSubmit false keeps the modal open after a successful submit', async () => {
      render(<ModalHarness title="Confirm" isClosedOnSubmit={false} onSubmit={() => Promise.resolve()} />)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('a read-only modal closes on submit without any onSubmit handler', async () => {
      render(<ModalHarness title="Details" />)
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    })

    test('isSubmitButtonHidden removes the submit button', () => {
      render(<ModalHarness title="Confirm" actions={{ isSubmitButtonHidden: true }} />)
      expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
    })

    test('showCancel false removes the cancel button', () => {
      render(<ModalHarness title="Confirm" actions={{ showCancel: false }} />)
      expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    })

    test('custom labels are used', () => {
      render(<ModalHarness title="Confirm" actions={{ submitLabel: 'Delete', cancelLabel: 'Keep' }} />)
      expect(screen.getByRole('button', { name: 'Delete' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Keep' })).toBeDefined()
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

    const readHttpStatus = (error: Error) => (error instanceof HttpError ? String(error.response.status) : null)

    test('the error prop is displayed in an alert', () => {
      render(<ModalHarness title="Confirm" error="The server is unreachable" />)
      expect(screen.getByText('The server is unreachable')).toBeDefined()
    })

    test('a rejected submit whose status is mapped shows the mapped message', async () => {
      render(
        <ModalHarness
          title="Confirm"
          onSubmit={() => Promise.reject(new HttpError(409))}
          getSubmitErrorStatus={readHttpStatus}
          submitErrorMessages={{ 409: 'This resource already exists' }}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText('This resource already exists')).toBeDefined()
    })

    test('the modal stays open when the submit fails', async () => {
      render(
        <ModalHarness
          title="Confirm"
          onSubmit={() => Promise.reject(new HttpError(409))}
          getSubmitErrorStatus={readHttpStatus}
          submitErrorMessages={{ 409: 'This resource already exists' }}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await screen.findByText('This resource already exists')
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('onUnhandledSubmitError receives the errors the mapping did not cover', async () => {
      const onUnhandledSubmitError = vi.fn()
      const unmapped = new HttpError(503)
      render(
        <ModalHarness
          title="Confirm"
          onSubmit={() => Promise.reject(unmapped)}
          getSubmitErrorStatus={readHttpStatus}
          submitErrorMessages={{ 409: 'This resource already exists' }}
          onUnhandledSubmitError={onUnhandledSubmitError}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => expect(onUnhandledSubmitError).toHaveBeenCalledWith(unmapped))
      expect(screen.getByRole('dialog')).toBeDefined()
    })

    test('defaults.modal mapping is used as a global fallback', async () => {
      render(
        <EasyUIProvider
          config={{
            defaults: {
              modal: {
                getSubmitErrorStatus: readHttpStatus,
                submitErrorMessages: { 409: 'Already there' },
              },
            },
          }}
        >
          <ModalHarness title="Confirm" onSubmit={() => Promise.reject(new HttpError(409))} />
        </EasyUIProvider>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
      expect(await screen.findByText('Already there')).toBeDefined()
    })
  })

  describe('accessibility', () => {
    test('exposes a modal dialog labelled by its title and described by its description', () => {
      render(<ModalHarness title="Confirm" description="This cannot be undone." />)
      const dialog = screen.getByRole('dialog')
      expect(dialog.getAttribute('aria-modal')).toBe('true')
      expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('Confirm').id)
      expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('This cannot be undone.').id)
    })

    test('omits aria-labelledby and aria-describedby when there is no title nor description', () => {
      render(<ModalHarness />)
      const dialog = screen.getByRole('dialog')
      expect(dialog.getAttribute('aria-labelledby')).toBeNull()
      expect(dialog.getAttribute('aria-describedby')).toBeNull()
    })

    test('moves the focus inside the modal on open', async () => {
      render(<ModalHarness initialOpen={false} title="Confirm" />)
      await userEvent.click(screen.getByRole('button', { name: 'open the modal' }))
      await waitFor(() => expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true))
    })

    test('focuses the panel itself, not the close icon', async () => {
      render(<ModalHarness initialOpen={false} title="Confirm" />)
      await userEvent.click(screen.getByRole('button', { name: 'open the modal' }))
      await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('dialog')))
    })

    test('restores the focus to the trigger on close', async () => {
      render(<ModalHarness initialOpen={false} title="Confirm" />)
      const trigger = screen.getByRole('button', { name: 'open the modal' })
      await userEvent.click(trigger)
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(document.activeElement).toBe(trigger))
    })

    test('reversing Tab from the panel wraps to the last focusable', async () => {
      render(<ModalHarness title="Confirm" />)
      await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('dialog')))
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Submit' }))
    })

    test('Tab from the last focusable wraps to the first', async () => {
      render(<ModalHarness title="Confirm" />)
      await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('dialog')))
      screen.getByRole('button', { name: 'Submit' }).focus()
      fireEvent.keyDown(document, { key: 'Tab' })
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }))
    })

    test('Tab keeps the focus on the panel when it holds nothing focusable', async () => {
      render(
        <ModalHarness title="Confirm" isCloseIconHidden actions={{ isSubmitButtonHidden: true, showCancel: false }}>
          <p>Body</p>
        </ModalHarness>,
      )
      const dialog = screen.getByRole('dialog')
      await waitFor(() => expect(document.activeElement).toBe(dialog))
      fireEvent.keyDown(document, { key: 'Tab' })
      expect(document.activeElement).toBe(dialog)
    })

    test('keeps Tab inside the modal', async () => {
      render(<ModalHarness title="Confirm" />)
      const dialog = screen.getByRole('dialog')
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    test('locks the body scroll while open and restores it on close', async () => {
      render(<ModalHarness title="Confirm" />)
      expect(document.body.style.overflow).toBe('hidden')
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'))
    })
  })

  describe('ref forwarding', () => {
    test('forwards an object ref to the dialog panel', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Modal ref={ref} isOpen onOpenChange={() => {}} title="Confirm">
          <p>Body</p>
        </Modal>,
      )
      expect(ref.current).toBe(screen.getByRole('dialog'))
    })

    test('forwards a callback ref to the dialog panel', () => {
      let node: HTMLDivElement | null = null
      render(
        <Modal ref={(element) => { node = element }} isOpen onOpenChange={() => {}} title="Confirm">
          <p>Body</p>
        </Modal>,
      )
      expect(node).toBe(screen.getByRole('dialog'))
    })
  })

  describe('presets config', () => {
    test('no preset leaves the modal unchanged', () => {
      render(<ModalHarness title="Confirm" />)
      expect(screen.getByRole('button', { name: 'Close' })).toBeDefined()
    })

    test('a preset can set props', () => {
      render(
        <EasyUIProvider config={{ presets: { modal: { bare: { props: { isCloseIconHidden: true } } } } }}>
          <ModalHarness title="Confirm" preset="bare" />
        </EasyUIProvider>,
      )
      expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    })

    test('an instance prop wins over the preset props', () => {
      render(
        <EasyUIProvider config={{ presets: { modal: { bare: { props: { isCloseIconHidden: true } } } } }}>
          <ModalHarness title="Confirm" preset="bare" isCloseIconHidden={false} />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeDefined()
    })

    test('a preset classNames replaces the global wrapper', () => {
      render(
        <EasyUIProvider
          config={{
            wrappers: { modal: { base: 'global-panel' } },
            presets: { modal: { wide: { classNames: { base: 'preset-panel' } } } },
          }}
        >
          <ModalHarness title="Confirm" preset="wide" />
        </EasyUIProvider>,
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('preset-panel')
      expect(dialog.className).not.toContain('global-panel')
    })

    test('a preset holding only props leaves the classNames alone', () => {
      render(
        <EasyUIProvider config={{ presets: { modal: { bare: { props: { size: 'sm' } } } } }}>
          <ModalHarness title="Confirm" className="instance-panel" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('dialog').className).toContain('instance-panel')
    })

    test('an unknown preset name falls back to the default rendering', () => {
      render(
        <EasyUIProvider config={{ presets: { modal: { bare: { props: { isCloseIconHidden: true } } } } }}>
          <ModalHarness title="Confirm" preset="missing" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeDefined()
    })
  })

  describe('footer', () => {
    test('a custom footer replaces the buttons entirely', () => {
      render(<ModalHarness title="Confirm" footer={<span>custom footer</span>} />)
      expect(screen.getByText('custom footer')).toBeDefined()
      expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    })
  })

  describe('styling', () => {
    test('applies className to the dialog panel', () => {
      render(<ModalHarness title="Confirm" className="custom-panel" />)
      expect(screen.getByRole('dialog').className).toContain('custom-panel')
    })

    test('applies classNames per slot', () => {
      render(
        <ModalHarness
          title="Confirm"
          description="Details"
          classNames={{
            backdrop: 'custom-backdrop',
            header: 'custom-header',
            title: 'custom-title',
            description: 'custom-description',
            closeIconButton: 'custom-close-icon',
            footer: 'custom-footer',
            submitButton: 'custom-submit',
            cancelButton: 'custom-cancel',
          }}
        >
          <p>Body</p>
        </ModalHarness>,
      )
      expect(getBackdrop().className).toContain('custom-backdrop')
      expect(screen.getByText('Confirm').className).toContain('custom-title')
      expect(screen.getByText('Details').className).toContain('custom-description')
      expect(screen.getByRole('button', { name: 'Close' }).className).toContain('custom-close-icon')
      expect(screen.getByRole('button', { name: 'Submit' }).className).toContain('custom-submit')
      expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('custom-cancel')
    })

    test('applies the body slot class to the body wrapper', () => {
      render(
        <ModalHarness title="Confirm" classNames={{ body: 'custom-body' }}>
          <p>Body</p>
        </ModalHarness>,
      )
      expect((screen.getByText('Body').parentElement as HTMLElement).className).toContain('custom-body')
    })

    test('the global wrappers config applies to the panel', () => {
      render(
        <EasyUIProvider config={{ wrappers: { modal: { base: 'global-panel' } } }}>
          <ModalHarness title="Confirm" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('dialog').className).toContain('global-panel')
    })

    test('closeIconButtonLabel from defaults config is used', () => {
      render(
        <EasyUIProvider config={{ defaults: { modal: { closeIconButtonLabel: 'Fermer' } } }}>
          <ModalHarness title="Confirm" />
        </EasyUIProvider>,
      )
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeDefined()
    })
  })
})
