const { test, expect } = require('@playwright/test');

test('Account page opens and shows details', async ({ page }) => {
  await page.goto('http://localhost:5174/login');

  await page.locator('input[type="email"]').fill('Nila12@gmail.com');
  await page.locator('input[type="password"]').fill('Nila123');

  await Promise.all([
    page.waitForURL(/localhost:5174\/(?!login)/),
    page.getByRole('button', { name: 'Sign In' }).click(),
  ]);

  await page.getByRole('link', { name: 'Account' }).click();

  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  await expect(page.getByText('Order History')).toBeVisible();
  await expect(page.getByText('Order Summary')).toBeVisible();
  await expect(page.getByText('Sign Out')).toBeVisible();
});