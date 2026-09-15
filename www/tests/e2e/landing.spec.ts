import { expect, test } from '@playwright/test'

const COMMAND = 'node cli/dist/index.js new'

test('copy confirms only after clipboard resolves', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (text: string) =>
          new Promise<void>((resolve) => {
            Object.assign(window, {
              copiedText: text,
              resolveClipboard: resolve,
            })
          }),
      },
    })
  })
  await page.goto('/')
  const copy = page
    .getByRole('button', { exact: true, name: 'Copy source setup commands' })
    .first()
  await copy.click()
  await expect(copy).toBeDisabled()
  await expect(copy).not.toContainText('Copied')
  await page.evaluate(() => {
    const state = window as unknown as { resolveClipboard: () => void }
    state.resolveClipboard()
  })
  await expect(copy).toContainText('Copied')
  expect(
    await page.evaluate(
      () => (window as unknown as { copiedText: string }).copiedText,
    ),
  ).toContain(COMMAND)
})
;[false, true].forEach((unavailable) => {
  test(`clipboard ${unavailable ? 'unavailable' : 'rejection'} offers manual recovery`, async ({
    page,
  }) => {
    await page.addInitScript((missing) => {
      Object.defineProperty(navigator, 'clipboard', {
        value: missing
          ? undefined
          : { writeText: () => Promise.reject(new Error('Denied')) },
      })
    }, unavailable)
    await page.goto('/')
    await page
      .getByRole('button', { exact: true, name: 'Copy source setup commands' })
      .first()
      .click()
    await expect(page.locator('.hero [aria-live]')).toContainText(
      'Couldn’t copy',
    )
    await expect(page.locator('.hero .command-line textarea')).toHaveValue(
      new RegExp(COMMAND),
    )
    await expect(page.locator('.hero button')).not.toContainText('Copied')
  })
})

test('every preset exposes a complete command and resets copy state', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
    })
  })
  await page.goto('/')
  const ids = [
    'saas',
    'landing',
    'blog',
    'marketing',
    'saas-blog',
    'full-saas',
    'dashboard',
    'internal',
    'docs',
    'custom',
  ]
  const picker = page.getByRole('combobox', { name: 'Choose a project preset' })
  const labels = [
    'SaaS',
    'Landing Page',
    'Blog',
    'Marketing Site',
    'SaaS + Blog',
    'Full SaaS',
    'Dashboard',
    'Internal Tool',
    'Docs Site',
    'Custom',
  ]
  await ids.reduce(async (previous, id, index) => {
    await previous
    await picker.click()
    await page.getByRole('option', { exact: true, name: labels[index] }).click()
    await expect(picker).toContainText(labels[index] ?? '')
    await expect(page.locator('.preset-detail textarea')).toHaveValue(
      id === 'custom' ? COMMAND : `${COMMAND} --preset ${id}`,
    )
    const copy = page.locator('.preset-detail button')
    await expect(copy).toHaveText('Copy command')
    await copy.click()
    await expect(copy).toContainText('Copied')
  }, Promise.resolve())
})

test('keyboard can choose a preset and copy its command', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (text: string) => {
          Object.assign(window, { copiedText: text })
          return Promise.resolve()
        },
      },
    })
  })
  await page.goto('/')
  const picker = page.getByRole('combobox', { name: 'Choose a project preset' })
  await picker.focus()
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Search presets…').fill('Landing Page')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(picker).toContainText('Landing Page')
  const copy = page.getByRole('button', { name: 'Copy Landing Page command' })
  await copy.focus()
  await page.keyboard.press('Enter')
  await expect(copy).toContainText('Copied')
  expect(
    await page.evaluate(
      () => (window as unknown as { copiedText: string }).copiedText,
    ),
  ).toBe(`${COMMAND} --preset landing`)
})
;[320, 375, 768, 1440].forEach((width) => {
  test(`responsive layout and theme at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    const copyBox = await page.locator('.hero button').boundingBox()
    expect(copyBox?.height).toBeGreaterThanOrEqual(44)
    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.getByRole('menuitem', { name: /Dark/ }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(
      await page
        .locator('.landing h1, .landing h2, .landing h3')
        .evaluateAll((headings) =>
          headings.every(
            (heading) => getComputedStyle(heading).fontWeight === '600',
          ),
        ),
    ).toBe(true)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      fullPage: true,
      path: `/tmp/vllnt-landing-review/after-${width}-dark.png`,
    })
    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.getByRole('menuitem', { name: /Light/ }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(
      await page
        .locator('.landing h1, .landing h2, .landing h3')
        .evaluateAll((headings) =>
          headings.every(
            (heading) => getComputedStyle(heading).fontWeight === '600',
          ),
        ),
    ).toBe(true)
    await page.screenshot({
      fullPage: true,
      path: `/tmp/vllnt-landing-review/after-${width}-light.png`,
    })
    await page.getByRole('link', { name: /Why I’m building this/ }).click()
    await expect(page.locator('h1')).toHaveText("Why I'm building this")
  })
})
