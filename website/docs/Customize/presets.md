# Presets

Beyond a single global look (see [global configuration](./global-config.md)), you'll often reuse a handful of *roles*
for a component. (a primary button, or a close button for example.). Each with its own classNames and props like color and variants.
Repeating those props and classes on every instance make your code easy to be inconsistent and require you to think about configuration on every component instance.

`presets` let you configure those roles once, then apply one with a single `preset` prop.

## Setup

Declare named presets per component in the `EasyUIProvider` config, then activate one with the `preset` prop:

```tsx
import { EasyUIProvider } from '@easy-ui-react/easy-ui-react'

export function App() {
  return (
    <EasyUIProvider config={{
      presets: {
        button: {
          primary: {
            props: { variant: 'solid', color: 'primary' },
            classNames: { base: 'font-semibold' },
          },
          cancel: {
            props: { variant: 'light', color: 'default' },
          },
          filter: {
            props: { variant: 'outlined', color: 'default' },
            classNames: { base: 'rounded-full' },
          },
        },
      },
    }}>
      {/* ... */}
    </EasyUIProvider>
  )
}
```

```tsx
<Button preset="primary">Save</Button>
<Button preset="cancel">Cancel</Button>
<Button preset="filter">Active only</Button>
```

If `preset` is not set, or set to a name that isn't configured, the component renders exactly as it would without
`presets` configured at all. In that case, [the global wrapper](./global-config.md) still applies normally.

## Preset shape

Each preset entry has up to three optional keys:
- `props`: any prop the component accepts, except `children`, `className`, `classNames` and `preset` itself.
- `className`: extra classes for the component's root (`base`) element, just like the instance `className` prop.
- `classNames`: the same slots as the component's `classNames` prop / `wrappers` entry.

```ts
{
  presets: {
    button: {
      primary: {
        props: { variant: 'solid', color: 'primary' },
        className: 'font-semibold',
        classNames: {
          base: '...',
          startContent: '...',
          endContent: '...',
          text: '...',
          spinner: '...',
          label: '...',
          description: '...',
        },
      },
    },
  },
}
```

## Precedence

### Props

For each prop, the first of these that is defined wins:

1. The prop set explicitly on the component instance.
2. The preset's `props`.
3. The component's default prop.

```tsx
<EasyUIProvider config={{
  presets: { button: { primary: { props: { variant: 'solid', color: 'primary' } } } },
}}>
  {/* variant: solid, color: primary from the preset */}
  <Button preset="primary">Save</Button>

  {/* variant: outlined (instance wins), color: primary (from the preset) */}
  <Button preset="primary" variant="outlined">Save</Button>
</EasyUIProvider>
```

### classNames

When `preset` resolves to a configured entry, its `className` / `classNames` **entirely replace**
[the global `wrappers` config](./global-config.md) for that instance, for every slot, including slots the preset
doesn't define. The global wrapper is not merged in at all. Instance `className` / `classNames` are following the same 
[class conflict rules](./global-config.md#classes-conflict) as `wrappers`.

For the `base` slot specifically, the preset's `className` and `classNames.base` are combined the same way the
instance's `className` and `classNames.base` are:
- on a conflict, `className` wins over `classNames.base`.

The order, from lowest to highest priority, is: 
- global `classNames.base` < global `className` < preset `classNames.base` < preset `className` < instance `classNames.base` < instance `className`.

```tsx
<EasyUIProvider config={{
  wrappers: { button: { base: 'bg-primary', spinner: 'animate-pulse' } },
  presets: { button: { primary: { className: 'font-bold', classNames: { base: 'bg-accent' } } } },
}}>
  {/* no preset: the global wrapper applies as usual */}
  <Button>Save</Button>

  {/* preset active: base uses both bg-accent and font-bold (from the preset, not bg-primary), and the
      spinner slot gets no class at all since the global wrapper is ignored entirely */}
  <Button preset="primary" loading>Save</Button>

  {/* preset active with an instance override: base becomes bg-white (font-bold still applies), following
      the "instance-wins-on-conflict" rule */}
  <Button preset="primary" classNames={{ base: 'bg-white' }}>Save</Button>
</EasyUIProvider>
```

## Extensibility

`presets` follows the same pattern as `wrappers`: as new components adopt the `classNames` slots pattern, they get
their own optional key (`presets.input`, `presets.selector`, ...), with `props` covering every prop of that component
except `children`, `className`, `classNames` and `preset`.
