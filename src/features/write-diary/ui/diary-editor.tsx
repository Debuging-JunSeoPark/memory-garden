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
      className="absolute inset-0 overflow-y-auto bg-[#e2e9d9]/25 px-4 py-5 sm:px-8 sm:py-8"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <span className="rounded-full bg-paper/85 px-4 py-2 text-xs tracking-widest text-moss">
            나의 기억 노트
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 cursor-pointer rounded-full border border-moss/25 bg-paper/95 px-4 text-sm shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
          >
            정원으로 돌아가기
          </button>
        </header>
        <div className="relative isolate pb-5 [perspective:1800px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-1 top-5 bottom-0 -z-10 rounded-2xl border-b-8 border-[#815c43] bg-[#bd8b61] shadow-2xl"
          />
          <div className="grid rounded-2xl border border-[#d6bd96] bg-[#fff6e2] shadow-[0_12px_35px_#56402a25] lg:grid-cols-[0.8fr_1.2fr] lg:[transform:rotateX(2deg)]">
            <div className="relative rounded-t-2xl border-b border-[#deceb1] bg-linear-to-r from-[#fdf5e2] via-[#fff9e9] to-[#e7d6b6] px-6 py-7 sm:px-9 lg:rounded-l-2xl lg:rounded-tr-none lg:border-r lg:border-b-0">
              <div
                aria-hidden="true"
                className="absolute -top-1 left-9 h-12 w-5 bg-[#bd795b] shadow-sm [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]"
              />
              <p className="mt-8 text-[10px] tracking-[0.3em] text-moss">A DAY TO REMEMBER</p>
              <h2
                ref={heading}
                tabIndex={-1}
                id="diary-editor-title"
                className="mt-3 text-3xl font-semibold tracking-tight outline-none"
              >
                일기 작성
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                작은 장면 하나도
                <br />
                오래 간직할 이야기가 되니까.
              </p>
              <label className="mt-7 block text-xs font-medium text-moss">
                기록 날짜
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => {
                    const date = event.target.value;
                    onChange((current) => ({ ...current, date }));
                  }}
                  className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-[#cbbf9f] bg-white/40 px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-moss"
                />
              </label>
              <DiaryPhotos photos={draft.photos} onChange={onChange} />
              <p className="mt-6 text-[11px] leading-6 text-ink/55">
                사진에 짧은 설명을 남겨두면,
                <br />
                나중에 블로그 글을 쓸 때도 이야기를 떠올리기 좋아요.
              </p>
            </div>
            <div className="rounded-b-2xl bg-linear-to-r from-[#e8d9bc] via-[#fffaed] to-[#fdf5e2] px-6 py-8 sm:px-9 lg:rounded-r-2xl lg:rounded-bl-none">
              <div
                role="group"
                aria-label="일기 입력"
                aria-describedby="diary-draft-notice"
                className="grid gap-7"
              >
                <label className="text-xs font-medium text-moss">
                  제목 <span className="ml-2 text-ink/45">선택</span>
                  <input
                    type="text"
                    value={draft.title}
                    placeholder="오늘을 한 문장으로"
                    onChange={(event) => {
                      const title = event.target.value;
                      onChange((current) => ({ ...current, title }));
                    }}
                    className="mt-2 min-h-14 w-full border-b border-[#cbbf9f] bg-transparent px-1 text-xl text-ink placeholder:text-ink/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
                  />
                </label>
                <label className="text-xs font-medium text-moss">
                  오늘의 이야기
                  <textarea
                    value={draft.body}
                    placeholder="어떤 하루였나요?"
                    rows={12}
                    onChange={(event) => {
                      const body = event.target.value;
                      onChange((current) => ({ ...current, body }));
                    }}
                    className="mt-4 min-h-80 w-full resize-y bg-[repeating-linear-gradient(transparent,transparent_31px,#c9b99755_31px,#c9b99755_32px)] px-1 text-base leading-8 text-ink placeholder:text-ink/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
                  />
                </label>
              </div>
              <p
                id="diary-draft-notice"
                className="mt-7 border-t border-[#d8c8a8] pt-4 text-[11px] leading-6 text-ink/55"
              >
                글과 사진은 이 페이지에서 이어 쓸 수 있어요. 새로고침하면 사라져요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
