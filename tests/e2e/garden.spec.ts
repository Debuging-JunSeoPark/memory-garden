import { expect, test } from '@playwright/test';

test('moves from the home to the garden and switches between 3D and the map', async ({ page }) => {
  await page.goto('/');
  const gardenLink = page.getByRole('link', { name: '정원 둘러보기', exact: true });
  await expect(gardenLink).toBeVisible();
  await gardenLink.click();
  await expect(page).toHaveURL(/\/garden$/);
  const guide = page.getByRole('button', { name: '정원 안내서' });
  await expect(guide).toBeVisible();
  await expect(page.getByText('당신의 첫 번째 정원', { exact: true })).toBeHidden();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('나무와 꽃밭이 있는 작은 정원이에요.');
  await expect
    .poll(() => canvas.evaluate((element) => element.clientHeight / innerHeight))
    .toBeGreaterThanOrEqual(0.9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '정적 지도로 보기' }).click();
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: '3D로 보기' }).click();
  await expect(page.locator('canvas')).toHaveCount(1);
  await guide.click();
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
  await expect(page.locator('canvas')).toHaveCount(0);
  const guide = page.getByRole('button', { name: '정원 안내서' });
  await expect(guide).toBeVisible();
  const guideContent = page.getByRole('dialog', { name: '정원 안내서' });
  await expect(guideContent).toBeHidden();
  await guide.focus();
  await page.keyboard.press('Enter');
  await expect(guideContent).toBeVisible();
  await expect(guideContent).toContainText('한 달에 한 권');
  await expect(guideContent).toContainText('기록한 날마다');
  await expect(guideContent.getByRole('heading', { name: '당신의 첫 번째 정원' })).toBeVisible();
  await expect(guideContent.getByText('그늘 나무와 벤치')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(guideContent).toBeHidden();
  await expect(guide).toBeFocused();
  await guide.click();
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
