import { describe, expect, it } from 'vitest';
import { createGardenPlots, gardenRegion, gardenBridges, isOnGardenGround } from './garden-plots';
import { walk } from './garden-walk';

const plots = createGardenPlots(new Date(2026, 10, 19));

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

  it('supports a round trip on every horizontal and vertical bridge', () => {
    for (let index = 0; index < plots.length - 1; index += 1) {
      const start = plots[index];
      const end = plots[index + 1];
      const dx = Math.sign(end.x - start.x);
      const dz = Math.sign(end.z - start.z);
      const direction = { x: 0.838 * dx - 0.545 * dz, y: 0.545 * dx + 0.838 * dz };
      let position = { x: start.x, z: start.z };
      let region = index;
      for (let step = 0; step < 76; step += 1) {
        position = walk(position, direction, 0.05, plots);
        expect(isOnGardenGround(position.x, position.z, plots)).toBe(true);
        region = gardenRegion(position, region, plots);
      }
      expect(Math.hypot(position.x - end.x, position.z - end.z)).toBeLessThan(0.1);
      expect(region).toBe(index + 1);
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
    expect(links.filter((link) => link.vertical)).toHaveLength(3);
    for (const link of links) {
      const position = {
        x: link.x + (link.vertical ? 0.5 : 0),
        z: link.z + (link.vertical ? 0 : 0.5),
      };
      const direction = link.vertical ? { x: 0.838, y: 0.545 } : { x: -0.545, y: 0.838 };
      expect(walk(position, direction, 0.05, plots)).toMatchObject(position);
    }
    expect(gardenRegion({ x: 0, z: -24 }, 10, plots)).toBe(1);
    expect(gardenRegion({ x: 0, z: -16 }, 1, plots)).toBe(4);
    expect(gardenRegion({ x: 0, z: -8 }, 4, plots)).toBe(7);
  });
});
