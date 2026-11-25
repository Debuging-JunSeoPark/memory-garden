import {
  bridge,
  bridgeCoordinates,
  gardenBridges,
  isOnGardenGround,
  playerRadius,
  type GardenPlot,
} from './garden-plots';
import {
  bench,
  homeFlowerbed,
  monthFlowerbed,
  mainTree,
  smallTree,
  shelfPosition,
  writingPosition,
} from './garden-layout';
export { shelfPosition, writingPosition } from './garden-layout';
export type Direction = { x: number; y: number };
type Position = { x: number; z: number };

export const still = { x: 0, y: 0 };
export const spawnPosition = { x: 0, z: 1.7 };

export const directionKeys: Readonly<Record<string, Direction>> = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};

const trunks = [mainTree, smallTree];

const obstacles = [{ ...writingPosition, halfWidth: 0.4, halfDepth: 0.32 }, bench, homeFlowerbed];

function canWalk(x: number, z: number, plots: GardenPlot[]) {
  return (
    isOnGardenGround(x, z, plots) &&
    !plots.some(
      (plot) =>
        Math.abs(x - (plot.x + shelfPosition.x)) < 0.96 &&
        Math.abs(z - (plot.z + shelfPosition.z)) < 0.59,
    ) &&
    !trunks.some((tree) => Math.hypot(x - tree.x, z - tree.z) < tree.radius) &&
    !plots
      .slice(0, -1)
      .some(
        (plot) =>
          Math.abs(x - (plot.x + monthFlowerbed.x)) < monthFlowerbed.halfWidth &&
          Math.abs(z - (plot.z + monthFlowerbed.z)) < monthFlowerbed.halfDepth,
      ) &&
    !plots
      .slice(0, -1)
      .some((plot) => Math.hypot(x - (plot.x + mainTree.x), z - (plot.z + mainTree.z)) < 0.5) &&
    !gardenBridges(plots).some((link) => {
      const { along, across } = bridgeCoordinates(x, z, link);
      return (
        Math.abs(along) < bridge.railLength / 2 + playerRadius &&
        [-bridge.railZ, bridge.railZ].some(
          (railZ) => Math.abs(across - railZ) < bridge.railWidth / 2 + playerRadius,
        )
      );
    }) &&
    !obstacles.some(
      (item) => Math.abs(x - item.x) < item.halfWidth && Math.abs(z - item.z) < item.halfDepth,
    )
  );
}

export function isNearShelf({ x, z }: Position, plot: Position) {
  return Math.hypot(x - (plot.x + shelfPosition.x), z - (plot.z + shelfPosition.z + 0.83)) < 0.74;
}

export function isNearWritingPlace({ x, z }: Position) {
  return Math.hypot(x - (writingPosition.x - 0.4), z - writingPosition.z) < 0.7;
}

export function walk(position: Position, direction: Direction, delta: number, plots: GardenPlot[]) {
  const distance =
    (2.1 * Math.min(delta, 0.05)) / Math.max(1, Math.hypot(direction.x, direction.y));
  // The horizontal components of the fixed camera's right and forward axes.
  const dx = (direction.x * 0.838 + direction.y * 0.545) * distance;
  const dz = (-direction.x * 0.545 + direction.y * 0.838) * distance;
  const x = canWalk(position.x + dx, position.z, plots) ? position.x + dx : position.x;
  const z = canWalk(x, position.z + dz, plots) ? position.z + dz : position.z;
  return { x, z, heading: Math.atan2(dx, dz) };
}
