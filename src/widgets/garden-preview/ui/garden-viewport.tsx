'use client';

import dynamic from 'next/dynamic';
import { DiaryEditor, createDiaryDraft, type DiaryDraft } from '@/features/write-diary';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { GardenJoystick } from './garden-joystick';
import { GardenMap } from './garden-map';
import { still, isNearWritingPlace, spawnPosition } from './garden-walk';
import { SceneErrorBoundary } from './scene-error-boundary';

const GardenCanvas = dynamic(
  () => import('./garden-canvas').then((module) => module.GardenCanvas),
  { ssr: false },
);

const controlClass =
  'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-moss/30 bg-paper px-4 py-2 text-sm font-medium text-ink shadow-sm hover:bg-[#e9edda] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss';

export function GardenViewport({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'garden' | 'shelf' | 'book' | 'diary'>('garden');
  const [available, setAvailable] = useState(true);
  const [ready, setReady] = useState(false);
  const [nearShelf, setNearShelf] = useState(false);
  const [nearWritingPlace, setNearWritingPlace] = useState(isNearWritingPlace(spawnPosition));
  const [draft, setDraft] = useState<DiaryDraft | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [joystick, setJoystick] = useState(still);
  const stage = useRef<HTMLElement>(null);
  const shelfHeading = useRef<HTMLHeadingElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const writingAction = useRef<HTMLButtonElement>(null);
  const lastView = useRef(view);

  const showMap = useCallback(() => {
    setAvailable(false);
  }, []);
  const markReady = useCallback(() => setReady(true), []);
  const markMoved = useCallback(() => setHasMoved(true), []);
  const openShelf = useCallback(() => {
    setJoystick(still);
    setView('shelf');
  }, []);
  const openDiary = useCallback(() => {
    setJoystick(still);
    setDraft((current) => current ?? createDiaryDraft());
    setView('diary');
  }, []);
  const updateDraft = useCallback((update: (current: DiaryDraft) => DiaryDraft) => {
    setDraft((current) => (current ? update(current) : current));
  }, []);
  const openBook = useCallback(() => setView('book'), []);
  const closeBook = () => setView('shelf');

  useEffect(() => {
    if (view === lastView.current) return;
    if (view !== 'diary') {
      const returnAction = lastView.current === 'diary' ? writingAction.current : action.current;
      const target = view === 'shelf' ? shelfHeading.current : (returnAction ?? stage.current);
      target?.focus({ preventScroll: true });
    }
    lastView.current = view;
  }, [view]);

  const map = <GardenMap onOpenShelf={openShelf} onOpenDiary={openDiary} />;
  return (
    <section
      ref={stage}
      tabIndex={-1}
      aria-label="정원 미리보기"
      className="relative h-svh min-h-72 bg-[radial-gradient(ellipse_at_50%_38%,#f4f1df_5%,#dde8d9_82%)] outline-none"
    >
      <div className="absolute inset-0" inert={view === 'book' || view === 'diary'}>
        {available ? (
          <SceneErrorBoundary fallback={map} onFailure={showMap}>
            <GardenCanvas
              onUnavailable={showMap}
              onReady={markReady}
              onOpenGuide={openBook}
              onNearShelf={setNearShelf}
              onFirstMove={markMoved}
              onOpenShelf={openShelf}
              onOpenDiary={openDiary}
              onNearWritingPlace={setNearWritingPlace}
              nearWritingPlace={nearWritingPlace}
              walking={view === 'garden'}
              diary={view === 'diary'}
              joystick={joystick}
              nearShelf={nearShelf}
              shelf={view === 'shelf' || view === 'book'}
            />
          </SceneErrorBoundary>
        ) : view === 'garden' ? (
          <GardenMap
            onOpenShelf={openShelf}
            onOpenDiary={openDiary}
            actionRef={action}
            writingRef={writingAction}
          />
        ) : null}
      </div>
      <p
        role="status"
        className={
          ready || !available
            ? 'sr-only'
            : 'pointer-events-none absolute inset-0 grid place-items-center text-sm text-moss'
        }
      >
        {available
          ? ready
            ? nearShelf && view === 'garden'
              ? '책장에 도착했어요. 책장을 누르거나 Enter 키로 열 수 있어요.'
              : nearWritingPlace && view === 'garden'
                ? '일기장 곁에 있어요. 일기장을 누르거나 Enter 키로 펼칠 수 있어요.'
                : '정원을 둘러볼 수 있어요.'
            : '정원을 불러오고 있어요.'
          : '정적 지도로 정원을 보고 있어요.'}
      </p>
      {available && ready && view === 'garden' && (
        <>
          {!hasMoved && (
            <p className="pointer-events-none absolute inset-x-4 top-5 text-center text-xs text-ink">
              <span className="[@media(pointer:coarse)]:hidden">방향키 또는 WASD로 이동</span>
              <span className="[@media(pointer:fine)]:hidden">조이스틱으로 이동</span>
            </p>
          )}
          <GardenJoystick direction={joystick} onMove={setJoystick} />
          {nearWritingPlace && (
            <button
              type="button"
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-14 focus-visible:left-4"
              onClick={openDiary}
            >
              일기 작성하기
            </button>
          )}
          {nearShelf && (
            <p
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-5 text-center text-xs text-ink"
            >
              책장을 눌러 살펴보기
            </p>
          )}
        </>
      )}
      {view === 'shelf' && (
        <>
          <h2
            ref={shelfHeading}
            tabIndex={-1}
            className="absolute inset-x-0 top-6 text-center font-semibold outline-none"
          >
            기억의 책장
          </h2>
          <button
            type="button"
            className={
              available
                ? `sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-16 focus-visible:left-1/2 focus-visible:-translate-x-1/2 ${controlClass}`
                : 'absolute top-1/2 left-1/2 min-h-32 -translate-1/2 cursor-pointer rounded-r-xl border-l-8 border-[#a95f45] bg-[#d29067] px-6 font-semibold text-ink shadow-lg'
            }
            onClick={openBook}
          >
            정원 안내서 펼치기
          </button>
          <div className="absolute inset-x-4 bottom-6 flex justify-center">
            <button type="button" className={controlClass} onClick={() => setView('garden')}>
              정원으로 돌아가기
            </button>
          </div>
        </>
      )}
      {draft && (
        <DiaryEditor
          active={view === 'diary'}
          draft={draft}
          onChange={updateDraft}
          onClose={() => setView('garden')}
        />
      )}
      {view === 'book' && (
        <article
          aria-label="정원 안내서"
          className="absolute inset-0 overflow-auto bg-[#dbe5d5] px-4 py-5 sm:px-8 sm:py-8"
        >
          <div className="mx-auto mb-4 flex max-w-3xl justify-end">
            <button ref={action} type="button" className={controlClass} onClick={closeBook}>
              책 덮기
            </button>
          </div>
          {children}
        </article>
      )}
    </section>
  );
}
