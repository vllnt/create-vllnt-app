# Landing page

A compact, monochrome glass introduction to the CLI: choose a goal, inspect its route skeletons, copy one command. It does not represent a finished app.

## Design and research applied

Read the full canonical [VLLNT design guide](https://ui.vllnt.com/design.md): semantic neutral tokens, system typography, 600-weight headings, restrained borders, and Lucide icons. `@vllnt/ui` owns Button, Textarea and the searchable Combobox (nine presets plus Custom). Glass uses 20px backdrop blur with opaque unsupported/reduced-transparency fallbacks.

- [NN/g homepage principles](https://www.nngroup.com/articles/homepage-design-principles/): explicit Next.js/terminal purpose, a concrete generated-route example and one dominant preset-aware copy action.
- [NN/g writing for scanning](https://www.nngroup.com/articles/how-users-read-on-the-web/): remove standalone agent-context, doctor and lint essays, the stack strip, duplicate preset catalog and repeated commands. Keep one short next step.
- [NN/g on generic AI design output](https://www.nngroup.com/articles/ai-design-tools-not-ready/): prioritize the actual selection-to-generated-files relationship, not interchangeable feature cards or a fake dashboard. No conversion uplift is claimed.
- [Vera Molnár, Interruptions (Morgan Library)](https://www.themorgan.org/drawings/item/405692): the principle of a controlled line grid with deliberate omissions informs an **original** 61-path geometric field; no artwork is copied. Unlike scrolling characters or glowing blobs, bounded lines drift and turn slowly with phase offsets.

The user's explicit website-background request is a scoped exception to the guide's no-decorative-motion rule. CSS alone drives 24-second alternate cycles, with no JS frame loop, flashes or entrance animation. The field is aria-hidden, ignores pointer events and has a keyboard-operable pause/resume control. Reduced motion disables animation on arrival and on preference changes; a static status replaces the irrelevant control.

## Honest CLI presentation

```sh
npx create-vllnt-app@latest new --preset saas
npx create-vllnt-app@latest new
```

Node.js 22+ is required. **npm publication remains pending**, not verified installation availability. The command helper explicitly says to run after release. Custom uses the base command and explains choosing Custom inside the CLI.

Preset mappings were inspected against `cli/src/core/presets.ts` and actual `cli/templates/sections/*/app` routes. The selected preset controls both command and route preview. Login/register are unconfigured route skeletons, not functioning authentication. Convex requires configuration. Agent instructions are a short proof line rather than a separate essay. Primary copy focuses on web presets; it does not imply these commands generate Expo apps.

## Interaction and verification

Copy confirms only after Clipboard API success. Pending writes disable the action; rejection or missing clipboard offers selectable-text recovery in a live region. Changing presets resets feedback. Read-only command fields remain keyboard-selectable and horizontally scrollable. Theme persistence, locale routes, source and manifesto navigation remain supported.

```sh
pnpm --filter www lint
pnpm --filter www typecheck
pnpm --filter www build
pnpm --filter www exec playwright test --output=/tmp/vllnt-conversion-review/test-results --workers=2
```

Tests cover all ten options and route previews, keyboard selection/copy, clipboard pending/success/failure, theme persistence, heading weights, first-viewport CTA, control containment and page overflow at 320/375/768/1440px, actual glass/fallback styles, bounded changing geometry, pause/resume and reduced motion. Screenshot evidence: `/tmp/vllnt-conversion-review/after-{width}-{light|dark}.png`. Existing `www/test-results` is untouched.

Rendered body words fell from 423 to 130 on mobile (69%) and 436 to 131 on desktop (70%). At a 900px viewport height:

| Width | Before height | After height | Reduction |
| --- | --- | --- | --- |
| 320 | 5252px | 1627px | 69% |
| 375 | 5022px | 1540px | 69% |
| 768 | 3653px | 1132px | 69% |
| 1440 | 3331px | 1112px | 67% |

`metrics.spec.ts` uses rendered-body text and document height, matching baseline measurements. These are layout/content measurements, not conversion results.
