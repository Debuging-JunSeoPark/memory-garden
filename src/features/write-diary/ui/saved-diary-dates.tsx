import { useEffect, useState } from 'react';
import { readDiaryMonths } from '../model/diary-storage';

export function SavedDiaryDates({
  active,
  date,
  disabled,
  revision,
  onSelect,
}: {
  active: boolean;
  date: string;
  disabled: boolean;
  revision: number;
  onSelect: (date: string) => void;
}) {
  const [months, setMonths] = useState<Awaited<ReturnType<typeof readDiaryMonths>>>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active) return;
    let current = true;
    void readDiaryMonths().then(
      (result) => {
        if (!current) return;
        setMonths(result);
        setFailed(false);
      },
      () => {
        if (current) setFailed(true);
      },
    );
    return () => {
      current = false;
    };
  }, [active, attempt, revision]);

  if (failed) {
    return (
      <div className="mt-3 text-sm">
        <p role="alert">저장한 날짜 목록을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => setAttempt((previous) => previous + 1)}
          className="min-h-11 underline"
        >
          목록 다시 불러오기
        </button>
      </div>
    );
  }

  if (!months?.length) return null;

  return (
    <label className="mt-3 flex w-fit max-w-full flex-wrap items-center gap-x-3 text-xs font-medium text-[#5d6a57]">
      저장한 날짜
      <select
        value={months.some(({ dates }) => dates.includes(date)) ? date : ''}
        disabled={disabled}
        onChange={(event) => onSelect(event.target.value)}
        className="min-h-11 rounded-lg border border-[#dce5d6] bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-moss"
      >
        <option value="" disabled>
          날짜를 선택해 주세요
        </option>
        {months.map(({ month, dates }) => {
          const [year, monthNumber] = month.split('-');
          return (
            <optgroup key={month} label={`${year}년 ${Number(monthNumber)}월`}>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}
