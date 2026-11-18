'use client';

import { MathUtils, type OrthographicCamera as ThreeCamera } from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera';
import { useEffect, useRef, type RefObject } from 'react';
import { GardenDiaryCorner } from './garden-diary-corner';
import { GardenBookshelf } from './garden-bookshelf';
import { GardenIsland } from './garden-island';
import { GardenPlayer } from './garden-player';
import { GardenNextPlot, GardenBridge } from './garden-next-plot';
import type { GardenPosition } from './garden-plots';
import { shelfPosition, type Direction } from './garden-walk';

type SceneCallbacks = { onUnavailable: () => void; onReady: () => void };

function GardenCamera({
  onUnavailable,
  onReady,
  shelf,
  diary,
  positionRef,
}: SceneCallbacks & { shelf: boolean; diary: boolean; positionRef: RefObject<GardenPosition> }) {
  const { size, gl, invalidate } = useThree();
  const cameraRef = useRef<ThreeCamera>(null);
  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera || shelf || diary) return;
    const targetX = Math.min(0, positionRef.current.x + 1.5);
    const x = MathUtils.damp(camera.position.x - 6.5, targetX, 6, Math.min(delta, 0.05));
    camera.position.set(6.5 + x, 6.8, 10);
    camera.lookAt(x, 0.55, 0);
    if (Math.abs(x - targetX) > 0.002) invalidate();
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener('webglcontextlost', handleLoss);
    onReady();
    return () => canvas.removeEventListener('webglcontextlost', handleLoss);
  }, [gl, onUnavailable, onReady]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={diary ? [0, 8, 5] : shelf ? [2, 2.1, 4] : [6.5, 6.8, 10]}
      near={0.1}
      far={60}
      zoom={Math.min(
        size.width / (diary ? 11 : shelf ? 2.7 : 7.9),
        size.height / (diary ? 8 : shelf ? 3.2 : 7.7),
      )}
      onUpdate={(camera) => {
        if (diary) camera.lookAt(0, 0, 0);
        else if (shelf) camera.lookAt(shelfPosition.x, 1.14, shelfPosition.z);
        else camera.lookAt(camera.position.x - 6.5, 0.55, 0);
      }}
    />
  );
}

export function GardenCanvas({
  onUnavailable,
  onReady,
  onOpenGuide,
  onRegionChange,
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
            <GardenNextPlot />
            <GardenBridge />
            <GardenIsland
              months={months}
              dates={dates}
              onOpenMemory={onOpenMemory}
              onOpenShelf={nearShelf ? onOpenShelf : undefined}
              onOpenDiary={nearWritingPlace ? onOpenDiary : undefined}
            />
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
