export const nextPlotX = -8;
export const walkingRadius = 2.98;
export const playerRadius = 0.15;
export const bridge = {
  minX: -5.25,
  maxX: -2.75,
  halfWidth: 0.54,
  railZ: 0.73,
  railLength: 2.85,
  railWidth: 0.07,
};
export type GardenPosition = { x: number; z: number };

export function isOnGardenGround(x: number, z: number) {
  return (
    Math.hypot(x, z) <= walkingRadius ||
    Math.hypot(x - nextPlotX, z) <= walkingRadius ||
    (x >= bridge.minX && x <= bridge.maxX && Math.abs(z) <= bridge.halfWidth)
  );
}

export function gardenRegion(x: number, previous: number) {
  return x <= bridge.minX ? 1 : x >= bridge.maxX ? 0 : previous;
}

export function previewMonths(today = new Date()) {
  return [0, 1].map((offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  });
}
