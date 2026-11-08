'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera';
import { useEffect } from 'react';
import { GardenDiaryDesk } from './garden-diary-desk';
import { GardenBookshelf } from './garden-bookshelf';
import { GardenIsland } from './garden-island';
import { GardenPlayer } from './garden-player';
import { shelfPosition, type Direction } from './garden-walk';

type SceneCallbacks = { onUnavailable: () => void; onReady: () => void };

function GardenCamera({
  onUnavailable,
  onReady,
  shelf,
  diary,
}: SceneCallbacks & { shelf: boolean; diary: boolean }) {
  const { size, gl } = useThree();

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
        else camera.lookAt(0, 0.55, 0);
      }}
    />
  );
}

export function GardenCanvas({
  onUnavailable,
  onReady,
  onOpenGuide,
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
        <GardenCamera onUnavailable={onUnavailable} onReady={onReady} shelf={shelf} diary={diary} />
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
          active={walking}
          joystick={joystick}
          onNearShelf={onNearShelf}
          onFirstMove={onFirstMove}
          onOpenShelf={onOpenShelf}
          onNearWritingPlace={onNearWritingPlace}
          onOpenDiary={onOpenDiary}
        />
        {diary ? (
          <GardenDiaryDesk />
        ) : shelf ? (
          <GardenBookshelf onOpenGuide={onOpenGuide} />
        ) : (
          <GardenIsland
            onOpenShelf={nearShelf ? onOpenShelf : undefined}
            onOpenDiary={nearWritingPlace ? onOpenDiary : undefined}
          />
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
