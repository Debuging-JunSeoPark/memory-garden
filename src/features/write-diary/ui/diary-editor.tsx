'use client';

import { useEffect, useRef } from 'react';
import type { DiaryDraft } from '../model/diary-draft';
import { DiaryPhotos } from './diary-photos';

export function DiaryEditor({
  draft,
  active,
  onChange,
  onClose,
}: {
  draft: DiaryDraft;
  active: boolean;
  onChange: (update: (current: DiaryDraft) => DiaryDraft) => void;
  onClose: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (active) heading.current?.focus({ preventScroll: true });
  }, [active]);

  return (
    <section
      hidden={!active}
      aria-labelledby="diary-editor-title"
      className="absolute inset-0 overflow-y-auto bg-[#eef0e9]/35 px-4 py-5 text-[#424e43] sm:px-8 sm:py-8"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4 sm:mb-9">
          <h2
            ref={heading}
            tabIndex={-1}
            id="diary-editor-title"
            className="text-base font-medium tracking-tight outline-none"
          >
            일기 작성
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer rounded-full px-4 text-sm text-[#52614f] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
          >
            <span aria-hidden="true" className="mr-2">
              ←
            </span>
            정원으로 돌아가기
          </button>
        </header>
        <div className="rounded-[28px] border border-white/80 bg-[#fffef9] px-6 py-7 shadow-[0_12px_60px_#5b705a0c] sm:rounded-[36px] sm:px-11 sm:py-9 lg:mr-56">
          <label className="inline-flex max-w-full items-center gap-3 rounded-full bg-[#f0f3eb] px-4 text-xs font-medium text-[#5d6a57]">
            <span className="shrink-0">기록 날짜</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => {
                const date = event.target.value;
                onChange((current) => ({ ...current, date }));
              }}
              className="min-h-11 min-w-0 rounded-lg bg-transparent text-sm text-[#424e43] focus-visible:outline-2 focus-visible:outline-moss"
            />
          </label>
          <div
            role="group"
            aria-label="일기 입력"
            aria-describedby="diary-draft-notice"
            className="mt-8 grid gap-7"
          >
            <label>
              <span className="sr-only">제목</span>
              <input
                type="text"
                value={draft.title}
                placeholder="오늘의 제목, 없어도 괜찮아요"
                onChange={(event) => {
                  const title = event.target.value;
                  onChange((current) => ({ ...current, title }));
                }}
                className="min-h-12 w-full rounded-lg bg-transparent text-xl font-medium tracking-tight text-[#424e43] placeholder:font-normal placeholder:text-[#899180] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss sm:text-2xl"
              />
            </label>
            <label>
              <span className="sr-only">오늘의 이야기</span>
              <textarea
                value={draft.body}
                placeholder="오늘은 어떤 하루였나요?"
                rows={9}
                onChange={(event) => {
                  const body = event.target.value;
                  onChange((current) => ({ ...current, body }));
                }}
                className="min-h-60 w-full resize-y rounded-lg bg-transparent text-[15px] leading-8 text-[#424e43] placeholder:text-[#8b9485] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss sm:min-h-72"
              />
            </label>
          </div>
          <div className="mt-5 border-t border-[#edf0e7] pt-6">
            <DiaryPhotos photos={draft.photos} onChange={onChange} />
          </div>
          <p id="diary-draft-notice" className="mt-6 text-xs leading-6 text-[#737c6e]">
            글과 사진은 이 페이지에서 이어 쓸 수 있어요. 새로고침하면 사라져요.
          </p>
        </div>
      </div>
    </section>
  );
}
