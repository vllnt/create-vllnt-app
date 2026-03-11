# Theming

## Tailwind CSS v4

This project uses Tailwind CSS v4 with the new CSS-first configuration.

## Setup

Global styles in `app/globals.css`:

```css
@import 'tailwindcss';
```

## Customization

### Colors

Define custom colors using CSS custom properties:

```css
@theme {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;
}
```

### Dark Mode

Tailwind v4 supports dark mode via `dark:` variant:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Content</p>
</div>
```

### Typography

Use Tailwind's built-in typography utilities:

```tsx
<h1 className="text-4xl font-bold tracking-tight">Title</h1>
<p className="text-base text-gray-600 leading-relaxed">Body</p>
```

## Component Styling

- Use Tailwind utility classes directly
- Use `cn()` from `@/lib/utils` for conditional classes
- Avoid CSS modules or styled-components — Tailwind is the styling system

```tsx
import { cn } from '@/lib/utils'

function Button({ variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 font-medium',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-secondary text-white',
        className,
      )}
      {...props}
    />
  )
}
```
