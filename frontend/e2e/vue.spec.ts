import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.title')).toHaveText('Lelanation vous saluriva tous !');
  await expect(page.locator('.subtitle')).toHaveText('Retrouver le grand Lelariva');
});

test('social links are present', async ({ page }) => {
  await page.goto('/');
  
  const expectedLinks = [
    { href: 'https://discord.com/invite/RrXCpsFGrw', text: 'Lelaricord' },
    { href: 'https://www.patreon.com/c/Lelariva/posts', text: 'Lepatreonva' },
    { href: 'https://www.youtube.com/@Lelariva_LoL/featured', text: 'Lelaritube' },
    { href: 'https://www.twitch.tv/lelariva', text: 'Lelaritwitch' },
    { href: 'https://x.com/Lelariva_fr', text: 'LelarivaX' },
    { href: 'https://www.lelariva.fr/', text: 'Lelariva' }
  ];

  for (const link of expectedLinks) {
    const linkElement = page.locator(`a[href="${link.href}"]`);
    await expect(linkElement).toBeVisible();
    await expect(linkElement).toContainText(link.text);
  }
});
