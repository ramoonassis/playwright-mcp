import { test, expect } from '@playwright/test';

test('home @e2e', async ({ page }) => {
  await page.goto('https://testbeyond.com');

  await expect(page).toHaveTitle('Projeto TestBeyond');
});