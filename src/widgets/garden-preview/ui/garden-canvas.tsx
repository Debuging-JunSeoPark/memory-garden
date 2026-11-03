'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera';
import { useEffect } from 'react';
import { GardenIsland } from './garden-island';

type SceneCallbacks = { onUnavailable: () => void; onReady: () => void };

function GardenCamera({ onUnavailable, onReady }: SceneCallbacks) {
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
      position={[8, 7, 8]}
      near={0.1}
      far={60}
      zoom={Math.min(size.width / 10.5, size.height / 8.5)}
      onUpdate={(camera) => camera.lookAt(0, 0.5, 0)}
    />
  );
}

export function GardenCanvas({ onUnavailable, onReady }: SceneCallbacks) {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [8, 7, 8], near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        shadows="percentage"
        gl={{ antialias: true, powerPreference: 'low-power' }}
        fallback={<span>정적 지도로도 정원을 둘러볼 수 있어요.</span>}
      >
        <GardenCamera onUnavailable={onUnavailable} onReady={onReady} />
        <hemisphereLight args={['#fff8e6', '#8c9b70', 2.1]} />
        <directionalLight
          position={[-3, 8, 4]}
          intensity={3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-normalBias={0.04}
        />
        <GardenIsland />
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
      </Canvas>
    </div>
  );
}
