export function prioritizeShelfMonths<T extends { month: string }>(
  records: T[],
  preferred: string | null,
): T[] {
  const index = records.findIndex(({ month }) => month === preferred);
  if (index <= 0) return records;
  return [records[index], ...records.slice(0, index), ...records.slice(index + 1)];
}
