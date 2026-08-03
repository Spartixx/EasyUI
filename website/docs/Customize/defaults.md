# Defaults

Some components display built-in text, like the required-field message or the "No results found" text of an
[Autocomplete](../Components/Primitives/autocomplete.mdx). `defaults` lets you override those built-in values once,
at the root of your app, instead of repeating the same prop on every instance.

Unlike [wrappers](./global-config.md) (which set default classes) and [presets](./presets.md) (which set default
props and classes for a named role), `defaults` sets fallback **values** a component uses when the matching prop is
not provided on the instance.

## Setup

`defaults` is a key of the `EasyUIProvider` config, alongside `wrappers` and `presets`:

```ts
// easyui.config.ts
import { defineConfig } from '@easy-ui-react/easy-ui-react'

export default defineConfig({
  defaults: {
    requiredMessage: 'This field is mandatory',
    autocomplete: {
      noResultsMessage: 'Nothing found',
      isInputClearedOnFocus: true,
    },
    selector: {
      noResultsMessage: 'No option available',
    },
    inputsGroup: {
      addLabel: 'Add another',
    },
    alert: {
      closeButtonLabel: 'Dismiss',
    },
    modal: {
      closeIconButtonLabel: 'Fermer',
      getSubmitErrorStatus: (error) => (axios.isAxiosError(error) ? String(error.response?.status) : null),
      submitErrorMessages: {
        409: 'This resource already exists',
      },
    },
    form: {
      loadingMessage: 'Loading the form…',
      disabledMessage: 'This form is currently locked',
      getSubmitErrorStatus: (error) => (axios.isAxiosError(error) ? String(error.response?.status) : null),
      submitErrorMessages: {
        409: 'This resource already exists',
        500: 'Server error, please try again',
      },
    },
  },
})
```

```tsx
import { EasyUIProvider } from '@easy-ui-react/easy-ui-react'
import config from './easyui.config'

export function App() {
  return <EasyUIProvider config={config}>{/* ... */}</EasyUIProvider>
}
```

Without a provider (or with the key left unset), each component falls back to its own built-in value.

## Shape

| Key                                  | Type                               | Applies to                                                               | Built-in fallback          |
|--------------------------------------|------------------------------------|--------------------------------------------------------------------------|----------------------------|
| `requiredMessage`                    | `string`                           | Every field (`Input`, `InputNumber`, `Selector`, `Autocomplete`, `Form`) | `'This field is required'` |
| `autocomplete.noResultsMessage`      | `string`                           | `Autocomplete`                                                           | `'No results found'`       |
| `autocomplete.isInputClearedOnFocus` | `boolean`                          | `Autocomplete`                                                           | `false`                    |
| `selector.noResultsMessage`          | `string`                           | `Selector`                                                               | `'No results found'`       |
| `inputsGroup.addLabel`               | `string`                           | `InputsGroup`                                                            | `'Add'`                    |
| `alert.closeButtonLabel`             | `string`                           | `Alert`                                                                  | `'Close'`                  |
| `modal.closeIconButtonLabel`         | `string`                           | `Modal`, `FormModal`                                                     | `'Close'`                  |
| `modal.getSubmitErrorStatus`         | `(error: Error) => string \| null` | `Modal`                                                                  | —                          |
| `modal.submitErrorMessages`          | `Record<string \| number, string>` | `Modal`                                                                  | —                          |
| `form.loadingMessage`                | `string`                           | `Form`                                                                   | —                          |
| `form.disabledMessage`               | `string`                           | `Form`                                                                   | —                          |
| `form.getSubmitErrorStatus`          | `(error: Error) => string \| null` | `Form`                                                                   | —                          |
| `form.submitErrorMessages`           | `Record<string \| number, string>` | `Form`                                                                   | —                          |

## `requiredMessage`

The message shown when a required field is left empty. It applies both to a field used on its own and to a field
rendered by a `Form`. An instance always wins over the default:

- standalone primitive: `isRequiredMessage` prop → `defaults.requiredMessage` → built-in;
- inside a `Form`: the field's `isRequiredMessage` (in its definition) → `defaults.requiredMessage` → built-in.

```tsx
<EasyUIProvider config={{ defaults: { requiredMessage: 'This field is mandatory' } }}>
  {/* shows "This field is mandatory" when left empty */}
  <Input label="Email" isRequired />

  {/* overrides the default for this instance only */}
  <Input label="Name" isRequired isRequiredMessage="A name is needed" />
</EasyUIProvider>
```

## `autocomplete.noResultsMessage`

The message the `Autocomplete` listbox shows when no option matches the typed text. The instance
`noResultsMessage` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { autocomplete: { noResultsMessage: 'Nothing found' } } }}>
  <Autocomplete options={options} />
</EasyUIProvider>
```

## `autocomplete.isInputClearedOnFocus`

Whether focusing an `Autocomplete` empties its input so the user can type a new search immediately.

```tsx
<EasyUIProvider config={{ defaults: { autocomplete: { isInputClearedOnFocus: true } } }}>
  <Autocomplete options={options} defaultValue="apple" />
  <Autocomplete options={options} defaultValue="apple" isInputClearedOnFocus={false} />
</EasyUIProvider>
```

See [Clear on focus](../Components/Primitives/autocomplete.mdx#clear-on-focus) for the full behaviour.

## `selector.noResultsMessage`

The message the `Selector` listbox shows when the `options` list is empty. The instance
`noResultsMessage` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { selector: { noResultsMessage: 'No option available' } } }}>
  <Selector options={[]} />
</EasyUIProvider>
```

## `inputsGroup.addLabel`

The label of the [`InputsGroup`](../Components/Advanced/inputsGroup.mdx) add button. The instance
`addButtonLabel` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { inputsGroup: { addLabel: 'Add another' } } }}>
  <InputsGroup label="Tags" initialValues={[{ value: '' }]} />
</EasyUIProvider>
```

## `alert.closeButtonLabel`

The accessible label of the [`Alert`](../Components/Primitives/alert.mdx) close button, rendered when `isClosable`
is set. The button shows an icon only, so this label is what screen readers announce. The instance
`closeButtonLabel` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { alert: { closeButtonLabel: 'Dismiss' } } }}>
  {/* the close button is announced as "Dismiss" */}
  <Alert isClosable title="Update available" />

  {/* overrides the default for this instance only */}
  <Alert isClosable closeButtonLabel="Hide this notice" title="Maintenance tonight" />
</EasyUIProvider>
```

## `modal.closeIconButtonLabel`

The accessible label of the close icon in the top-right corner of a [`Modal`](../Components/Advanced/modal.mdx).
The button shows an icon only, so this label is what screen readers announce. The instance
`closeIconButtonLabel` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { modal: { closeIconButtonLabel: 'Fermer' } } }}>
  {/* the close icon is announced as "Fermer" */}
  <Modal isOpen={isOpen} onOpenChange={setIsOpen} title="Confirm" />

  {/* overrides the default for this instance only */}
  <Modal isOpen={isOpen} onOpenChange={setIsOpen} title="Confirm" closeIconButtonLabel="Dismiss" />
</EasyUIProvider>
```

## `modal.getSubmitErrorStatus` and `modal.submitErrorMessages`

The `Modal` counterpart of the `form.*` keys of the same name: together they turn a rejected `onSubmit` into a
message shown in an alert inside the modal, so no modal needs its own `try/catch`. `getSubmitErrorStatus` turns
the error into a key, `submitErrorMessages` maps that key to a message. The instance props of the same name
override them, and a modal keeps its `onUnhandledSubmitError` for whatever the mapping does not cover.

The two groups are kept separate because a `Modal` and a `Form` do not necessarily submit through the same client.

```tsx
<EasyUIProvider
  config={{
    defaults: {
      modal: {
        getSubmitErrorStatus: (error) => (axios.isAxiosError(error) ? String(error.response?.status) : null),
        submitErrorMessages: { 409: 'This resource already exists' },
      },
    },
  }}
>
  <Modal isOpen={isOpen} onOpenChange={setIsOpen} title="Confirm" onSubmit={() => api.remove(id)} />
</EasyUIProvider>
```

## `form.loadingMessage` and `form.disabledMessage`

Both replace the form **description** while it is loading its resources (`isLoading`) or disabled (`isDisabled`),
loading winning if both apply. The instance props of the same name override them.

```tsx
<EasyUIProvider config={{ defaults: { form: { loadingMessage: 'Loading the form…' } } }}>
  {/* shows "Loading the form…" instead of its description */}
  <Form form={form} onSubmit={onSubmit} description="Fill in your details" isLoading />
</EasyUIProvider>
```

## `form.getSubmitErrorStatus` and `form.submitErrorMessages`

Together they turn a failed submission into a message, so no form needs its own `try/catch`.
`getSubmitErrorStatus` reads a status code out of the error your `onSubmit` threw, and `submitErrorMessages` maps that
code to the text shown in the form's alert. The instance props of the same name override them — see
[submission errors](../Components/Advanced/form.mdx#mapping-status-codes-to-messages) for the full behaviour.

Reading the status belongs here rather than on each form: it depends on the shape of your errors, which rarely varies
across an application.

```tsx
<EasyUIProvider
  config={{
    defaults: {
      form: {
        getSubmitErrorStatus: (error) => (axios.isAxiosError(error) ? String(error.response?.status) : null),
        submitErrorMessages: {
          409: 'This resource already exists',
          500: 'Server error, please try again',
        },
      },
    },
  }}
>
  {/* uses both generic messages */}
  <Form form={form} onSubmit={onSubmit} />

  {/* says something more precise about 500, and still inherits the global 409 */}
  <Form form={form} onSubmit={onSubmit} submitErrorMessages={{ 500: 'Your invoice could not be issued' }} />
</EasyUIProvider>
```

`submitErrorMessages` is the only key on this page that is **merged** with its instance counterpart rather than
replaced: a form overrides the codes it cares about and inherits the rest.

Here `getSubmitErrorStatus` receives a plain `Error`, because the form calls it with whatever was thrown and cannot
promise anything more precise. Narrow it inside the function with a type guard rather than a cast, as above: an error
of another shape then returns `null` and is treated as unmapped, instead of crashing on a missing property.

## Extensibility

`defaults` is designed to grow: as components gain configurable built-in values, they get their own key
(a flat key for cross-component values like `requiredMessage`, or a component-named group like `autocomplete`),
following the same instance-overrides-default rule.
