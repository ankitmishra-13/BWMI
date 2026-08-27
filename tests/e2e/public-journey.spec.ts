import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('public introduction is clear and accessible', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Renew your licence');
  await expect(page.getByText('Hackathon prototype—not an official government service').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try the renewal demo' }).first()).toHaveAttribute('href', /signin-with-chatgpt|dashboard/);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('language switching preserves the public page', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: /हिन्दी/ }).click();
  await expect(page).toHaveURL(/\/hi$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('लाइसेंस');
});
