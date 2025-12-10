import { test, expect } from '@playwright/test'

test.describe('Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    // Wait for albums to load
    await page.waitForSelector('.album-card', { timeout: 10000 })
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForSelector('.album-card', { timeout: 10000 })
  })

  test('should display cart icon with 0 count initially', async ({ page }) => {
    const cartIcon = page.locator('.cart-icon')
    await expect(cartIcon).toBeVisible()
    
    // Badge should not be visible when count is 0
    const badge = page.locator('.badge')
    await expect(badge).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-initial-state.png', fullPage: true })
  })

  test('should add an album to cart and show count', async ({ page }) => {
    // Click the first "Add to Cart" button
    const firstAddButton = page.locator('.album-card .btn-primary').first()
    await firstAddButton.click()
    
    // Badge should now be visible with count 1
    const badge = page.locator('.badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
    
    // Button should show checkmark and be disabled
    await expect(firstAddButton).toContainText('✓')
    await expect(firstAddButton).toBeDisabled()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-one-item.png', fullPage: true })
  })

  test('should open cart drawer when cart icon is clicked', async ({ page }) => {
    // Add an item first
    await page.locator('.album-card .btn-primary').first().click()
    
    // Wait for badge to appear
    await page.locator('.badge').waitFor()
    
    // Click cart icon
    await page.locator('.cart-icon').click()
    
    // Drawer should be visible
    const drawer = page.locator('.drawer')
    await expect(drawer).toBeVisible()
    
    // Should show the cart title
    const title = page.locator('.drawer-header h2')
    await expect(title).toContainText('Shopping Cart')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-drawer-open.png', fullPage: true })
  })

  test('should display cart items in drawer', async ({ page }) => {
    // Add two items
    const addButtons = page.locator('.album-card .btn-primary')
    await addButtons.nth(0).click()
    await expect(page.locator('.badge')).toHaveText('1')
    await addButtons.nth(1).click()
    
    // Wait for badge to update
    await expect(page.locator('.badge')).toHaveText('2')
    
    // Open cart drawer
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Should display 2 items
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(2)
    
    // Should show total count
    const totalCount = page.locator('.total-count')
    await expect(totalCount).toHaveText('2')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-drawer-two-items.png', fullPage: true })
  })

  test('should remove item from cart', async ({ page }) => {
    // Add an item
    await page.locator('.album-card .btn-primary').first().click()
    await page.locator('.badge').waitFor()
    
    // Open cart drawer
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Click remove button
    await page.locator('.remove-btn').first().click()
    
    // Drawer should show empty state
    const emptyState = page.locator('.empty-state')
    await expect(emptyState).toBeVisible()
    await expect(emptyState).toContainText('Your cart is empty')
    
    // Badge should not be visible
    const badge = page.locator('.badge')
    await expect(badge).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-after-remove.png', fullPage: true })
  })

  test('should clear all items from cart', async ({ page }) => {
    // Add two items
    const addButtons = page.locator('.album-card .btn-primary')
    await addButtons.nth(0).click()
    await expect(page.locator('.badge')).toHaveText('1')
    await addButtons.nth(1).click()
    
    // Open cart drawer
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Click clear button
    await page.locator('.clear-btn').click()
    
    // Drawer should show empty state
    const emptyState = page.locator('.empty-state')
    await expect(emptyState).toBeVisible()
    
    // Badge should not be visible
    const badge = page.locator('.badge')
    await expect(badge).not.toBeVisible()
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-after-clear.png', fullPage: true })
  })

  test('should close drawer when overlay is clicked', async ({ page }) => {
    // Add an item and open drawer
    await page.locator('.album-card .btn-primary').first().click()
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Click overlay (not the drawer itself)
    await page.locator('.drawer-overlay').click({ position: { x: 10, y: 10 } })
    
    // Drawer should not be visible
    const drawer = page.locator('.drawer')
    await expect(drawer).not.toBeVisible()
  })

  test('should close drawer when close button is clicked', async ({ page }) => {
    // Add an item and open drawer
    await page.locator('.album-card .btn-primary').first().click()
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Click close button
    await page.locator('.close-btn').click()
    
    // Drawer should not be visible
    const drawer = page.locator('.drawer')
    await expect(drawer).not.toBeVisible()
  })

  test('should persist cart across page reload', async ({ page }) => {
    // Add an item
    await page.locator('.album-card .btn-primary').first().click()
    await page.locator('.badge').waitFor()
    
    // Reload the page
    await page.reload()
    await page.waitForSelector('.album-card', { timeout: 10000 })
    
    // Badge should still show 1
    const badge = page.locator('.badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
    
    // Open drawer to verify item is still there
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-persisted.png', fullPage: true })
  })

  test('should not allow adding same album twice', async ({ page }) => {
    // Add an item
    const firstAddButton = page.locator('.album-card .btn-primary').first()
    await firstAddButton.click()
    
    // Badge should show 1
    await expect(page.locator('.badge')).toHaveText('1')
    
    // Button should be disabled
    await expect(firstAddButton).toBeDisabled()
    
    // Try clicking again (shouldn't work)
    await firstAddButton.click({ force: true })
    
    // Badge should still show 1
    await expect(page.locator('.badge')).toHaveText('1')
  })

  test('should work with language switching', async ({ page }) => {
    // Add an item
    await page.locator('.album-card .btn-primary').first().click()
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Should show English by default
    await expect(page.locator('.drawer-header h2')).toContainText('Shopping Cart')
    
    // Close drawer
    await page.locator('.close-btn').click()
    
    // Switch to French
    await page.selectOption('#lang', 'fr')
    
    // Open drawer again
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Should show French
    await expect(page.locator('.drawer-header h2')).toContainText('Panier')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-french.png', fullPage: true })
    
    // Close drawer
    await page.locator('.close-btn').click()
    
    // Switch to German
    await page.selectOption('#lang', 'de')
    
    // Open drawer again
    await page.locator('.cart-icon').click()
    await page.locator('.drawer').waitFor()
    
    // Should show German
    await expect(page.locator('.drawer-header h2')).toContainText('Warenkorb')
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/cart-german.png', fullPage: true })
  })
})
