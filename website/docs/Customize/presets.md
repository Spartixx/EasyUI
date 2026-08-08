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

### Nested objects

Props that hold an object — `actions`, `formProps`, `fieldProps`, `classNames` — are merged **key by key**, as deep
as the objects go, instead of one replacing the other. Only the keys the instance actually sets are overridden:

```tsx
<EasyUIProvider config={{
  presets: {
    form: { admin: { props: { actions: { submitLabel: 'Save', submitProps: { color: 'secondary' } } } } },
  },
}}>
  {/* submitLabel: 'Save' and color: 'secondary' both survive, only cancelLabel is added */}
  <Form preset="admin" actions={{ cancelLabel: 'Back' }} form={form} onSubmit={onSubmit} />

  {/* submitLabel: 'Save' survives, color becomes 'error' */}
  <Form preset="admin" actions={{ submitProps: { color: 'error' } }} form={form} onSubmit={onSubmit} />
</EasyUIProvider>
```

Anything that is not a plain object is replaced rather than merged: arrays (`options`, `validations`), React nodes
(`startContent`, `arrow`) and functions (`onCancel`, `getSubmitErrorStatus`).

Setting a prop to `undefined` on the instance does not erase the value of the preset — it reads as "not set here".

### Action buttons of `Form` and `Modal`

The submit and cancel buttons have their own default color and variant, which sit **below** a `button` preset
set through `actions.submitProps` / `actions.cancelProps`. For those two props only, the order from highest to
lowest priority is:

1. `actions.submitProps` / `actions.cancelProps`.
2. The `variant` / `color` of the `Form` or `Modal`.
3. The `button` preset named by `actions.submitProps.preset` / `actions.cancelProps.preset`.
4. The default of the footer: `primary` / `solid` for submit, `default` / `light` for cancel.

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

## Styling every field of a `Form`

`variant` and `color` cascade from the `Form` to its fields, but they are single values shared with the action
buttons. To configure the fields themselves, use `fieldProps`: one entry per field type, applied to every field of
that type.

```tsx
<EasyUIProvider config={{
  presets: {
    form: {
      compact: {
        props: {
          fieldProps: {
            input: { size: 'sm', variant: 'bordered' },
            selector: { size: 'sm', variant: 'bordered' },
            number: { size: 'sm' },
            autocomplete: { size: 'sm' },
            inputsGroup: { addButtonPlacement: 'full-width' },
          },
        },
      },
    },
  },
}}>
  <Form preset="compact" form={form} onSubmit={onSubmit} />
</EasyUIProvider>
```

`fieldProps` is also a regular prop of `Form`, usable without any preset. It accepts every prop of the matching
primitive except the ones the form itself drives (`value`, `onValueChange`, `error`, `label`, `isDisabled`,
`isFormControlled`, `name`, `className`).

### Against the props of a single field

The `props` of a field, declared in the `fields` object given to `useForm`, win over `fieldProps`.

A `preset` on a field is stronger than that: it takes that field **out of `fieldProps` entirely**, rather than
layering on top of it. The field then follows its own preset alone, and nothing from the form leaks in.

```tsx
const fields = {
  name: { type: 'input', label: 'Name' },
  // ignores fieldProps.input completely, and uses presets.input.hero instead
  headline: { type: 'input', label: 'Headline', props: { preset: 'hero' } },
} satisfies FormFields
```

## `FormModal`

A `FormModal` resolves its own `presets.formModal` entry — not `presets.modal`. One name therefore configures the
modal shell, its action buttons and the fields of the form it wraps:

```tsx
<EasyUIProvider config={{
  presets: {
    formModal: {
      delete: {
        props: {
          size: 'sm',
          actions: { submitLabel: 'Delete', submitProps: { color: 'error' } },
          formProps: { fieldProps: { input: { size: 'sm' } } },
        },
        classNames: { title: 'text-(--easyui-color-error)' },
      },
    },
  },
}}>
  <FormModal
    preset="delete"
    form={form}
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Delete this user"
    formProps={{ onSubmit: deleteUser }}
  />
</EasyUIProvider>
```

### Naming other presets instead of repeating props

Rather than restating `variant` and `color` in every `formModal` entry, point at the `button` and field presets you
already declared. `actions.submitProps.preset` and `fieldProps.<type>.preset` are ordinary props, so they resolve
the same way they would on a standalone `<Button>` or `<Input>`:

```tsx
presets: {
  button: {
    danger: { props: { variant: 'solid', color: 'error' }, classNames: { base: 'font-semibold' } },
    ghost: { props: { variant: 'light', color: 'default' } },
  },
  input: { compact: { props: { size: 'sm', variant: 'bordered' } } },
  selector: { compact: { props: { size: 'sm', variant: 'bordered' } } },

  formModal: {
    delete: {
      props: {
        size: 'sm',
        actions: {
          submitLabel: 'Delete',
          submitProps: { preset: 'danger' },
          cancelProps: { preset: 'ghost' },
        },
        formProps: {
          fieldProps: { input: { preset: 'compact' }, selector: { preset: 'compact' } },
        },
      },
    },
  },
}
```

One rule to keep in mind: a `variant` or `color` set at the top level of the `formModal` preset **wins over** the
button preset named in `actions` (see the precedence order above). Leave them out when you want the button preset
to decide.

### Slots

`classNames` at the top level of the preset addresses the slots of the modal; everything that belongs to the form
goes under `props.formProps`, including its own `className` and `classNames`.

`props.formProps` cannot set `variant`, `color`, `isDisabled` or `actions`: those cascade from the `FormModal` to
both halves, so they are set at the top level of the preset instead. It cannot set `onSubmit` either, which is
required and belongs to the instance.

A `FormModal` renders a `Modal`, so `wrappers.modal` still applies to it, with `wrappers.formModal` and the
`formModal` preset layering on top.

## Extensibility

`presets` follows the same pattern as `wrappers`: as new components adopt the `classNames` slots pattern, they get
their own optional key (`presets.input`, `presets.selector`, ...), with `props` covering every prop of that component
except `children`, `className`, `classNames` and `preset`.
