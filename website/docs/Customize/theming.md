# Theming

EasyUI styles its components using tailwind and custom CSS properties declared on `:root`, (such as radius, border widths and colors) all prefixed with `--easyui-`.
Override these variables in your own CSS to retheme every component at once. No `classNames`, no `EasyUIProvider` config, nothing to rebuild.

For per-component, per-slot class overrides instead, see the [global configuration guide](./global-config.md).

## Overriding variables

Redeclare the variables you want to change on `:root`, in a stylesheet loaded after EasyUI's styles:

```css
:root {
  --easyui-color-primary: #7c3aed;
  --easyui-color-primary-foreground: #ffffff;
}
```

Both declarations target `:root` with the same specificity, so the one loaded last wins. 
Every component reading `--easyui-color-primary` will use the new value.

## Default values:

```css
:root {
  --easyui-color-default: #d7d7dd;
  --easyui-color-default-foreground: #18181b;
  --easyui-color-primary: #1c5eca;
  --easyui-color-primary-foreground: #ffffff;
  --easyui-color-secondary: #5e2bd4;
  --easyui-color-secondary-foreground: #ffffff;
  --easyui-color-success: #11ab3c;
  --easyui-color-success-foreground: #ffffff;
  --easyui-color-warning: #da820d;
  --easyui-color-warning-foreground: #ffffff;
  --easyui-color-error: #d61515;
  --easyui-color-error-foreground: #ffffff;
}
```

`--easyui-color-{name}-dark` defaults to `color-mix(in srgb, var(--easyui-color-{name}) 70%, black)`, so it follows `--easyui-color-{name}` automatically. 
Override it directly only if the `flat` variant needs a different shade.

### Focus ring

```css
:root {
  --easyui-color-focus-ring: var(--easyui-color-primary);
}
```

Color of the `focus-visible` outline on interactive elements. Defaults to `--easyui-color-primary`.

## Radius

Used by the `radius` prop's `sm` / `md` / `lg` values (`none` and `full` always map to `rounded-none` / `rounded-full`):

```css
:root {
  --easyui-radius-sm: 8px;
  --easyui-radius-md: 12px;
  --easyui-radius-lg: 14px;
}
```

## Border width

```css
:root {
  --easyui-border-width-sm: 1px;
  --easyui-border-width-md: 2px;
  --easyui-border-width-lg: 3px;
}
```

`--easyui-border-width-md` is used by the `outlined` variant's border.

## Scoping overrides

These are plain CSS custom properties, so they cascade like any other. Scope variables on a more specific selector instead of `:root`:

```css
[data-theme='dark'] {
  --easyui-color-default: #27272a;
  --easyui-color-default-foreground: #f4f4f5;
}
```
