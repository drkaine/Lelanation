import { test, expect } from '@playwright/test'

test.describe('Build Tool Page', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    
    try {
      console.log('Début de la navigation...');
      await page.goto('/build');
      console.log('Navigation terminée');

      const url = page.url();
      console.log('URL actuelle:', url);

      console.log('Attente du chargement...');
      await page.waitForLoadState('load');
      console.log('Page chargée');

      const rootLocator = page.locator('#root');
      await expect(rootLocator).toBeAttached();
      console.log('Root element trouvé');

    } catch (error) {
      console.error('Erreur détaillée:', error);
      await page.screenshot({ path: 'debug-screenshot.png' });
      throw error;
    }
  })

  test('champion selection works', async ({ page }) => {
    const filterContainer = page.locator('.filter-container');
    await expect(filterContainer).toBeVisible();

    const assassinButton = filterContainer.getByText('Assassin').first();
    await assassinButton.click();
    await expect(assassinButton).toHaveClass(/active/);

    await page.getByPlaceholder('Rechercher un champion...').fill('Ahri');
    await expect(page.locator('.champion-grid')).toContainText('Ahri');
  })

  test('runes selection works', async ({ page }) => {
    const championGrid = page.locator('.champion-grid');
    await expect(championGrid).toBeVisible();
    
    const ahriImage = championGrid.locator('img[alt="Ahri"]').first();
    await expect(ahriImage).toBeVisible();
    await ahriImage.click();

    const runePaths = page.locator('.rune-paths');
    await expect(runePaths).toBeVisible();
    
    await runePaths.locator('.path button').first().click();
    await expect(page.locator('.rune-selected')).toBeVisible();

    await runePaths.locator('.secondary-path button').first().click();
    await expect(page.locator('.secondary-runes')).toBeVisible();
  })
}) 