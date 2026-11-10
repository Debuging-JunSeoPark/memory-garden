'use client';

import { useEffect, useState } from 'react';
import type { DiaryDraft } from '../model/diary-draft';
import { readDiaryEntry } from '../model/diary-storage';
import { PhotoPreview } from './diary-photos';

export function DiaryMemory({ date }: { date: string }) {
  const [entry, setEntry] = useState<DiaryDraft | null>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    void readDiaryEntry(date).then(
      (result) => {
        if (current) setEntry(result ?? null);
      },
      () => {
        if (current) setFailed(true);
      },
    );
    return () => {
      current = false;
    };
  }, [date, attempt]);

  if (failed) {
    return (
      <>
        <p role="alert">일기를 불러오지 못했어요.</p>
        <button
          type="button"
          className="min-h-11 underline"
          onClick={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
        >
          다시 불러오기
        </button>
      </>
    );
  }
  if (entry === undefined) return <p role="status">일기를 불러오는 중이에요.</p>;
  if (!entry) return <p>이 날짜에 저장된 일기가 없어요.</p>;

  return (
    <>
      {entry.title && <h3 className="mb-4 text-xl font-semibold break-words">{entry.title}</h3>}
      <p className="leading-7 break-words whitespace-pre-wrap">{entry.body}</p>
      {entry.photos.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {entry.photos.map((photo) => (
            <figure key={photo.id}>
              <PhotoPreview photo={photo} />
              {photo.description && (
                <figcaption className="mt-2 text-sm break-words">{photo.description}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
