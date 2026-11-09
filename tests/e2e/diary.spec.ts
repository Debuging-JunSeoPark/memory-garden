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

test('adds photos with descriptions, keeps them across garden visits, and removes them', async ({ page }) => {
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  const photo = {
    name: 'garden.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lV0AAAAASUVORK5CYII=', 'base64'),
  };
  await page.getByLabel('사진 추가').setInputFiles([photo]);
  await expect(page.getByRole('img', { name: 'garden.png' })).toBeVisible();
  await page.getByLabel('사진 1 설명').fill('햇살이 비치는 정원');
  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('img', { name: '햇살이 비치는 정원' })).toBeVisible();
  await page.getByRole('button', { name: '사진 1 삭제' }).click();
  await expect(page.getByRole('img', { name: '햇살이 비치는 정원' })).toHaveCount(0);
  await page.getByLabel('사진 추가').setInputFiles([photo]);
  await expect(page.getByRole('img', { name: 'garden.png' })).toBeVisible();
  await page.getByLabel('사진 추가').setInputFiles(
    Array.from({ length: 8 }, (_, index) => ({ ...photo, name: `extra-${index}.png` })),
  );
  const gallery = page.getByRole('region', { name: '오늘의 사진' });
  await expect(gallery.getByRole('img')).toHaveCount(8);
  await expect(gallery.getByRole('alert')).toContainText('최대 8장');
});

test('reports unsupported and damaged images without losing text', async ({ page }) => {
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  await page.getByLabel('오늘의 이야기').fill('사진을 고르는 중에도 이 문장은 남아요.');
  await page.getByLabel('사진 추가').setInputFiles([
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
    { name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('invalid image') },
    { name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) },
  ]);
  await expect(page.getByRole('region', { name: '오늘의 사진' }).getByRole('alert')).toContainText('notes.txt');
  await expect(page.getByRole('region', { name: '오늘의 사진' }).getByRole('alert')).toContainText('broken.png');
  await expect(page.getByRole('region', { name: '오늘의 사진' }).getByRole('alert')).toContainText('10MB');
  await expect(page.getByLabel('오늘의 이야기')).toHaveValue('사진을 고르는 중에도 이 문장은 남아요.');
});

test('keeps the photo loading operation active when the editor is closed and reopened', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Image.prototype.decode;
    let pauseOnce = true;
    Image.prototype.decode = async function () {
      await original.call(this);
      if (pauseOnce) {
        pauseOnce = false;
        await new Promise<void>((resolve) => window.addEventListener('resume-photo-test', () => resolve(), { once: true }));
      }
    };
  });
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  await page.getByLabel('사진 추가').setInputFiles({
    name: 'loading.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lV0AAAAASUVORK5CYII=', 'base64'),
  });
  await expect(page.getByLabel('사진 추가')).toBeDisabled();
  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('사진 추가')).toBeDisabled();
  await page.evaluate(() => window.dispatchEvent(new Event('resume-photo-test')));
  await expect(page.getByRole('img', { name: 'loading.png' })).toBeVisible();
});

test('restores a dated entry with its photo after reload and persists edits', async ({ page }) => {
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');

  const date = page.getByLabel('기록 날짜');
  const title = page.getByLabel('제목');
  const body = page.getByLabel('오늘의 이야기');
  const save = page.getByRole('button', { name: '일기 저장', exact: true });
  await date.fill('2026-11-05');
  await title.fill('정원 기록');
  await body.fill('첫 번째 기록');
  await page.getByLabel('사진 추가').setInputFiles({
    name: 'garden.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lV0AAAAASUVORK5CYII=', 'base64'),
  });
  await page.getByLabel('사진 1 설명').fill('저장할 사진');
  await save.click();
  await expect(page.getByText('일기를 저장했어요.')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  await date.fill('2026-11-05');
  await expect(title).toHaveValue('정원 기록');
  await expect(body).toHaveValue('첫 번째 기록');
  const photo = page.getByRole('img', { name: '저장할 사진' });
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  await body.fill('수정한 기록');
  await date.fill('2026-11-04');
  await expect(body).toHaveValue('');
  await date.fill('2026-11-05');
  await expect(body).toHaveValue('수정한 기록');
  await page.getByRole('button', { name: '사진 1 삭제' }).click();
  await save.click();
  await expect(page.getByText('일기를 저장했어요.')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');
  await date.fill('2026-11-05');
  await expect(body).toHaveValue('수정한 기록');
  await expect(photo).toHaveCount(0);
});

test('rejects blank writing and keeps the draft when a storage transaction aborts', async ({ page }) => {
  await page.addInitScript(() => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args: Parameters<typeof put>) {
      const request = put.apply(this, args);
      request.addEventListener('success', () => this.transaction.abort());
      return request;
    };
  });
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await page.keyboard.press('Enter');

  const editor = page.getByRole('region', { name: '일기 작성' });
  const save = editor.getByRole('button', { name: '일기 저장', exact: true });
  const body = editor.getByLabel('오늘의 이야기');
  await body.fill('   ');
  await save.click();
  await expect(editor.getByRole('alert')).toContainText('본문을 입력해 주세요');
  await body.fill('저장 오류에도 남을 글');
  await save.click();
  await expect(editor.getByRole('alert')).toContainText('일기를 저장하지 못했어요');
  await expect(body).toHaveValue('저장 오류에도 남을 글');
  await expect(save).toBeEnabled();
});
