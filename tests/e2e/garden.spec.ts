import { expect, test } from '@playwright/test';

test('moves from the home to the garden and switches between 3D and the map', async ({ page }) => {
  await page.goto('/');
  const gardenLink = page.getByRole('link', { name: '정원 둘러보기', exact: true });
  await expect(gardenLink).toBeVisible();
  await gardenLink.click();
  await expect(page).toHaveURL(/\/garden$/);
  await expect(page.getByRole('heading', { name: '당신의 첫 번째 정원' })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('나무와 꽃밭이 있는 작은 정원이에요.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '정적 지도로 보기' }).click();
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: '3D로 보기' }).click();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('link', { name: '소개로 돌아가기' }).click();
  await expect(page).toHaveURL('/');
});

test('shows a useful map and navigation when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(args[0])) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/garden');
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '오래 머물고 싶은 작은 장소들' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link', { name: '소개로 돌아가기' }).click();
  await expect(page).toHaveURL('/');
});

test('recovers from context loss with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/garden');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(page.getByText('나무와 꽃밭이 있는 작은 정원이에요.')).toBeVisible();
  await canvas.evaluate((element: HTMLCanvasElement) => {
    const context = element.getContext('webgl2');
    const extension = context?.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Context loss extension unavailable in the browser test renderer.');
    extension.loseContext();
  });
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
  await expect(canvas).toHaveCount(0);
});
