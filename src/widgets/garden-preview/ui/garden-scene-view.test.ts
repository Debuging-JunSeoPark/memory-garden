import { describe, expect, it } from 'vitest';
import { cameraPosition, shadowFrame, type CameraPoint } from './garden-scene-view';
import { createGardenPlots } from './garden-plots';
import { shelfPosition } from './garden-layout';

const plots = createGardenPlots(new Date(2026, 10, 21));

describe('garden view restoration', () => {
  it('returns to the remembered distant walking pose after overview without changing it', () => {
    const walking: CameraPoint = [13.5, 6.8, -12.5];
    expect(cameraPosition('overview', walking, { x: 0, z: -12 })).toEqual([16.25, 17, 13]);
    expect(cameraPosition('walk', walking, { x: 0, z: -12 })).toEqual([13.5, 6.8, -12.5]);
    expect(walking).toEqual([13.5, 6.8, -12.5]);
  });

  it('keeps bookshelf and writing closeups separate from the walking pose', () => {
    const walking: CameraPoint = [13.5, 6.8, -12.5];
    const shelf = cameraPosition('shelf', walking, { x: 0, z: 0 });
    expect(shelf[0] - shelfPosition.x).toBeCloseTo(1.78);
    expect(shelf[1]).toBe(2.1);
    expect(shelf[2] - shelfPosition.z).toBeCloseTo(6.12);
    expect(cameraPosition('diary', walking, { x: 0, z: 0 })).toEqual([0, 8, 5]);
    expect(cameraPosition('walk', walking, { x: 0, z: 0 })).toEqual(walking);
  });

  it('centers walking shadows on the active past month', () => {
    expect(shadowFrame(plots, 3, false)).toEqual({
      x: -8,
      z: -16,
      radius: 5,
      scale: 12,
      resolution: 256,
    });
  });

  it('covers all opened plots in overview', () => {
    expect(shadowFrame(plots, 10, true)).toEqual({
      x: 0,
      z: -12,
      radius: 18,
      scale: 32,
      resolution: 512,
    });
  });
});
