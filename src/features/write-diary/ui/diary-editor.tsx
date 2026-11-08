'use client';

import { useEffect, useRef } from 'react';
import type { DiaryDraft } from '../model/diary-draft';

export function DiaryEditor({
  draft,
  onChange,
  onClose,
}: {
  draft: DiaryDraft;
  onChange: (draft: DiaryDraft) => void;
  onClose: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  const inputClass =
    'mt-2 w-full rounded-xl border border-moss/25 bg-white/50 px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss';

  return (
    <section
      aria-labelledby="diary-editor-title"
      className="absolute inset-0 overflow-y-auto bg-[#e2e9d9] px-4 py-5 sm:px-8 sm:py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-xs tracking-[0.15em] text-moss">작은 하루를 남기는 곳</p>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer rounded-full border border-moss/30 bg-paper px-4 text-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
          >
            정원으로 돌아가기
          </button>
        </div>
        <div className="rounded-3xl border border-[#ddc9a5] bg-[#fff8e9] p-6 shadow-lg sm:p-10">
          <h2
            ref={heading}
            tabIndex={-1}
            id="diary-editor-title"
            className="text-2xl font-semibold outline-none"
          >
            일기 작성
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            오늘 기억하고 싶은 이야기를 천천히 적어보세요.
          </p>
          <p
            id="diary-draft-notice"
            className="mt-4 rounded-xl bg-[#ecefdc] p-3 text-sm leading-6 text-moss"
          >
            작성 화면을 미리 사용해 보는 단계예요. 입력은 정원에 다녀와도 유지되며, 새로고침하면
            사라져요.
          </p>
          <div
            role="group"
            aria-label="일기 입력"
            aria-describedby="diary-draft-notice"
            className="mt-6 grid gap-5"
          >
            <label className="text-sm font-medium">
              기록 날짜
              <input
                type="date"
                value={draft.date}
                onChange={(event) => onChange({ ...draft, date: event.target.value })}
                className={`${inputClass} block max-w-xs`}
              />
            </label>
            <label className="text-sm font-medium">
              제목
              <span className="ml-2 font-normal text-ink/60">선택</span>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => onChange({ ...draft, title: event.target.value })}
                placeholder="오늘을 한 문장으로"
                className={inputClass}
              />
            </label>
            <label className="text-sm font-medium">
              오늘의 이야기
              <textarea
                value={draft.body}
                onChange={(event) => onChange({ ...draft, body: event.target.value })}
                placeholder="어떤 하루였나요?"
                rows={10}
                className={`${inputClass} min-h-60 resize-y leading-7`}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
