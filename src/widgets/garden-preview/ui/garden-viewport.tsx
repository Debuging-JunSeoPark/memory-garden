'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { GardenMap } from './garden-map';
import { SceneErrorBoundary } from './scene-error-boundary';

const GardenCanvas = dynamic(
  () => import('./garden-canvas').then((module) => module.GardenCanvas),
  {
    ssr: false,
    loading: () => (
      <p role="status" className="flex h-full items-center justify-center text-sm text-moss">
        정원을 불러오고 있어요.
      </p>
    ),
  },
);

export function GardenViewport() {
  const [mode, setMode] = useState<'scene' | 'map'>('scene');
  const [ready, setReady] = useState(false);
  const showMap = useCallback(() => setMode('map'), []);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <section aria-label="정원 미리보기" className="min-w-0">
      <div className="relative h-[380px] overflow-hidden rounded-3xl border border-moss/15 bg-[radial-gradient(ellipse_at_50%_38%,#f4f1df_5%,#dde8d9_82%)] sm:h-[520px]">
        <span
          className="pointer-events-none absolute top-5 left-5 z-10 text-[10px] tracking-[0.2em] text-moss"
          aria-hidden="true"
        >
          A PLACE TO GROW
        </span>
        {mode === 'map' ? (
          <GardenMap />
        ) : (
          <SceneErrorBoundary fallback={<GardenMap />} onFailure={showMap}>
            <GardenCanvas onUnavailable={showMap} onReady={markReady} />
          </SceneErrorBoundary>
        )}
        <span
          className="pointer-events-none absolute right-5 bottom-5 rounded-full bg-paper/80 px-3 py-2 text-[10px] text-moss"
          aria-hidden="true"
        >
          작은 시작, 느린 성장
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-moss">
        <p role="status">
          {mode === 'map'
            ? '정적 지도로 정원을 보고 있어요.'
            : ready
              ? '나무와 꽃밭이 있는 작은 정원이에요.'
              : '정원을 불러오고 있어요.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setReady(false);
            setMode(mode === 'scene' ? 'map' : 'scene');
          }}
          className="min-h-11 cursor-pointer rounded-full border border-moss/30 px-4 py-2 hover:bg-moss/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
        >
          {mode === 'scene' ? '정적 지도로 보기' : '3D로 보기'}
        </button>
      </div>
    </section>
  );
}
