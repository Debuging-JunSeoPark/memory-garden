import { describe, expect, it } from 'vitest';
import { createGardenPlots, gardenRegion, gardenBridges, isOnGardenGround } from './garden-plots';
import { walk } from './garden-walk';

const plots = createGardenPlots(new Date(2026, 10, 19));
// Hand-checked adjacent cells in the existing 3-column November layout.
const neighborPairs = [
  [0, 1],
  [0, 5],
  [1, 2],
  [1, 4],
  [2, 3],
  [3, 4],
  [3, 8],
  [4, 5],
  [4, 7],
  [5, 6],
  [6, 7],
  [7, 8],
  [7, 10],
  [8, 9],
  [9, 10],
];

describe('three-column seasonal gardens', () => {
  it('opens eleven months in rows of three and keeps November at home', () => {
    expect(plots).toHaveLength(11);
    expect(plots[0]).toMatchObject({ key: '2026-01', x: 8, z: -24 });
    expect(plots[10]).toMatchObject({ key: '2026-11', x: 0, z: 0 });
    const rows = new Map<number, number>();
    for (const plot of plots) rows.set(plot.z, (rows.get(plot.z) ?? 0) + 1);
    expect([...rows.values()]).toEqual([3, 3, 3, 2]);
    expect(new Set(plots.map((plot) => plot.theme.name)).size).toBe(11);
    expect(createGardenPlots(new Date(2027, 0, 1))).toMatchObject([{ x: 0, z: 0 }]);
  });

  it('connects every opened orthogonal neighbor exactly once', () => {
    expect(gardenBridges(plots).map(({ from, to }) => [from, to])).toEqual(neighborPairs);
    expect(gardenBridges([])).toEqual([]);
    // Non-neighbors and diagonals must not acquire invisible walkable ground.
    expect(isOnGardenGround(4, -4, plots)).toBe(false);
    expect(isOnGardenGround(4, 0, plots)).toBe(false);
  });

  it.each([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [10, 15],
    [11, 17],
  ])('opens only available connections in month index %i', (month, count) => {
    expect(gardenBridges(createGardenPlots(new Date(2026, month, 1)))).toHaveLength(count);
  });

  it('supports a round trip on every horizontal and vertical bridge', () => {
    for (const [from, to] of neighborPairs) {
      const start = plots[from];
      const end = plots[to];
      const dx = Math.sign(end.x - start.x);
      const dz = Math.sign(end.z - start.z);
      const direction = { x: 0.838 * dx - 0.545 * dz, y: 0.545 * dx + 0.838 * dz };
      let position = { x: start.x, z: start.z };
      let region = from;
      for (let step = 0; step < 76; step += 1) {
        position = walk(position, direction, 0.05, plots);
        expect(isOnGardenGround(position.x, position.z, plots)).toBe(true);
        region = gardenRegion(position, region, plots);
      }
      expect(Math.hypot(position.x - end.x, position.z - end.z)).toBeLessThan(0.1);
      expect(region).toBe(to);
      for (let step = 0; step < 76; step += 1) {
        position = walk(position, { x: -direction.x, y: -direction.y }, 0.05, plots);
      }
      expect(position.x).toBeCloseTo(start.x);
      expect(position.z).toBeCloseTo(start.z);
    }
    expect(isOnGardenGround(0, -32, plots)).toBe(false);
  });

  it('blocks both rail orientations and does not confuse months in the same column', () => {
    const links = gardenBridges(plots);
    expect(links.filter((link) => link.vertical)).toHaveLength(8);
    for (const link of links) {
      for (const along of [-1.2, 0, 1.2]) {
        for (const sign of [-1, 1]) {
          let position = {
            x: link.x + (link.vertical ? sign * 0.5 : along),
            z: link.z + (link.vertical ? along : sign * 0.5),
          };
          const start = { ...position };
          const direction = link.vertical
            ? { x: 0.838 * sign, y: 0.545 * sign }
            : { x: -0.545 * sign, y: 0.838 * sign };
          for (let step = 0; step < 10; step += 1)
            position = walk(position, direction, 0.05, plots);
          expect(position).toMatchObject(start);
        }
      }
    }
    expect(gardenRegion({ x: 0, z: -24 }, 10, plots)).toBe(1);
    expect(gardenRegion({ x: 0, z: -16 }, 1, plots)).toBe(4);
    expect(gardenRegion({ x: 0, z: -8 }, 4, plots)).toBe(7);
  });
});
