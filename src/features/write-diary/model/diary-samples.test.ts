import { expect, it } from 'vitest';
import { createDiarySamples } from './diary-samples';

it('fills every elapsed month without future dates or duplicate days', () => {
  const entries = createDiarySamples(new Date(2026, 10, 18));
  expect(entries).toHaveLength(53);
  expect(new Set(entries.map((entry) => entry.date.slice(0, 7))).size).toBe(11);
  expect(entries[0].date).toBe('2026-01-01');
  expect(entries.at(-1)?.date).toBe('2026-11-14');
  expect(
    entries.every((entry) => entry.date <= '2026-11-18' && entry.title.startsWith('[예시]')),
  ).toBe(true);
  expect(new Set(entries.map((entry) => entry.date)).size).toBe(entries.length);
  expect(createDiarySamples(new Date(2027, 0, 1)).map((entry) => entry.date)).toEqual([
    '2027-01-01',
  ]);
  expect(
    createDiarySamples(new Date(2024, 2, 1)).some((entry) => entry.date === '2024-02-29'),
  ).toBe(true);
});
