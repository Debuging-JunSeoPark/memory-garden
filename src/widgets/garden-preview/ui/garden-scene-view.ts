import type { GardenPlot, GardenPosition } from './garden-plots';

export type CameraPoint = [number, number, number];

export function cameraPosition(
  view: 'walk' | 'overview' | 'shelf' | 'diary',
  walking: CameraPoint,
  center: GardenPosition,
): CameraPoint {
  if (view === 'overview') return [center.x + 16.25, 17, center.z + 25];
  if (view === 'shelf') return [2, 2.1, 4];
  if (view === 'diary') return [0, 8, 5];
  return walking;
}

export function shadowFrame(plots: GardenPlot[], region: number, overview: boolean) {
  if (!overview)
    return { x: plots[region].x, z: plots[region].z, radius: 5, scale: 12, resolution: 256 };
  const minX = Math.min(...plots.map((plot) => plot.x));
  const maxX = Math.max(...plots.map((plot) => plot.x));
  const minZ = Math.min(...plots.map((plot) => plot.z));
  const maxZ = Math.max(...plots.map((plot) => plot.z));
  const span = Math.max(maxX - minX, maxZ - minZ);
  return {
    x: (minX + maxX) / 2,
    z: (minZ + maxZ) / 2,
    radius: span / 2 + 6,
    scale: span + 8,
    resolution: 512,
  };
}
