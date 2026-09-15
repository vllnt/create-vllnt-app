# Landing page

The marketing page is an editorial introduction to the scaffolder, not a claim that generated applications are finished products.

## Design identity

Follow the canonical [VLLNT design guide](https://ui.vllnt.com/design.md): semantic neutral theme tokens, system sans/display/mono variables, 600-weight headings, 4-point spacing, restrained borders and radii, and Lucide icons. The existing HSL theme is retained, including its near-black dark surface: the guide bans pure black even though the published JSON token currently specifies it. `@vllnt/ui` owns Button, Textarea, and Combobox behavior. Ten preset choices use the prescribed searchable Combobox rather than a custom button grid.

## Trying the CLI

The package was unavailable on the public npm registry during this redesign. The primary action therefore copies a **source-checkout recipe**, not an `npx` command:

```sh
git clone https://github.com/vllnt/create-vllnt-app.git
cd create-vllnt-app
pnpm install
pnpm --filter create-vllnt-app build
node cli/dist/index.js new
```

Requires Git, Node.js 22+, and pnpm. Review source before installing. Run in a directory without an existing `create-vllnt-app` checkout. The last command opens interactive setup; it does not deploy an app. Preset commands run from that checkout after installation/build. Generated apps are created in the current directory and need their own dependencies, backend/auth configuration where applicable, and feature implementation.

Nine web presets plus Custom mirror `cli/src/core/presets.ts`. Custom opens the wizard; select Custom to choose sections. Next.js web presets should not be confused with the CLI's separate Expo/fullstack templates. The preview is a simplified SaaS file tree, verified against a generated scaffold, not simulated health-check output.

## Interaction contract

- Copy reports success only after the Clipboard API resolves. Pending writes disable the button; rejection or an unavailable API offers selectable-text recovery in a polite live region.
- Selecting a preset updates its complete local command and clears previous copy feedback. The labelled Combobox supports search and keyboard selection; all ten options also appear in the adjacent text catalog.
- Command text uses a read-only, keyboard-accessible Textarea. Long lines scroll horizontally rather than breaking URLs or truncating the copied value. Copy buttons have context-specific accessible names.
- Theme controls, locale routes, source links, and the manifesto remain available. The bottom CTA repeats the source recipe.
- Marketing copy lives in `messages/en.json`; English is the currently configured locale.

## Verification

```sh
pnpm --filter www lint
pnpm --filter www typecheck
pnpm --filter www build
pnpm --filter www exec playwright test --output=/tmp/vllnt-landing-review/test-results --workers=2
```

Playwright builds and starts the production page when no server is present. A separate output path preserves existing `www/test-results`. Tests cover clipboard pending/success/rejection/unavailability, preset selection, keyboard activation, 320/375/768/1440px layouts, dark/light themes, manifesto, locale routing, and console errors. Screenshots are written to `/tmp/vllnt-landing-review/after-{width}-{theme}.png` (disposable local evidence).

The coordinator captured the previous public page at `/tmp/vllnt-landing-review/before-desktop.png` and `before-mobile.png`; the old 375px page overflowed horizontally. All nine local preset scaffolds were generated with `--yes --skip-install` in `/tmp/vllnt-source-trial.5VwhTL`, with matching `vllnt.json` registries. This verifies assembly, not app feature completeness. The coordinator additionally verified dependency installation and CLI build from a clean source archive, and reproduced the old public page falsely reporting copied after clipboard rejection. The new failure-path browser tests require manual recovery instead.

A final design review caught a missing heading-weight token on the preset title. The new computed-style regression failed at all four viewport widths before the CSS correction. It now requires every landing heading to use weight 600 in both themes, matching the design guide.

The existing canonical host `create-vllnt-app.vllnt.com` matches the CLI package homepage but failed DNS in the implementation environment. It is intentionally unchanged pending owner confirmation of the production domain.
