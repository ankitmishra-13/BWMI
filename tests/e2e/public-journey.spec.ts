import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('editorial service hub is clear and accessible', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Transport services');
  await expect(page.getByText('Independent hackathon prototype—not an official government service').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore all services' }).first()).toHaveAttribute('href', '/en/services');
  const mainSearch = page.getByRole('search', { name: 'Main service search' });
  const mainSearchInput = page.getByRole('searchbox', { name: 'Search services' });
  await expect(mainSearch).toBeVisible();
  await expect(mainSearchInput).toHaveAttribute('autocomplete', 'off');
  await mainSearchInput.focus();
  expect(await mainSearchInput.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('none');
  expect(await mainSearch.evaluate((element) => getComputedStyle(element, '::after').boxShadow)).not.toBe('none');
  await expect(page.getByRole('heading', { name: 'One guided route. Zero hidden handoffs.' })).toBeAttached();
  await expect(page.getByRole('contentinfo').getByRole('heading', { name: 'Start informed. Finish without the maze.' })).toBeAttached();
  const rail = page.locator('nav[aria-label="Page and account navigation"]');
  expect(await rail.evaluate((element) => getComputedStyle(element).position)).toBe('sticky');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('responsive header exposes the complete shadcn navigation menu', async ({ page }) => {
  await page.goto('/en');
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 1024) {
    const mobileNav = page.locator('details.mobile-nav');
    const trigger = mobileNav.locator('summary');
    const firstLine = trigger.locator('.menu-glyph > span').first();
    const initialTransform = await firstLine.evaluate((element) => getComputedStyle(element).transform);
    await trigger.click();
    await expect(mobileNav).toHaveAttribute('open', '');
    await page.waitForTimeout(240);
    const openTransform = await firstLine.evaluate((element) => getComputedStyle(element).transform);
    expect(openTransform).not.toBe(initialTransform);
    const panel = mobileNav.locator('.mobile-menu-panel');
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
    await expect(mobileNav.getByRole('link', { name: 'All services', exact: true })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Driving licence', exact: true })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Dashboards & reports', exact: true })).toBeVisible();
  } else {
    const primary = page.getByRole('navigation', { name: 'Primary' });
    await primary.getByRole('button', { name: 'All services' }).click();
    const menuViewport = primary.locator('[data-slot="navigation-menu-viewport"]');
    await expect(menuViewport.getByRole('link', { name: 'Renew a driving licence', exact: true })).toBeVisible();
    await expect(menuViewport.getByRole('link', { name: 'Rules and advisories', exact: true })).toBeVisible();
    await expect(menuViewport.getByRole('link', { name: 'All services', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await primary.getByRole('button', { name: 'Licence' }).click();
    await expect(menuViewport.getByRole('link', { name: 'Book a driving test', exact: true })).toBeVisible();
  }
});

test('language switching preserves the public page', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('link', { name: /हिन्दी/ })).toHaveAttribute('href', '/hi');
  await page.goto('/hi');
  await expect(page).toHaveURL(/\/hi$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('परिवहन सेवाएँ');
});

test('service directory supports search and opens a complete service brief', async ({ page }) => {
  await page.goto('/en/services?q=challan');
  await expect(page.getByRole('heading', { name: 'Choose what you need to do' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search services' })).toHaveAttribute('autocomplete', 'off');
  await expect(page.getByRole('link', { name: 'Check and pay eChallan' })).toBeVisible();
  await page.goto('/en/services/echallan');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('eChallan');
  await expect(page.getByText('Demo OTP: 123456')).toBeVisible();
  await expect(page.getByText('Journey readiness')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('public demo credentials are visible and non-sensitive', async ({ page }) => {
  await page.goto('/en/login');
  await expect(page.getByLabel('Email address')).toHaveValue('citizen.demo@bwmi.test');
  await expect(page.getByLabel('Password')).toHaveValue('ParivahanDemo#2026');
  await expect(page.getByText('Synthetic data only')).toBeVisible();
});

test('demo auth protects and completes a synthetic service transaction', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/en/login?returnTo=%2Fen%2Fdashboard');
  await Promise.all([
    page.waitForURL(/\/en\/dashboard/, { timeout: 60_000 }),
    page.getByRole('button', { name: 'Open demo workspace' }).click(),
  ]);
  await expect(page.getByRole('heading', { name: 'Your synthetic transport workspace' })).toBeVisible();
  await page.goto('/en/applications');
  await expect(page.getByRole('heading', { name: 'Every application, in one place.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Citizen account' }).getByRole('link', { name: 'My applications' })).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.goto('/en/profile');
  await expect(page.getByRole('heading', { name: 'Your synthetic profile.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Open profile navigation' }).click();
  await expect(page.getByRole('menuitem', { name: 'My applications' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'हिन्दी' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Save synthetic profile' }).click();
  await expect(page).toHaveURL(/\/en\/profile\?saved=1/);
  await expect(page.getByText('Synthetic profile updated.')).toBeVisible();

  const created = await page.request.post('/api/service-applications', { data: { serviceSlug: 'update-mobile-number', locale: 'en' } });
  expect(created.status()).toBe(201);
  const { id } = await created.json() as { id: string };

  await page.goto(`/en/services/update-mobile-number/apply/${id}`);
  await expect(page.getByRole('heading', { name: 'Check record' })).toBeVisible();
  await page.getByLabel(/every result are entirely synthetic/).check();
  await page.getByRole('button', { name: 'Save and continue' }).click();

  await expect(page.getByRole('heading', { name: 'Application details' })).toBeVisible();
  await page.getByLabel('New synthetic mobile number').fill('+91 93456 78901');
  await page.getByRole('button', { name: 'Save and continue' }).click();

  await expect(page.getByRole('heading', { name: 'Demo verification' })).toBeVisible();
  await page.getByLabel('Six-digit demo OTP').fill('123456');
  await page.getByRole('button', { name: 'Save and continue' }).click();

  await expect(page.getByRole('heading', { name: 'Review changes' })).toBeVisible();
  await expect(page.getByText('+91 98765 78120', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('+91 93456 78901', { exact: true })).toBeVisible();
  await page.getByLabel(/reviewed the changes/).check();
  await page.getByRole('button', { name: 'Continue to mock payment' }).click();

  await expect(page.getByRole('heading', { name: 'Mock payment' })).toBeVisible();
  await expect(page.getByText('No card number, bank login, or UPI ID will ever be requested.')).toBeVisible();
  await page.getByRole('radio', { name: /Mock card/ }).click();
  await page.getByRole('button', { name: 'Preview failed-payment recovery' }).click();
  await expect(page.getByText(/Nothing was charged and the application is safe/)).toBeVisible();
  await page.getByRole('button', { name: 'Complete mock payment' }).click();

  await expect(page).toHaveURL(new RegExp(`/en/services/update-mobile-number/receipt/${id}`), { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Your synthetic application is submitted.' })).toBeVisible();
  await expect(page.getByText(/MOCK-PAY-/)).toBeVisible();
  await expect(page.getByText('Mock card', { exact: true })).toBeVisible();
  await expect(page.getByText('+91 93456 78901', { exact: true })).toBeVisible();
});
