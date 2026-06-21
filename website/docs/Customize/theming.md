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

## Default values

```css
:root {
  --easyui-color-background: light-dark(#ffffff, #09090b);
  --easyui-color-foreground: light-dark(#18181b, #f4f4f5);
  --easyui-color-default: light-dark(#d7d7dd, #4e4e52);
  --easyui-color-default-foreground: light-dark(#18181b, #f4f4f5);
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

`--easyui-color-background` and `--easyui-color-foreground` are applied to `body` as `background-color`/`color`. They're independent from `--easyui-color-default`, which styles the `default` component variant, not the page itself.

## Dark mode

EasyUI ships a default dark mode using the native [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) CSS function.

```css
:root {
  color-scheme: light dark; /* follow the OS by default */
}

[data-theme='dark'] {
  color-scheme: dark; /* explicit override */
}

[data-theme='light'] {
  color-scheme: light; /* explicit override */
}
```

- **Automatic**: `color-scheme: light dark` on `:root` defers to the visitor's OS setting (`prefers-color-scheme`).
- **Explicit**: setting `data-theme="dark"` (or `"light"`) on any ancestor element (usually `<html>`) pins `color-scheme` to one side, overriding the OS preference. This is what a manual theme toggle should set.

Only these variables use `light-dark()`:
- `--easyui-color-background`
- `--easyui-color-foreground`
- `--easyui-color-default`
- `--easyui-color-default-foreground`
- the `-dark` shade of each accent color

The accent colors themselves stay the same in both modes, since they're already contrasted enough for both backgrounds.

To override the dark palette, redeclare the variable's `light-dark()` call on `:root`. there's no separate dark-mode block to keep in sync between the OS preference and an explicit theme setting.

```css
:root {
  --easyui-color-default: light-dark(#f3f4f6, #1f2937);
  --easyui-color-default-foreground: light-dark(#111827, #e5e7eb);
}
```

### Custom themes beyond light/dark

You may want to add themes beyond light and dark. To do this, redeclare the variables on your own selector. It overrides any other light or dark value. Note that you can't use `light-dark()` here, since it only picks between light and dark.

```css
[data-theme='custom-theme'] {
  --easyui-color-background: #f4ecd8;
  --easyui-color-foreground: #5b4636;
  --easyui-color-default: #e3d5b8;
  --easyui-color-default-foreground: #5b4636;
}
```

### Focus ring

Color of the `focus-visible` outline on interactive elements. Defaults to `--easyui-color-primary`.

```css
:root {
  --easyui-color-focus-ring: var(--easyui-color-primary);
}
```

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

`--easyui-border-width-md` is used by the `outlined` variant's border.

```css
:root {
  --easyui-border-width-sm: 1px;
  --easyui-border-width-md: 2px;
  --easyui-border-width-lg: 3px;
}
```

## Scoping overrides

These are plain CSS custom properties, so they cascade like any other. Scope variables on a more specific selector instead of `:root`:

```css
.compact-section {
  --easyui-radius-sm: 4px;
  --easyui-radius-md: 6px;
}
```
