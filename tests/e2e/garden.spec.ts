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

test('opens stored entries from monthly books and paged daily flowers on the map', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(args[0])) return null;
      return original.apply(this, args);
    } as typeof original;
  });

  await page.goto('/garden');
  await expect(page.getByRole('button', { name: /기억의 꽃/ })).toHaveCount(0);
  await page.getByRole('button', { name: '지도에서 일기장 열기' }).click();
  const date = page.getByLabel('기록 날짜');
  const body = page.getByLabel('오늘의 이야기');

  const dates = ['2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-06'];
  for (const day of dates) {
    await date.fill(day);
    await body.fill(day === '2026-10-31' ? '지난달의 기억' : '이번 달의 기억');
    await page.getByRole('button', { name: '일기 저장', exact: true }).click();
    await expect(page.getByText('일기를 저장했어요.')).toBeVisible();
  }

  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  const flowers = page.getByRole('button', { name: '기억의 꽃 7송이' });
  await expect(flowers).toBeVisible();
  await page.getByRole('button', { name: '다음 페이지' }).click();
  await flowers.click();
  await page.getByRole('button', { name: '2026-10-31 기록 열기' }).click();
  await expect(page.getByRole('article', { name: '2026-10-31' })).toContainText('지난달의 기억');
  await page.getByRole('button', { name: '닫기', exact: true }).click();

  await page.reload();
  await page.getByRole('button', { name: '지도에서 책장 열기' }).click();
  await expect(page.getByRole('button', { name: '정원 안내서 펼치기' })).toBeVisible();
  const month = page.getByRole('button', { name: '2026년 11월 책' });
  await month.click();
  const book = page.getByRole('article', { name: '2026년 11월 책' });
  await expect(book.getByRole('button', { name: /기록 열기$/ })).toHaveCount(6);
  await book.getByRole('button', { name: '2026-11-06 기록 열기' }).click();
  await expect(page.getByRole('article', { name: '2026-11-06' })).toContainText('이번 달의 기억');
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await expect(month).toBeFocused();
});

test('collects selected monthly entries in date order and keeps selection when returning', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(args[0])) return null;
      return original.apply(this, args);
    } as typeof original;
    const get = IDBObjectStore.prototype.get;
    let failOnce = true;
    IDBObjectStore.prototype.get = function (key: IDBValidKey | IDBKeyRange) {
      const request = get.call(this, key);
      if (key === '2026-11-02' && failOnce) {
        failOnce = false;
        request.addEventListener('success', () => this.transaction.abort());
      }
      return request;
    };
  });
  await page.goto('/garden');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('memory-garden-diary', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('entries', { keyPath: 'date' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const bytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lV0AAAAASUVORK5CYII='), (char) => char.charCodeAt(0));
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('entries', 'readwrite');
      for (let day = 1; day <= 15; day += 1) {
        const date = `2026-11-${String(day).padStart(2, '0')}`;
        transaction.objectStore('entries').put({
          date, title: `${day}일 제목`, body: `${day}일 본문`,
          photos: day === 1 ? [{ id: 'sample', file: new File([bytes], 'sample.png', { type: 'image/png' }), description: '검수용 사진' }] : [],
        });
      }
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
    });
    db.close();
  });
  await page.reload();
  await page.getByRole('button', { name: '지도에서 책장 열기' }).click();
  await page.getByRole('button', { name: '2026년 11월 책' }).click();
  const gather = page.getByRole('button', { name: '선택한 기록 모아보기', exact: true });
  await expect(gather).toBeDisabled();
  for (let day = 1; day <= 14; day += 1) {
    await page.getByRole('checkbox', { name: `2026-11-${String(day).padStart(2, '0')} 선택` }).check();
  }
  await expect(page.getByRole('checkbox', { name: '2026-11-15 선택' })).toBeDisabled();
  for (let day = 3; day <= 14; day += 1) {
    await page.getByRole('checkbox', { name: `2026-11-${String(day).padStart(2, '0')} 선택` }).uncheck();
  }
  await gather.click();
  const collection = page.getByRole('article', { name: '선택한 기록 모아보기' });
  await expect(collection.getByRole('heading', { name: /^2026-/ })).toHaveText(['2026-11-01', '2026-11-02']);
  await expect(collection).toContainText('1일 본문');
  const image = collection.getByRole('img', { name: '검수용 사진' });
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(1);
  const failedEntry = collection.getByRole('region', { name: '2026-11-02' });
  await expect(failedEntry.getByRole('alert')).toBeVisible();
  await failedEntry.getByRole('button', { name: '다시 불러오기' }).click();
  await expect(failedEntry).toContainText('2일 본문');
  await collection.getByRole('button', { name: '날짜 선택으로' }).click();
  await expect(page.getByRole('checkbox', { name: '2026-11-01 선택' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: '2026-11-02 선택' })).toBeChecked();
  await page.getByRole('checkbox', { name: '2026-11-02 선택' }).uncheck();
  await gather.click();
  await expect(collection.getByRole('heading', { name: /^2026-/ })).toHaveText(['2026-11-01']);
});

test('walks over the bridge to the next monthly plot and returns', async ({ page }, testInfo) => {
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  const month = page.getByText(/정원 · 두 달 산책 미리보기/);
  const firstMonth = await month.innerText();
  await page.screenshot({ path: testInfo.outputPath('two-months-start.png') });

  if (testInfo.project.name === 'mobile') {
    const stick = await page.getByLabel('이동 조이스틱').boundingBox();
    if (!stick) throw new Error('Joystick is unavailable');
    const touch = await page.context().newCDPSession(page);
    const point = (x: number, y: number) => [
      { x: stick.x + stick.width * x, y: stick.y + stick.height * y },
    ];
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: point(0.5, 0.167),
    });
    await page.waitForTimeout(850);
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: point(0.167, 0.167),
    });
    await expect(month).not.toHaveText(firstMonth, { timeout: 15000 });
    await page.screenshot({ path: testInfo.outputPath('two-months-arrival.png') });
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: point(0.833, 0.833),
    });
    await expect(month).toHaveText(firstMonth, { timeout: 15000 });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.detach();
  } else {
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(850);
    await page.keyboard.down('ArrowLeft');
    await expect(month).not.toHaveText(firstMonth, { timeout: 15000 });
    await page.screenshot({ path: testInfo.outputPath('two-months-arrival.png') });
    await page.keyboard.up('ArrowLeft');
    await page.keyboard.up('ArrowUp');
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('ArrowRight');
    await expect(month).toHaveText(firstMonth, { timeout: 15000 });
    await page.keyboard.up('ArrowRight');
    await page.keyboard.up('ArrowDown');
  }
  await expect(page.getByRole('status')).toContainText('정원을 둘러볼 수 있어요.');
});
