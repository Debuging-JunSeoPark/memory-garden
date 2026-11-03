import { expect, test } from '@playwright/test';

test('opens the Korean home and navigates to the garden introduction', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/기억의 정원/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: '정원 이야기' }).click();
  await expect(page).toHaveURL(/#garden-story$/);
  await expect(page.getByRole('heading', { name: '기억이 자라는 방식' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
