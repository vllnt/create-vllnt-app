import { expect, test } from '@playwright/test'

test('reduced transparency uses opaque unblurred glass fallback', async ({
  page,
}) => {
  await page.goto('/')
  const session = await page.context().newCDPSession(page)
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  })
  expect(
    await page.evaluate(
      () => matchMedia('(prefers-reduced-transparency: reduce)').matches,
    ),
  ).toBe(true)
  const style = await page.locator('.preset-workbench').evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    blur: getComputedStyle(element).backdropFilter,
  }))
  expect(style.blur).toBe('none')
  expect(style.background).toMatch(/^rgb\(/)
})
