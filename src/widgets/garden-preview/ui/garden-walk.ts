export type Direction = { x: number; y: number };
type Position = { x: number; z: number };

export const still = { x: 0, y: 0 };
export const shelfPosition = { x: 0.22, z: -2.12 };
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

const trunks = [
  { x: -1.55, z: -1.2, radius: 0.4 },
  { x: 2.05, z: -1.24, radius: 0.33 },
];

const obstacles = [
  { ...shelfPosition, halfWidth: 0.96, halfDepth: 0.59 },
  { x: -1.45, z: 0.65, halfWidth: 0.74, halfDepth: 0.43 },
  { x: 1.55, z: 0.7, halfWidth: 0.74, halfDepth: 0.99 },
];

function canWalk(x: number, z: number) {
  return (
    Math.hypot(x, z) <= 2.98 &&
    !trunks.some((tree) => Math.hypot(x - tree.x, z - tree.z) < tree.radius) &&
    !obstacles.some(
      (item) => Math.abs(x - item.x) < item.halfWidth && Math.abs(z - item.z) < item.halfDepth,
    )
  );
}

export function isNearShelf({ x, z }: Position) {
  return Math.hypot(x - shelfPosition.x, z - (shelfPosition.z + 0.83)) < 0.74;
}

export function walk(position: Position, direction: Direction, delta: number) {
  const distance =
    (2.1 * Math.min(delta, 0.05)) / Math.max(1, Math.hypot(direction.x, direction.y));
  // The horizontal components of the fixed camera's right and forward axes.
  const dx = (direction.x * 0.838 + direction.y * 0.545) * distance;
  const dz = (-direction.x * 0.545 + direction.y * 0.838) * distance;
  const x = canWalk(position.x + dx, position.z) ? position.x + dx : position.x;
  const z = canWalk(x, position.z + dz) ? position.z + dz : position.z;
  return { x, z, heading: Math.atan2(dx, dz) };
}
