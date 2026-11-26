import { describe, expect, it } from 'vitest';
import { prioritizeShelfMonths } from './garden-shelf';

describe('monthly shelf book ordering', () => {
  const records = [
    { month: '2026-11', dates: ['2026-11-01'] },
    { month: '2026-08', dates: ['2026-08-01'] },
    { month: '2025-12', dates: ['2025-12-31'] },
  ];
  it('puts the local book first and preserves other books, dates and the source array', () => {
    expect(prioritizeShelfMonths(records, '2026-08')).toEqual([records[1], records[0], records[2]]);
    expect(records.map(({ month }) => month)).toEqual(['2026-11', '2026-08', '2025-12']);
  });
  it('keeps global and empty-month shelves without inventing a book', () => {
    expect(prioritizeShelfMonths(records, null)).toEqual(records);
    expect(prioritizeShelfMonths(records, '2026-07')).toEqual(records);
    expect(prioritizeShelfMonths([], '2026-07')).toEqual([]);
  });
  it('brings a book from a later page forward without dropping previous years', () => {
    const many = [
      '2026-11',
      '2026-10',
      '2026-09',
      '2026-08',
      '2026-07',
      '2026-06',
      '2026-05',
      '2026-04',
      '2026-03',
      '2026-02',
      '2026-01',
      '2025-12',
      '2025-11',
      '2025-10',
      '2025-09',
      '2025-08',
    ].map((month) => ({ month }));
    const ordered = prioritizeShelfMonths(many, '2025-08');
    expect(ordered.slice(0, 14).map(({ month }) => month)).toEqual([
      '2025-08',
      '2026-11',
      '2026-10',
      '2026-09',
      '2026-08',
      '2026-07',
      '2026-06',
      '2026-05',
      '2026-04',
      '2026-03',
      '2026-02',
      '2026-01',
      '2025-12',
      '2025-11',
    ]);
    expect(ordered.slice(14)).toEqual([{ month: '2025-10' }, { month: '2025-09' }]);
    expect(new Set(ordered.map(({ month }) => month)).size).toBe(16);
  });
});
