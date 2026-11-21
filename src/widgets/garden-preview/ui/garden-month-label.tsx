import { Billboard } from '@react-three/drei/core/Billboard';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, OrthographicCamera, type Mesh } from 'three';
import type { GardenPlot } from './garden-plots';

export function GardenMonthLabel({ plot }: { plot: GardenPlot }) {
  const mesh = useRef<Mesh>(null);
  useFrame(({ camera }) => {
    if (mesh.current && camera instanceof OrthographicCamera)
      mesh.current.scale.setScalar(40 / camera.zoom / 1.3);
  });
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#f8f5e9';
      context.beginPath();
      context.roundRect(4, 4, 120, 56, 28);
      context.fill();
      context.fillStyle = '#384d3d';
      context.font = '32px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`${Number(plot.key.slice(5))}월`, 64, 33);
    }
    return new CanvasTexture(canvas);
  }, [plot.key]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <Billboard position={[plot.x, 0.3, plot.z + 2.6]}>
      <mesh ref={mesh} renderOrder={1}>
        <planeGeometry args={[1.3, 0.65]} />
        <meshBasicMaterial map={texture} transparent depthTest={false} />
      </mesh>
    </Billboard>
  );
}
