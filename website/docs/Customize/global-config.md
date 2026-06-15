# Global configuration

You might want your components to share the same look, without repeating the same `classNames` on each component instance. 
`EasyUIProvider` lets you declare those defaults once, at the root of your app.

To override the underlying colors, radius and border widths instead, see the [theming guide](./theming.md).

## Setup

Wrap your application with `EasyUIProvider` and pass it a config object:

```tsx
import { EasyUIProvider } from '@easy-ui-react/easy-ui-react'

export function App() {
  return (
    <EasyUIProvider config={{
      wrappers: {
        button: {
          base: 'font-semibold rounded-xl',
        },
      },
    }}>
      {/* ... */}
    </EasyUIProvider>
  )
}
```

Without a provider, components render exactly as if no config existed.

## Define the config with `defineConfig`

Get the config in its own file and use `defineConfig` for autocompletion and type-checking, the same way you would with `vite.config.ts`:

```ts
// easyui.config.ts
import { defineConfig } from '@easy-ui-react/easy-ui-react'

export default defineConfig({
  wrappers: {
    button: {
      base: 'font-semibold rounded-xl',
      label: 'text-sm uppercase',
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

## Wrappers shape

`wrappers` has one optional key per component, named after the component.
For example, the `Button` component has the `button` wrapper.
Each key accepts the same slots as that component's `classNames` prop. 
see [Button's slots](../Components/Primitives/button.mdx#slots) for the full list.

```ts
{
  wrappers: {
    button: {
      base: '...',
      startContent: '...',
      endContent: '...',
      text: '...',
      spinner: '...',
      label: '...',
      description: '...'
    }
  }
}
```

## Classes conflict

For a given slot, classes are merged following these conditions:
- Use the component global wrapper slots (no effects if there is no wrappers configured for the component):
  - If no component instance slots are specified, then the global wrapper applies.
- Using the component instance slots and component global slots:
  - If both configs are sharing the same slot and there is no any classes conflict, then, they are merged.
  - If both configs are sharing the same slot and there is a class conflict, then the instance class overrides the global one.
  - If both configs do not share the same slots, then slots are merged.

**This means a global wrapper acts as a default that any single instance can still override locally.**

```tsx
<EasyUIProvider config={{ wrappers: { button: { base: 'bg-primary' } } }}>
  {/* uses bg-primary from the global config */}
  <Button>Save</Button>

  {/* overrides the background for this instance only */}
  <Button classNames={{ base: 'bg-white' }}>Delete</Button>

  {/* add additional classes to the slot. Here both bg-primary and border-red-500 are used. */}
  <Button classNames={{ base: 'border-red-500' }}>Delete</Button>

  {/* add additional slot. Here both base and text slots are used. */}
  <Button classNames={{ text: 'text-white' }}>Delete</Button>
</EasyUIProvider>
```

## Extensibility

`wrappers` is designed to grow: 
- as new components adopt the `classNames`slots pattern, they get their own optional key (`wrappers.input`, `wrappers.selector`, ...) into the wrapper config following the same rules described above.
