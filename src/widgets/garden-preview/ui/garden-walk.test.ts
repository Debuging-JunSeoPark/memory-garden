import { describe, expect, it } from 'vitest';
import { gardenRegion, isOnGardenGround, nextPlotX, previewMonths } from './garden-plots';
import { walk, isNearShelf, isNearWritingPlace } from './garden-walk';

describe('connected monthly ground', () => {
  it('allows a full round trip over the bridge', () => {
    let position = { x: 0, z: 0 };
    const west = { x: -0.838, y: -0.545 };
    for (let step = 0; step < 75; step += 1) {
      position = walk(position, west, 0.05);
      expect(isOnGardenGround(position.x, position.z)).toBe(true);
    }
    expect(position.x).toBeLessThan(nextPlotX + 0.5);
    expect(isNearShelf(position)).toBe(false);
    expect(isNearWritingPlace(position)).toBe(false);
    for (let step = 0; step < 75; step += 1) {
      position = walk(position, { x: 0.838, y: 0.545 }, 0.05);
    }
    expect(position.x).toBeCloseTo(0, 4);
    expect(position.z).toBeCloseTo(0, 4);
  });

  it('keeps the player on bridge deck and inside both islands', () => {
    expect(isOnGardenGround(-4, 0.54)).toBe(true);
    expect(isOnGardenGround(-4, 0.55)).toBe(false);
    expect(isOnGardenGround(-4, 2)).toBe(false);
    const next = walk({ x: -4, z: 0.53 }, { x: -0.545, y: 0.838 }, 0.05);
    expect(next.z).toBe(0.53);
    expect(isOnGardenGround(-11, 0)).toBe(false);
    expect(isOnGardenGround(3, 0)).toBe(false);
    const blocked = walk({ x: -9.5, z: -0.65 }, { x: 0.545, y: -0.838 }, 0.05);
    expect(blocked.z).toBe(-0.65);
  });

  it('blocks both rails at both landings, including the player radius', () => {
    for (const x of [-2.8, -4, -5.2]) {
      for (const sign of [-1, 1]) {
        let position = { x, z: sign * 0.5 };
        const direction = { x: -0.545 * sign, y: 0.838 * sign };
        for (let step = 0; step < 10; step += 1) position = walk(position, direction, 0.05);
        expect(position.z).toBe(sign * 0.5);
      }
    }
    const outsideRailEnd = walk({ x: -2.3, z: 0.5 }, { x: -0.545, y: 0.838 }, 0.05);
    expect(outsideRailEnd.z).toBeGreaterThan(0.5);
  });

  it('changes months only after reaching land and keeps the last month on the bridge', () => {
    expect(gardenRegion(-5.3, 0)).toBe(1);
    expect(gardenRegion(-4, 1)).toBe(1);
    expect(gardenRegion(-4, 0)).toBe(0);
    expect(gardenRegion(-2.7, 1)).toBe(0);
  });

  it('labels the next calendar month across the year boundary', () => {
    const months = previewMonths(new Date(2026, 11, 18));
    expect(months).toEqual(['2026년 12월', '2027년 1월']);
  });
});
