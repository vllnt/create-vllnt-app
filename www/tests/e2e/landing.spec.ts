import { expect, test } from '@playwright/test'

const COMMAND = 'npx create-vllnt-app@latest new'
const PRESETS = [
  ['saas', 'SaaS starter', '/dashboard'],
  ['landing', 'Product website', '/'],
  ['blog', 'Blog', '/blog'],
  ['marketing', 'Website + blog', '/blog'],
  ['saas-blog', 'SaaS + blog', '/blog'],
  ['full-saas', 'SaaS + blog + docs', '/docs'],
  ['dashboard', 'Dashboard starter', '/dashboard'],
  ['internal', 'Internal tool', '/admin'],
  ['docs', 'Documentation site', '/docs'],
  ['custom', 'Custom', 'Choose from'],
] as const

test('one honest command, every preset and matching route preview', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
    })
  })
  await page.goto('/')
  await expect(page.locator('.landing textarea')).toHaveCount(1)
  await expect(page.locator('.requirements')).toContainText(
    'Node.js 22+ · npm publication pending',
  )
  const picker = page.getByRole('combobox', { name: 'What are you building?' })
  await PRESETS.reduce(async (previous, [id, label, route]) => {
    await previous
    await picker.click()
    await expect(page.getByRole('option')).toHaveCount(10)
    await page.getByRole('option', { exact: true, name: label }).click()
    await expect(page.locator('textarea')).toHaveValue(
      id === 'custom' ? COMMAND : `${COMMAND} --preset ${id}`,
    )
    await expect(
      page.getByRole('figure', { name: `Generated files for ${label}` }),
    ).toContainText(route)
    const copy = page.getByRole('button', { name: `Copy ${label} command` })
    await expect(copy).toHaveText('Copy command')
    await copy.click()
    await expect(copy).toContainText('Copied')
  }, Promise.resolve())
})

test('keyboard search and copy writes the selected command', async ({
  page,
}) => {
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
  const picker = page.getByRole('combobox', { name: 'What are you building?' })
  await picker.focus()
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Search presets…').fill('Product website')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(picker).toBeFocused()
  const copy = page.getByRole('button', {
    name: 'Copy Product website command',
  })
  await copy.focus()
  await page.keyboard.press('Enter')
  await expect(copy).toContainText('Copied')
  expect(
    await page.evaluate(
      () => (window as unknown as { copiedText: string }).copiedText,
    ),
  ).toBe(`${COMMAND} --preset landing`)
})

test('copy confirms only after clipboard resolves', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            Object.assign(window, { resolveClipboard: resolve })
          }),
      },
    })
  })
  await page.goto('/')
  const copy = page.getByRole('button', { name: 'Copy SaaS starter command' })
  await copy.click()
  await expect(copy).toBeDisabled()
  await expect(copy).not.toContainText('Copied')
  await page.evaluate(() => {
    ;(window as unknown as { resolveClipboard: () => void }).resolveClipboard()
  })
  await expect(copy).toContainText('Copied')
})
;[false, true].forEach((unavailable) => {
  test(`clipboard failure recovery: unavailable=${unavailable}`, async ({
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
      .getByRole('button', { name: 'Copy SaaS starter command' })
      .click()
    await expect(page.locator('.hero [aria-live]')).toContainText(
      'Couldn’t copy',
    )
    await expect(page.locator('textarea')).toHaveValue(
      `${COMMAND} --preset saas`,
    )
  })
})
;[320, 375, 768, 1440].forEach((width) => {
  test(`geometry, glass, theme and overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    const copyBox = await page
      .getByRole('button', { name: 'Copy SaaS starter command' })
      .boundingBox()
    expect(copyBox?.height).toBeGreaterThanOrEqual(44)
    expect(copyBox?.y).toBeLessThan(800)
    const commandBox = await page.locator('.command-line').boundingBox()
    expect((copyBox?.x ?? 0) + (copyBox?.width ?? 0)).toBeLessThanOrEqual(
      (commandBox?.x ?? 0) + (commandBox?.width ?? 0),
    )
    await ['Dark', 'Light'].reduce(async (previous, theme) => {
      await previous
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await page.getByRole('menuitem', { name: new RegExp(theme) }).click()
      await page.reload()
      expect(
        await page
          .locator('html')
          .evaluate((element) => element.classList.contains('dark')),
      ).toBe(theme === 'Dark')
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      expect(
        await page
          .locator('.landing h1, .landing h2')
          .evaluateAll((headings) =>
            headings.every(
              (heading) => getComputedStyle(heading).fontWeight === '600',
            ),
          ),
      ).toBe(true)
      expect(
        await page
          .locator('.preset-workbench')
          .evaluate((element) => getComputedStyle(element).backdropFilter),
      ).toBe('blur(20px)')
      await page.screenshot({
        fullPage: true,
        path: `/tmp/vllnt-conversion-review/after-${width}-${theme.toLowerCase()}.png`,
      })
    }, Promise.resolve())
    await page.getByRole('link', { name: /Why I’m building this/ }).click()
    await expect(page.locator('h1')).toHaveText("Why I'm building this")
  })
})

test('bounded geometric motion pauses and resumes by keyboard', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const background = page.locator('.matrix-background')
  await expect(background).toHaveAttribute('aria-hidden', 'true')
  expect(
    await background.evaluate(
      (element) => getComputedStyle(element).pointerEvents,
    ),
  ).toBe('none')
  const paths = background.locator('path')
  expect(await paths.count()).toBeLessThan(72)
  expect(await paths.count()).toBeGreaterThan(50)
  const phases = await paths.first().evaluate((element) => {
    const animation = element.getAnimations()[0]
    if (!animation) return []
    animation.currentTime = 0
    const start = getComputedStyle(element).transform
    animation.currentTime = 12_000
    return [start, getComputedStyle(element).transform]
  })
  expect(phases[0]).not.toBe(phases[1])
  await page.getByRole('button', { name: 'Pause background' }).focus()
  await page.keyboard.press('Enter')
  expect(
    await paths
      .first()
      .evaluate((element) => getComputedStyle(element).animationPlayState),
  ).toBe('paused')
  await page.keyboard.press('Enter')
  expect(
    await paths
      .first()
      .evaluate((element) => getComputedStyle(element).animationPlayState),
  ).toBe('running')
})

test('reduced motion is static on arrival and after preference changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const path = page.locator('.matrix-background path').first()
  expect(
    await path.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none')
  await expect(
    page.getByText('Static background · reduced motion'),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Pause background' }),
  ).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  expect(
    await path.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('matrix-phase')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(
    await path.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none')
})
