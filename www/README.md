# Landing page

A monochrome glass introduction to the scaffolder, not a claim that generated apps are finished products.

## Design

Follow the canonical [VLLNT design guide](https://ui.vllnt.com/design.md): semantic neutral tokens, system typography, 600-weight headings, restrained borders, and Lucide icons. Translucent panels use actual 20px backdrop blur over grayscale depth, with opaque fallbacks and reduced-transparency support. Dark surfaces remain near-black, not pure black. `@vllnt/ui` owns Button, Textarea, and the searchable preset Combobox.

## CLI presentation

```sh
npx create-vllnt-app@latest new
npx create-vllnt-app@latest new --preset saas
```

Node.js 22+ is required. **Publication is pending:** the public npm registry returned HTTP 404 during this revision. These are the intended published CLI commands, not evidence of a successful npm installation. The page retains the requested commands alongside an availability note.

Nine web presets plus Custom mirror the CLI preset definitions. Custom opens the interactive wizard; choose Custom to select sections. The CLI asks for a project name and preferences. Generated apps still need dependencies, backend/auth configuration where applicable, feature implementation, and review. The illustrated SaaS file tree is simplified, not simulated test output.

## Interaction contract

- Copy succeeds only after the Clipboard API resolves. Pending writes disable the button; rejection or an unavailable API offers selectable-text recovery in a live region.
- Preset changes update the complete `npx create-vllnt-app@latest new --preset <id>` command and reset copy feedback. Custom uses the base `new` command.
- Read-only labelled command fields allow keyboard selection and horizontal scrolling without altering copied text.
- Theme controls, locale routes, source links, and manifesto navigation remain available. The bottom CTA repeats the `npx` command.
- Marketing copy lives in `messages/en.json`.

## Verification

```sh
pnpm --filter www lint
pnpm --filter www typecheck
pnpm --filter www build
pnpm --filter www exec playwright test --output=/tmp/vllnt-glass-review/test-results --workers=2
```

Playwright builds and starts the production page if no server is present. The separate output path preserves existing `www/test-results`. Tests cover clipboard pending/success/rejection/unavailability, all ten preset choices, keyboard activation, 320/375/768/1440px layouts, actual glass styles, dark/light themes, navigation, locale routing, and console errors. Screenshots: `/tmp/vllnt-glass-review/after-{width}-{theme}.png` (disposable review evidence).
