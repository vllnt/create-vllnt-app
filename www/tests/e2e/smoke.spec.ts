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
    await expect(page.locator('h1')).toContainText('A project to build on.')
  })

  test('locale routes render translated pages', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toContainText('A project to build on.')

    const manifesto = await page.goto('/en/manifesto')
    expect(manifesto?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
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

  test('preset picker exposes all choices', async ({ page }) => {
    await page.goto('/')
    await page.locator('#presets').scrollIntoViewIfNeeded()
    await expect(page.locator('#presets')).toBeVisible()
    await page.getByRole('combobox', { name: 'What are you building?' }).click()
    await expect(page.getByRole('option')).toHaveCount(10)
  })
})
