const { test, expect } = require('@playwright/test');

test('Employee management page opens and shows details', async ({ page }) => {
  await page.goto('http://localhost:5173/employees');

  await expect(page.getByRole('heading', { name: /Employee Management/i })).toBeVisible();
  await expect(page.getByPlaceholder(/Search by name, ID or role/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Add Employee/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Generate Report/i })).toBeVisible();
});