import { test } from '@playwright/test'
;[320, 375, 768, 1440].forEach((width) => {
  test(`page measurements at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 900, width })
    await page.goto('/')
    const height = await page
      .locator('body')
      .evaluate((element) => element.scrollHeight)
    const texts = await page.locator('body').allInnerTexts()
    const words = texts.join(' ').trim().split(/\s+/).length
    console.info(JSON.stringify({ height, width, words }))
  })
})
