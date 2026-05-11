import { test, expect } from '@playwright/test'

test.describe('Village RPG smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/village')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('.loading-screen', { state: 'detached', timeout: 25_000 })
  })

  test('town square renders', async ({ page }) => {
    await expect(page.getByTestId('town-square')).toBeVisible()
    await expect(page.getByTestId('village-nav')).toBeVisible()
  })

  test('village nav shows back link to home', async ({ page }) => {
    const nav = page.getByTestId('village-nav')
    await expect(nav).toBeVisible()
    await expect(nav).toContainText('Back to classic hero')
  })

  test('street lamp cycles time of day on click', async ({ page }) => {
    const lamp = page.getByTestId('street-lamp')
    await expect(lamp).toHaveAttribute('data-time', 'day')
    await lamp.click({ force: true })
    await expect(lamp).toHaveAttribute('data-time', 'dusk')
    await lamp.click({ force: true })
    await expect(lamp).toHaveAttribute('data-time', 'night')
    await lamp.click({ force: true })
    await expect(lamp).toHaveAttribute('data-time', 'dawn')
  })

  test('weather vane cycles weather on click', async ({ page }) => {
    const vane = page.getByTestId('weather-vane')
    await expect(vane).toHaveAttribute('data-weather', 'sunny')
    await vane.click({ force: true })
    await expect(vane).toHaveAttribute('data-weather', 'cloudy')
    await vane.click({ force: true })
    await expect(vane).toHaveAttribute('data-weather', 'rainy')
    await vane.click({ force: true })
    await expect(vane).toHaveAttribute('data-weather', 'snowy')
  })

  test('village well reveals wisdom scroll on click', async ({ page }) => {
    const well = page.getByTestId('village-well')
    await well.click({ force: true })
    const scroll = page.locator('.wisdom-scroll')
    await expect(scroll).toBeVisible({ timeout: 3000 })
  })

  test('village cat moves on click', async ({ page }) => {
    const cat = page.getByTestId('village-cat')
    await expect(cat).toBeVisible()
    const before = await cat.boundingBox()
    await cat.click({ force: true })
    await page.waitForTimeout(2500)
    const after = await cat.boundingBox()
    expect(after?.x).not.toEqual(before?.x)
  })

  test('flower pot grows stage on click', async ({ page }) => {
    const pot = page.getByTestId('flower-pot-0')
    await expect(pot).toHaveAttribute('data-stage', 'seed')
    await pot.click({ force: true })
    await page.waitForTimeout(1500)
    await expect(pot).toHaveAttribute('data-stage', 'sprout')
  })

  test('flying birds are clickable', async ({ page }) => {
    const bird = page.getByTestId('bird-1')
    await expect(bird).toBeVisible()
    await bird.click({ force: true })
    const hint = page.locator('.interaction-hint')
    await expect(hint).toBeVisible({ timeout: 3000 })
  })

  test('no console errors on initial render', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/village')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('manifest'))).toEqual([])
  })
})
