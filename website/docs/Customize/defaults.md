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
    },
    selector: {
      noResultsMessage: 'No option available',
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

| Key                            | Type     | Applies to                                     | Built-in fallback         |
|--------------------------------|----------|------------------------------------------------|---------------------------|
| `requiredMessage`              | `string` | Every field (`Input`, `InputNumber`, `Selector`, `Autocomplete`, `Form`) | `'This field is required'` |
| `autocomplete.noResultsMessage`| `string` | `Autocomplete`                                 | `'No results found'`      |
| `selector.noResultsMessage`    | `string` | `Selector`                                     | `'No results found'`      |

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

## `selector.noResultsMessage`

The message the `Selector` listbox shows when the `options` list is empty. The instance
`noResultsMessage` prop overrides it.

```tsx
<EasyUIProvider config={{ defaults: { selector: { noResultsMessage: 'No option available' } } }}>
  <Selector options={[]} />
</EasyUIProvider>
```

## Extensibility

`defaults` is designed to grow: as components gain configurable built-in values, they get their own key
(a flat key for cross-component values like `requiredMessage`, or a component-named group like `autocomplete`),
following the same instance-overrides-default rule.
