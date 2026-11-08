import { expect, test } from '@playwright/test';

test.use({ timezoneId: 'Asia/Seoul' });

test('opens the writing place, keeps its draft across garden visits, and pauses movement while editing', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-07T15:30:00Z'));
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  const editor = page.getByRole('region', { name: '일기 작성' });
  await expect(editor).toBeVisible();
  await expect(page.getByLabel('기록 날짜')).toHaveValue('2026-11-08');
  await page.getByLabel('기록 날짜').fill('2026-11-06');
  await page.getByLabel('제목').fill('정원에서 보낸 하루');
  await page.getByLabel('오늘의 이야기').pressSequentially('WASD로 걸어와 첫 문장을 적었어요.');
  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('제목')).toHaveValue('정원에서 보낸 하루');
  await expect(page.getByLabel('오늘의 이야기')).toHaveValue('WASD로 걸어와 첫 문장을 적었어요.');
  await expect(page.getByLabel('기록 날짜')).toHaveValue('2026-11-06');
});

test('reaches the writing screen from the fallback map', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(args[0])) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/garden');
  await page.getByRole('button', { name: '지도에서 일기장 열기' }).click();
  await expect(page.getByRole('region', { name: '일기 작성' })).toBeVisible();
  await page.getByLabel('오늘의 이야기').fill('지도에서도 쓸 수 있어요.');
  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  await expect(page.getByRole('img', { name: '정원의 정적 지도' })).toBeVisible();
});
