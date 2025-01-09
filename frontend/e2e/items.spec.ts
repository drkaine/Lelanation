import { test, expect } from '@playwright/test'

test.describe('Items Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/items')
  })

  test('displays item categories', async ({ page }) => {
    await expect(page.locator('.group.small').first()).toBeVisible()
    await expect(page.getByText('Basic items')).toBeVisible()
    await expect(page.getByText('Epic items')).toBeVisible()
  })

  test('filters items by tag', async ({ page }) => {
    await page.getByText('Attack Damage').click()
    await expect(page.getByText('Attack Damage')).toHaveClass(/active/)
  })

  test('shows item tooltip on hover', async ({ page }) => {
    const firstItem = page.locator('.tooltip button').first()
    await firstItem.hover()
    await expect(page.locator('.box').first()).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    await page.waitForSelector('.tooltip button')
    
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill('Doran')
    await searchInput.press('Enter')
    
    await expect(async () => {
      const items = await page.locator('.tooltip button').count()
      expect(items).toBeGreaterThan(0)
    }).toPass()
    
    const itemNames = await page.locator('.tooltip .name').allTextContents()
    const doranItems = itemNames.filter(name => name.toLowerCase().includes('doran'))
    expect(doranItems.length).toBeGreaterThan(0)
  })
}) 