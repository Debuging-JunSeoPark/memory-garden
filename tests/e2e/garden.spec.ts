import { expect, test } from '@playwright/test';

test('walks to the bookshelf and opens its first book', async ({ page }, testInfo) => {
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await expect(page.getByRole('button', { name: '책장 보기', exact: true })).toHaveCount(0);
  const nearShelf = page.getByRole('status').filter({ hasText: '책장에 도착했어요' });
  const shelf = page.getByRole('heading', { name: '기억의 책장', exact: true });
  await expect(page.getByRole('button', { name: '정적 지도로 보기' })).toHaveCount(0);

  if (testInfo.project.name === 'mobile') {
    const stick = await page.getByLabel('이동 조이스틱').boundingBox();
    if (!stick) throw new Error('Joystick is unavailable');
    const touch = await page.context().newCDPSession(page);
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: stick.x + stick.width * 0.7, y: stick.y + stick.height * 0.2 }],
    });
    await expect(nearShelf).toBeVisible();
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.detach();
  } else {
    await page.keyboard.down('ArrowUp');
    await page.keyboard.down('ArrowRight');
    await expect(nearShelf).toBeVisible();
    await page.keyboard.up('ArrowRight');
    await page.keyboard.up('ArrowUp');
  }

  await page.keyboard.press('Enter');
  await expect(shelf).toBeVisible();
  await expect(page.getByRole('article', { name: '정원 안내서' })).toHaveCount(0);
  const tutorial = page.getByRole('button', { name: '정원 안내서 펼치기' });
  await expect(shelf).toBeFocused();
  await tutorial.press('Enter');
  await expect(page.getByRole('article', { name: '정원 안내서' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText(/한 달에 한 권/)).toBeVisible();
  await page.getByRole('button', { name: '책 덮기' }).click();
  await expect(shelf).toBeFocused();
  await page.getByRole('button', { name: '정원으로 돌아가기' }).click();
  await expect(nearShelf).toBeVisible();
});

test('opens the same guide from the map when WebGL is unavailable', async ({ page }) => {
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
  const shelf = page.getByRole('button', { name: '지도에서 책장 열기' });
  await shelf.press('Enter');
  const tutorial = page.getByRole('button', { name: '정원 안내서 펼치기' });
  await expect(page.getByRole('article', { name: '정원 안내서' })).toHaveCount(0);
  await tutorial.click();
  await expect(page.getByRole('article', { name: '정원 안내서' })).toBeVisible();
  await expect(page.getByText(/기록한 날마다/)).toBeVisible();
  await page.getByRole('button', { name: '책 덮기' }).click();
  await expect(page.getByRole('heading', { name: '기억의 책장' })).toBeFocused();
  await tutorial.click();
  await page.getByRole('link', { name: '소개로 돌아가기' }).click();
  await expect(page).toHaveURL('/');
});

test('recovers from context loss with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/garden');
  const canvas = page.locator('canvas');
  await expect(page.getByRole('status')).toContainText('일기장');
  await canvas.evaluate((element: HTMLCanvasElement) => {
    const context = element.getContext('webgl2');
    const extension = context?.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Context loss extension unavailable in the browser test renderer.');
    extension.loseContext();
  });
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
  await expect(canvas).toHaveCount(0);
  await page.getByRole('button', { name: '지도에서 책장 열기' }).click();
  await page.getByRole('button', { name: '정원 안내서 펼치기' }).click();
  await expect(page.getByRole('article', { name: '정원 안내서' })).toBeVisible();
});
