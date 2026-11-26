import { describe, expect, it } from 'vitest';
import { createGardenPlots, gardenRegion, isOnGardenGround } from './garden-plots';
import { walk, isNearShelf, isNearWritingPlace } from './garden-walk';
import { homeFlowerbed, writingPosition, shelfPosition } from './garden-layout';

const plots = createGardenPlots(new Date(2026, 1, 18)).map((plot, index) => ({
  ...plot,
  x: index === 0 ? -8 : 0,
  z: 0,
}));
const nextPlotX = -8;

describe('connected monthly ground', () => {
  it('keeps the home flowerbed clear of the diary pedestal and island edge', () => {
    // Scene fence bounds and the writing pedestal's radius 0.4 must not intersect.
    const dx = Math.max(0, Math.abs(writingPosition.x - homeFlowerbed.x) - homeFlowerbed.width / 2);
    const dz = Math.max(0, Math.abs(writingPosition.z - homeFlowerbed.z) - homeFlowerbed.depth / 2);
    expect(Math.hypot(dx, dz)).toBeGreaterThan(0.4);
    expect(
      Math.hypot(
        homeFlowerbed.x + homeFlowerbed.width / 2,
        homeFlowerbed.z + homeFlowerbed.depth / 2,
      ),
    ).toBeLessThan(3.24);
  });

  it('allows a full round trip over the bridge', () => {
    let position = { x: 0, z: 0 };
    const west = { x: -0.838, y: -0.545 };
    for (let step = 0; step < 75; step += 1) {
      position = walk(position, west, 0.05, plots);
      expect(isOnGardenGround(position.x, position.z, plots)).toBe(true);
    }
    expect(position.x).toBeLessThan(nextPlotX + 0.5);
    expect(isNearShelf(position, plots[0])).toBe(false);
    expect(isNearWritingPlace(position)).toBe(false);
    for (let step = 0; step < 75; step += 1) {
      position = walk(position, { x: 0.838, y: 0.545 }, 0.05, plots);
    }
    expect(position.x).toBeCloseTo(0, 4);
    expect(position.z).toBeCloseTo(0, 4);
  });

  it('keeps the player on bridge deck and inside both islands', () => {
    expect(isOnGardenGround(-4, 0.54, plots)).toBe(true);
    expect(isOnGardenGround(-4, 0.55, plots)).toBe(false);
    expect(isOnGardenGround(-4, 2, plots)).toBe(false);
    const next = walk({ x: -4, z: 0.53 }, { x: -0.545, y: 0.838 }, 0.05, plots);
    expect(next.z).toBe(0.53);
    expect(isOnGardenGround(-11, 0, plots)).toBe(false);
    expect(isOnGardenGround(3, 0, plots)).toBe(false);
    const blocked = walk({ x: -6.1, z: -0.65 }, { x: 0.545, y: -0.838 }, 0.05, plots);
    expect(blocked.z).toBe(-0.65);
  });

  it('blocks both rails at both landings, including the player radius', () => {
    for (const x of [-2.8, -4, -5.2]) {
      for (const sign of [-1, 1]) {
        let position = { x, z: sign * 0.5 };
        const direction = { x: -0.545 * sign, y: 0.838 * sign };
        for (let step = 0; step < 10; step += 1) position = walk(position, direction, 0.05, plots);
        expect(position.z).toBe(sign * 0.5);
      }
    }
    const outsideRailEnd = walk({ x: -2.3, z: 0.5 }, { x: -0.545, y: 0.838 }, 0.05, plots);
    expect(outsideRailEnd.z).toBeGreaterThan(0.5);
  });

  it('changes months only after reaching land and keeps the last month on the bridge', () => {
    expect(gardenRegion({ x: -5.3, z: 0 }, 1, plots)).toBe(0);
    expect(gardenRegion({ x: -4, z: 0 }, 1, plots)).toBe(1);
    expect(gardenRegion({ x: -4, z: 0 }, 0, plots)).toBe(0);
    expect(gardenRegion({ x: -2.7, z: 0 }, 0, plots)).toBe(1);
  });
});

describe('bookshelves on every monthly land', () => {
  const monthly = createGardenPlots(new Date(2026, 10, 25));
  it('recognizes only the nearby local shelf in every opened month', () => {
    for (const plot of monthly) {
      const front = { x: plot.x + shelfPosition.x, z: plot.z + shelfPosition.z + 0.83 };
      expect(isNearShelf(front, plot), plot.key).toBe(true);
      const other = monthly.find((candidate) => candidate.key !== plot.key)!;
      expect(isNearShelf(front, other), plot.key).toBe(false);
      expect(isNearShelf({ x: plot.x, z: plot.z }, plot)).toBe(false);
    }
  });
  it('blocks walking through every shelf while leaving its front accessible', () => {
    for (const plot of monthly) {
      const front = { x: plot.x + shelfPosition.x, z: plot.z + shelfPosition.z + 0.65 };
      expect(walk(front, { x: 0.545, y: -0.838 }, 0.05, monthly), plot.key).toMatchObject(front);
      const away = walk(front, { x: -0.545, y: 0.838 }, 0.05, monthly);
      expect(away.z, plot.key).toBeGreaterThan(front.z);
    }
  });
});
