import { expect, test, type Page } from '@playwright/test';

async function seedBooks(page: Page, months: string[]) {
  await page.evaluate(async (months) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('memory-garden-diary', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('entries', { keyPath: 'date' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('entries', 'readwrite');
      for (const month of months) {
        transaction.objectStore('entries').put({
          date: `${month}-01`, title: `${month} 예시`, body: `${month} 책장 검수용 가상 기록`, photos: [],
        });
      }
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
    });
    db.close();
  }, months);
  await page.reload();
  await expect(page.getByRole('status')).toContainText('일기장');
}

async function touchUntil(page: Page, x: number, y: number, arrived: () => Promise<void>) {
  const stick = await page.getByLabel('이동 조이스틱').boundingBox();
  if (!stick) throw new Error('Joystick unavailable');
  const touch = await page.context().newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: stick.x + stick.width * (0.5 + x / 3), y: stick.y + stick.height * (0.5 + y / 3) }],
  });
  try {
    await arrived();
  } finally {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.detach();
  }
}

async function approachShelf(page: Page, mobile: boolean, tapShelf = false) {
  const near = page.getByRole('status').filter({ hasText: '책장에 도착했어요' });
  if (mobile) await touchUntil(page, 0, -1, () => expect(near).toBeVisible({ timeout: 20000 }));
  else {
    await page.keyboard.down('ArrowUp');
    try {
      await expect(near).toBeVisible({ timeout: 20000 });
    } finally {
      await page.keyboard.up('ArrowUp');
    }
  }
  if (mobile && tapShelf) {
    // Fixed iPhone viewport: tap the visible shelf body after approaching August.
    // This must exercise the Three.js mesh handler, not the keyboard shortcut.
    await page.screenshot({ path: test.info().outputPath('august-before-shelf-tap.png') });
    const canvas = page.locator('canvas');
    const bounds = await canvas.boundingBox();
    if (!bounds) throw new Error('Garden canvas unavailable');
    await canvas.tap({ position: { x: bounds.width * 0.51, y: bounds.height * 0.29 } });
  } else await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '기억의 책장', exact: true })).toBeVisible();
}

test('reads local and other monthly books from the August land and restores its shelf page', async ({ page }, testInfo) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.clock.setFixedTime(new Date('2026-11-25T12:00:00+09:00'));
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await seedBooks(page, [
    '2026-11', '2026-10', '2026-09', '2026-08', '2026-07', '2026-06', '2026-05', '2026-04',
    '2026-03', '2026-02', '2026-01', '2025-12', '2025-11', '2025-10', '2025-09', '2025-08',
  ]);
  const month = page.getByText(/\d{4}년 \d{1,2}월 ·/);
  const august = '2026년 8월 · 한여름 햇살 정원';
  if (testInfo.project.name === 'mobile') {
    await touchUntil(page, 0.545, -0.838, () => expect(month).toHaveText(august, { timeout: 25000 }));
  } else {
    let arrived = false;
    const arrival = page.waitForFunction(
      ([node, text]) => node?.textContent === text,
      [await month.elementHandle(), august] as const,
      { timeout: 25000 },
    ).then(() => { arrived = true; });
    await page.keyboard.down('ArrowUp');
    try {
      for (let cycle = 0; cycle < 32 && !arrived; cycle += 1) {
        await page.keyboard.down('ArrowRight');
        await Promise.race([page.waitForTimeout(450), arrival]);
        if (arrived) break;
        await page.keyboard.up('ArrowRight');
        await Promise.race([page.waitForTimeout(170), arrival]);
      }
      await arrival;
    } finally {
      await Promise.all([page.keyboard.up('ArrowRight'), page.keyboard.up('ArrowUp')]);
    }
    await expect(month).toHaveText(august);
    // Clear the bridge landing before turning northwest toward the shelf.
    await page.keyboard.down('ArrowUp');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(250);
    await Promise.all([page.keyboard.up('ArrowRight'), page.keyboard.up('ArrowUp')]);
  }
  await approachShelf(page, testInfo.project.name === 'mobile', true);
  await expect(page.getByText('2026년 8월의 책장', { exact: true })).toBeVisible();
  await expect(page.getByRole('article', { name: '정원 안내서' })).toHaveCount(0);
  const books = page.getByRole('group', { name: '월별 기록 책' }).getByRole('button');
  await expect(books).toHaveCount(14);
  await expect(books.first()).toHaveText('2026년 8월 책');
  await page.screenshot({ path: testInfo.outputPath('august-bookshelf-local-first.png') });
  await page.getByRole('button', { name: '정원 안내서 펼치기' }).press('Enter');
  await expect(page.getByRole('article', { name: '정원 안내서' })).toBeVisible();
  await page.getByRole('button', { name: '책 덮기' }).click();

  for (const key of ['2026-08', '2026-11']) {
    const label = key === '2026-08' ? '2026년 8월 책' : '2026년 11월 책';
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.getByRole('button', { name: `${key}-01 기록 열기` }).click();
    await expect(page.getByRole('article', { name: `${key}-01` })).toContainText(`${key} 책장 검수용 가상 기록`);
    await page.getByRole('button', { name: '닫기', exact: true }).click();
  }
  await page.getByRole('button', { name: '다음 페이지', exact: true }).click();
  await expect(books).toHaveText(['2025년 9월 책', '2025년 8월 책']);
  await page.getByRole('button', { name: '정원으로 돌아가기', exact: true }).click();
  await expect(month).toHaveText(august);
  await expect(page.getByRole('status')).toContainText('책장에 도착했어요');
  await page.screenshot({ path: testInfo.outputPath('august-garden-after-shelf.png') });
  await page.keyboard.press('Enter');
  await expect(books).toHaveCount(14);
  await expect(books.first()).toHaveText('2026년 8월 책');
  expect(errors).toEqual([]);
});

test('keeps the guide and other books when the local month has no records', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2026-11-25T12:00:00+09:00'));
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await seedBooks(page, ['2026-10']);
  await approachShelf(page, testInfo.project.name === 'mobile');
  await expect(page.getByText('2026년 11월의 책장 · 아직 이 달의 기록이 없어요.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '2026년 11월 책', exact: true })).toHaveCount(0);
  await expect(page.getByRole('group', { name: '월별 기록 책' }).getByRole('button')).toHaveText(['2026년 10월 책']);
  await page.getByRole('button', { name: '정원 안내서 펼치기' }).press('Enter');
  await expect(page.getByRole('article', { name: '정원 안내서' })).toBeVisible();
});

test('does not label a failed record read as an empty month and recovers on retry', async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date('2026-11-25T12:00:00+09:00'));
  await page.addInitScript(() => {
    const original = IDBObjectStore.prototype.getAllKeys;
    let fail = true;
    IDBObjectStore.prototype.getAllKeys = function (...args: Parameters<typeof original>) {
      if (fail) {
        fail = false;
        throw new DOMException('Simulated record listing failure', 'UnknownError');
      }
      return original.apply(this, args);
    };
  });
  await page.goto('/garden');
  await expect(page.getByRole('status')).toContainText('일기장');
  await expect(page.getByRole('alert').filter({ hasText: '저장된 기록 목록을 불러오지 못했어요.' })).toBeVisible();
  await approachShelf(page, testInfo.project.name === 'mobile');
  await expect(page.getByText(/아직 이 달의 기록이 없어요/)).toHaveCount(0);
  await page.getByRole('button', { name: '다시 불러오기', exact: true }).click();
  await expect(page.getByText('2026년 11월의 책장 · 아직 이 달의 기록이 없어요.', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert').filter({ hasText: '저장된 기록 목록을 불러오지 못했어요.' })).toHaveCount(0);
});
