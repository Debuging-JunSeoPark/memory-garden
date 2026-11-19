'use client';

import { MathUtils, type OrthographicCamera as ThreeCamera } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera';
import { GardenMonthLabel } from './garden-month-label';
import { useEffect, useRef, type RefObject } from 'react';
import { GardenDiaryCorner } from './garden-diary-corner';
import { GardenBookshelf } from './garden-bookshelf';
import { GardenIsland } from './garden-island';
import { GardenPlayer } from './garden-player';
import { GardenNextPlot, GardenBridge } from './garden-next-plot';
import { gardenBridges, type GardenPlot, type GardenPosition } from './garden-plots';
import { shelfPosition, type Direction } from './garden-walk';

type SceneCallbacks = { onUnavailable: () => void; onReady: () => void };

function GardenCamera({
  onUnavailable,
  onReady,
  shelf,
  diary,
  positionRef,
  plots,
  overview,
}: SceneCallbacks & {
  shelf: boolean;
  diary: boolean;
  positionRef: RefObject<GardenPosition>;
  plots: GardenPlot[];
  overview: boolean;
}) {
  const { size, gl, invalidate } = useThree();
  const cameraRef = useRef<ThreeCamera>(null);
  const reducedMotion = useRef(false);
  const minX = Math.min(...plots.map((plot) => plot.x));
  const maxX = Math.max(...plots.map((plot) => plot.x));
  const minZ = Math.min(...plots.map((plot) => plot.z));
  const maxZ = Math.max(...plots.map((plot) => plot.z));
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera || shelf || diary || overview) return;
    const offset = (value: number) => Math.sign(value) * Math.max(0, Math.abs(value) - 1.5);
    const targetX = offset(positionRef.current.x);
    const targetZ = offset(positionRef.current.z);
    const x = reducedMotion.current
      ? targetX
      : MathUtils.damp(camera.position.x - 6.5, targetX, 6, Math.min(delta, 0.05));
    const z = reducedMotion.current
      ? targetZ
      : MathUtils.damp(camera.position.z - 10, targetZ, 6, Math.min(delta, 0.05));
    camera.position.set(6.5 + x, 6.8, 10 + z);
    camera.lookAt(x, 0.55, z);
    if (Math.hypot(x - targetX, z - targetZ) > 0.002) invalidate();
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      reducedMotion.current = media.matches;
      invalidate();
    };
    updateMotion();
    media.addEventListener('change', updateMotion);
    const canvas = gl.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener('webglcontextlost', handleLoss);
    onReady();
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLoss);
      media.removeEventListener('change', updateMotion);
    };
  }, [gl, invalidate, onUnavailable, onReady]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={
        diary
          ? [0, 8, 5]
          : shelf
            ? [2, 2.1, 4]
            : overview
              ? [centerX + 16.25, 17, centerZ + 25]
              : [6.5, 6.8, 10]
      }
      near={0.1}
      far={60}
      zoom={Math.min(
        size.width /
          (diary
            ? 11
            : shelf
              ? 2.7
              : overview
                ? Math.max(10, maxX - minX + (maxZ - minZ) * 0.65 + 10)
                : 7.9),
        size.height /
          (diary
            ? 8
            : shelf
              ? 3.2
              : overview
                ? Math.max(10, (maxZ - minZ) * 0.5 + (maxX - minX) * 0.35 + 9)
                : 7.7),
      )}
      onUpdate={(camera) => {
        if (diary) camera.lookAt(0, 0, 0);
        else if (shelf) camera.lookAt(shelfPosition.x, 1.14, shelfPosition.z);
        else if (overview) camera.lookAt(centerX, 0.55, centerZ);
        else camera.lookAt(camera.position.x - 6.5, 0.55, camera.position.z - 10);
      }}
    />
  );
}

export function GardenCanvas({
  onUnavailable,
  onReady,
  onOpenGuide,
  onRegionChange,
  plots,
  overview,
  region,
  records,
  months,
  dates,
  onOpenMonth,
  onOpenMemory,
  onNearShelf,
  onFirstMove,
  onOpenShelf,
  onNearWritingPlace,
  onOpenDiary,
  nearWritingPlace,
  walking,
  diary,
  joystick,
  nearShelf,
  shelf,
}: SceneCallbacks & {
  onOpenGuide: () => void;
  onRegionChange: (region: number) => void;
  plots: GardenPlot[];
  overview: boolean;
  region: number;
  records: { month: string; dates: string[] }[];
  months: string[];
  dates: string[];
  onOpenMonth: (month: string) => void;
  onOpenMemory: (date: string) => void;
  onNearShelf: (near: boolean) => void;
  onFirstMove: () => void;
  onOpenShelf: () => void;
  onNearWritingPlace: (near: boolean) => void;
  onOpenDiary: () => void;
  nearWritingPlace: boolean;
  walking: boolean;
  diary: boolean;
  joystick: Direction;
  nearShelf: boolean;
  shelf: boolean;
}) {
  const positionRef = useRef<GardenPosition>({ x: 0, z: 1.7 });
  const visible = plots.map((plot, index) =>
    overview || (Math.abs(plot.x - plots[region].x) <= 8 && Math.abs(plot.z - plots[region].z) <= 8)
      ? index
      : -1,
  );
  const links = gardenBridges(plots);
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [6.5, 6.8, 10], near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        shadows="percentage"
        gl={{ antialias: true, powerPreference: 'low-power' }}
        fallback={<span>정적 지도로도 정원을 둘러볼 수 있어요.</span>}
      >
        <GardenCamera
          onUnavailable={onUnavailable}
          onReady={onReady}
          shelf={shelf}
          diary={diary}
          positionRef={positionRef}
          plots={plots}
          overview={overview}
        />
        <hemisphereLight args={['#fff3dc', '#a8aa88', 2.4]} />
        <directionalLight
          position={[-3, 8, 4]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-normalBias={0.035}
          shadow-radius={3}
        />
        <GardenPlayer
          positionRef={positionRef}
          plots={plots}
          onRegionChange={onRegionChange}
          active={walking}
          joystick={joystick}
          onNearShelf={onNearShelf}
          onFirstMove={onFirstMove}
          onOpenShelf={onOpenShelf}
          onNearWritingPlace={onNearWritingPlace}
          onOpenDiary={onOpenDiary}
        />
        {diary ? (
          <GardenDiaryCorner />
        ) : shelf ? (
          <GardenBookshelf months={months} onOpenGuide={onOpenGuide} onOpenMonth={onOpenMonth} />
        ) : (
          <>
            {plots.map((plot, index) => {
              if (!visible.includes(index)) return null;
              const plotDates =
                index === region
                  ? dates
                  : (records.find((record) => record.month === plot.key)?.dates.slice(0, 6) ?? []);
              return (
                <group key={plot.key}>
                  {overview && <GardenMonthLabel plot={plot} />}
                  {index === plots.length - 1 ? (
                    <GardenIsland
                      theme={plot.theme}
                      months={months}
                      dates={plotDates}
                      onOpenMemory={onOpenMemory}
                      onOpenShelf={nearShelf && !overview ? onOpenShelf : undefined}
                      onOpenDiary={nearWritingPlace && !overview ? onOpenDiary : undefined}
                    />
                  ) : (
                    <GardenNextPlot plot={plot} dates={plotDates} onOpenMemory={onOpenMemory} />
                  )}
                </group>
              );
            })}
            {links
              .filter((link) => visible.includes(link.from) && visible.includes(link.to))
              .map((link) => (
                <GardenBridge key={link.from} link={link} />
              ))}
          </>
        )}
        {!shelf && !diary && (
          <ContactShadows
            position={[0, -0.66, 0]}
            opacity={0.28}
            scale={12}
            blur={2.4}
            far={5}
            resolution={256}
            frames={1}
            color="#65734b"
          />
        )}
      </Canvas>
    </div>
  );
}
