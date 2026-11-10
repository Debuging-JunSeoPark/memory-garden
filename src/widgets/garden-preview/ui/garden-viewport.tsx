'use client';

import dynamic from 'next/dynamic';
import { DiaryEditor, DiaryMemory, readDiaryMonths } from '@/features/write-diary';
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

const monthsPerShelf = 14;
const datesPerBed = 6;

function monthLabel(month: string) {
  const [year, number] = month.split('-');
  return `${year}년 ${Number(number)}월`;
}

function RecordPages({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (page: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        type="button"
        aria-label="이전 페이지"
        className={controlClass}
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
      >
        ‹
      </button>
      <span>
        {page + 1} / {total}
      </span>
      <button
        type="button"
        aria-label="다음 페이지"
        className={controlClass}
        disabled={page + 1 === total}
        onClick={() => onPage(page + 1)}
      >
        ›
      </button>
    </div>
  );
}

export function GardenViewport({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'garden' | 'shelf' | 'book' | 'diary'>('garden');
  const [available, setAvailable] = useState(true);
  const [ready, setReady] = useState(false);
  const [nearShelf, setNearShelf] = useState(false);
  const [nearWritingPlace, setNearWritingPlace] = useState(isNearWritingPlace(spawnPosition));
  const [diaryOpened, setDiaryOpened] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [joystick, setJoystick] = useState(still);
  const [months, setMonths] = useState<Awaited<ReturnType<typeof readDiaryMonths>>>([]);
  const [revision, setRevision] = useState(0);
  const [recordsFailed, setRecordsFailed] = useState(false);
  const [shelfPage, setShelfPage] = useState(0);
  const [flowerPage, setFlowerPage] = useState(0);
  const [collection, setCollection] = useState<string | null>(null);
  const [memoryDate, setMemoryDate] = useState<string | null>(null);
  const overlayHeading = useRef<HTMLHeadingElement>(null);
  const origin = useRef<HTMLElement | null>(null);
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
    setDiaryOpened(true);
    setView('diary');
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

  useEffect(() => {
    let current = true;
    void readDiaryMonths().then(
      (result) => {
        if (!current) return;
        setMonths(result);
        setRecordsFailed(false);
      },
      () => {
        if (current) setRecordsFailed(true);
      },
    );
    return () => {
      current = false;
    };
  }, [revision]);

  useEffect(() => {
    if (collection) overlayHeading.current?.focus({ preventScroll: true });
  }, [collection, memoryDate]);

  const refreshRecords = () => setRevision((previous) => previous + 1);
  const dates = months.flatMap((month) => month.dates);
  const shelfPages = Math.ceil(months.length / monthsPerShelf);
  const flowerPages = Math.ceil(dates.length / datesPerBed);
  const activeShelfPage = Math.min(shelfPage, Math.max(0, shelfPages - 1));
  const activeFlowerPage = Math.min(flowerPage, Math.max(0, flowerPages - 1));
  const visibleMonths = months.slice(
    activeShelfPage * monthsPerShelf,
    (activeShelfPage + 1) * monthsPerShelf,
  );
  const visibleDates = dates.slice(
    activeFlowerPage * datesPerBed,
    (activeFlowerPage + 1) * datesPerBed,
  );
  const collectionDates =
    collection === 'flowers'
      ? visibleDates
      : (months.find(({ month }) => month === collection)?.dates ?? []);

  function openCollection(next: string, date: string | null = null) {
    origin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setJoystick(still);
    setCollection(next);
    setMemoryDate(date);
  }

  function closeCollection() {
    setCollection(null);
    setMemoryDate(null);
    requestAnimationFrame(() => {
      const target = origin.current;
      if (target?.isConnected && target !== document.body) target.focus({ preventScroll: true });
      else
        (view === 'shelf' ? shelfHeading.current : stage.current)?.focus({ preventScroll: true });
    });
  }

  const map = <GardenMap onOpenShelf={openShelf} onOpenDiary={openDiary} />;
  return (
    <section
      ref={stage}
      tabIndex={-1}
      aria-label="정원 미리보기"
      className="relative h-svh min-h-72 bg-[radial-gradient(ellipse_at_50%_38%,#f4f1df_5%,#dde8d9_82%)] outline-none"
    >
      <div
        className="absolute inset-0"
        inert={view === 'book' || view === 'diary' || collection !== null}
      >
        {available ? (
          <SceneErrorBoundary fallback={map} onFailure={showMap}>
            <GardenCanvas
              onUnavailable={showMap}
              onReady={markReady}
              onOpenGuide={openBook}
              months={visibleMonths.map(({ month }) => month)}
              dates={visibleDates}
              onOpenMonth={openCollection}
              onOpenMemory={(date) => openCollection('flowers', date)}
              onNearShelf={setNearShelf}
              onFirstMove={markMoved}
              onOpenShelf={openShelf}
              onOpenDiary={openDiary}
              onNearWritingPlace={setNearWritingPlace}
              nearWritingPlace={nearWritingPlace}
              walking={view === 'garden' && !collection}
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
      {available && ready && view === 'garden' && !collection && (
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
        <div inert={collection !== null} hidden={collection !== null}>
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
          <div className="absolute inset-x-4 bottom-6 grid justify-items-center gap-2">
            {visibleMonths.length > 0 && (
              <div
                aria-label="월별 기록 책"
                className="flex max-h-28 max-w-xl flex-wrap justify-center gap-2 overflow-auto rounded-xl bg-paper/90 p-2"
              >
                {visibleMonths.map(({ month }) => (
                  <button
                    key={month}
                    type="button"
                    className={controlClass}
                    onClick={() => openCollection(month)}
                  >
                    {monthLabel(month)} 책
                  </button>
                ))}
              </div>
            )}
            <RecordPages page={activeShelfPage} total={shelfPages} onPage={setShelfPage} />
            <button type="button" className={controlClass} onClick={() => setView('garden')}>
              정원으로 돌아가기
            </button>
          </div>
        </div>
      )}
      {view === 'garden' && visibleDates.length > 0 && (
        <div
          className="absolute top-12 right-4 grid justify-items-end gap-2"
          inert={collection !== null}
        >
          <button type="button" className={controlClass} onClick={() => openCollection('flowers')}>
            기억의 꽃 {dates.length}송이
          </button>
          <RecordPages page={activeFlowerPage} total={flowerPages} onPage={setFlowerPage} />
        </div>
      )}
      {recordsFailed && !collection && (view === 'garden' || view === 'shelf') && (
        <div className="absolute top-12 left-4 rounded-xl bg-paper p-2 text-xs">
          <p role="alert">저장된 기록 목록을 불러오지 못했어요.</p>
          <button type="button" className="min-h-11 underline" onClick={refreshRecords}>
            다시 불러오기
          </button>
        </div>
      )}
      {collection && (
        <article
          aria-labelledby="garden-memory-heading"
          className="absolute inset-0 overflow-auto bg-[#dbe5d5] px-4 py-6 sm:px-8"
        >
          <div className="mx-auto max-w-2xl rounded-3xl bg-paper p-6 shadow">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2
                id="garden-memory-heading"
                tabIndex={-1}
                ref={overlayHeading}
                className="text-lg font-semibold outline-none"
              >
                {memoryDate ??
                  (collection === 'flowers' ? '기억의 꽃' : `${monthLabel(collection)} 책`)}
              </h2>
              <button type="button" className={controlClass} onClick={closeCollection}>
                닫기
              </button>
            </div>
            {memoryDate ? (
              <>
                <DiaryMemory key={memoryDate} date={memoryDate} />
                <button
                  type="button"
                  className={`${controlClass} mt-6`}
                  onClick={() => setMemoryDate(null)}
                >
                  날짜 목록으로
                </button>
              </>
            ) : (
              <ul className="grid gap-2">
                {collectionDates.map((date) => (
                  <li key={date}>
                    <button
                      type="button"
                      className={controlClass}
                      onClick={() => setMemoryDate(date)}
                    >
                      {date} 기록 열기
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      )}
      {diaryOpened && (
        <DiaryEditor
          active={view === 'diary'}
          onClose={() => setView('garden')}
          onSaved={refreshRecords}
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
