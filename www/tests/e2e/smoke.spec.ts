import { expect, test } from '@playwright/test'

const consoleErrors: string[] = []

test.beforeEach(({ page }) => {
  consoleErrors.length = 0
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
})

test.describe('Landing page smoke', () => {
  test('loads with 200 and renders hero', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Ship production apps')
  })

  test('has zero console errors', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(consoleErrors).toHaveLength(0)
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('presets section renders all cards', async ({ page }) => {
    await page.goto('/')
    await page.locator('#presets').scrollIntoViewIfNeeded()
    await expect(page.locator('#presets')).toBeVisible()
    const presetCards = page.locator('#presets .grid > div, #presets .grid > a')
    await expect(presetCards).not.toHaveCount(0)
  })
})
