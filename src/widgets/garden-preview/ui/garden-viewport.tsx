'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { GardenMap } from './garden-map';
import { SceneErrorBoundary } from './scene-error-boundary';

const GardenCanvas = dynamic(
  () => import('./garden-canvas').then((module) => module.GardenCanvas),
  { ssr: false },
);

const controlClass =
  'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-moss/20 bg-paper/90 px-3 py-2 text-xs font-medium text-ink shadow-sm hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss sm:px-4 sm:text-sm';

export function GardenViewport({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'scene' | 'map'>('scene');
  const [ready, setReady] = useState(false);
  const guide = useRef<HTMLDialogElement>(null);
  const guideButton = useRef<HTMLButtonElement>(null);
  const showMap = useCallback(() => setMode('map'), []);
  const markReady = useCallback(() => setReady(true), []);
  const openGuide = useCallback(() => {
    guideButton.current?.focus({ preventScroll: true });
    guide.current?.showModal();
  }, []);

  return (
    <section
      aria-label="정원 미리보기"
      className="relative h-svh min-h-72 bg-[radial-gradient(ellipse_at_50%_38%,#f4f1df_5%,#dde8d9_82%)]"
    >
      {mode === 'map' ? (
        <GardenMap />
      ) : (
        <SceneErrorBoundary fallback={<GardenMap />} onFailure={showMap}>
          <GardenCanvas onUnavailable={showMap} onReady={markReady} onOpenGuide={openGuide} />
        </SceneErrorBoundary>
      )}
      <p
        role="status"
        className={
          ready || mode === 'map'
            ? 'sr-only'
            : 'pointer-events-none absolute inset-0 grid place-items-center text-sm text-moss'
        }
      >
        {mode === 'map'
          ? '정적 지도로 정원을 보고 있어요.'
          : ready
            ? '나무와 꽃밭이 있는 작은 정원이에요.'
            : '정원을 불러오고 있어요.'}
      </p>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 sm:inset-x-6 sm:bottom-6">
        <button
          ref={guideButton}
          type="button"
          aria-haspopup="dialog"
          onClick={openGuide}
          className={`pointer-events-auto ${controlClass}`}
        >
          <span
            aria-hidden="true"
            className="h-5 w-3.5 shrink-0 rounded-r-sm border-l-3 border-[#a95f45] bg-[#d29067]"
          />
          정원 안내서
        </button>
        <button
          type="button"
          onClick={() => {
            setReady(false);
            setMode(mode === 'scene' ? 'map' : 'scene');
          }}
          className={`pointer-events-auto ${controlClass}`}
        >
          {mode === 'scene' ? '정적 지도로 보기' : '3D로 보기'}
        </button>
      </div>
      <dialog
        ref={guide}
        aria-labelledby="garden-guide-title"
        className="m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-moss/20 bg-paper p-5 text-ink shadow-xl backdrop:bg-ink/30 sm:p-7"
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-moss/20 pb-3">
          <h2 id="garden-guide-title" className="text-sm font-semibold text-moss">
            정원 안내서
          </h2>
          <button type="button" onClick={() => guide.current?.close()} className={controlClass}>
            닫기
          </button>
        </div>
        <div className="text-sm leading-6">{children}</div>
      </dialog>
    </section>
  );
}
