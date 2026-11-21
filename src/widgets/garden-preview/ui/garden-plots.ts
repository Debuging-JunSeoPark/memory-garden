export const plotSpacing = 8;
export const walkingRadius = 2.98;
export const playerRadius = 0.15;
export const bridge = { halfWidth: 0.54, railZ: 0.73, railLength: 2.85, railWidth: 0.07 };
export type GardenPosition = { x: number; z: number };

const themes = [
  { name: '눈 내린 정원', ground: '#dce5e2', leaves: '#809c95', accent: '#c1d8e4', detail: 'snow' },
  {
    name: '겨울 끝의 정원',
    ground: '#d9dfcf',
    leaves: '#9bad96',
    accent: '#e4c6ce',
    detail: 'snow',
  },
  {
    name: '새싹의 정원',
    ground: '#bbcf9d',
    leaves: '#a2bf80',
    accent: '#e9df99',
    detail: 'flowers',
  },
  {
    name: '벚꽃의 정원',
    ground: '#c8d5a4',
    leaves: '#e6b8c3',
    accent: '#efd0d7',
    detail: 'petals',
  },
  {
    name: '풀꽃의 정원',
    ground: '#a9c187',
    leaves: '#83a56a',
    accent: '#f0dfac',
    detail: 'flowers',
  },
  {
    name: '수국의 정원',
    ground: '#a4bda0',
    leaves: '#7ca18b',
    accent: '#acbadb',
    detail: 'hydrangea',
  },
  {
    name: '초록 그늘 정원',
    ground: '#a2ba83',
    leaves: '#668c63',
    accent: '#c5d5a1',
    detail: 'flowers',
  },
  {
    name: '한여름 햇살 정원',
    ground: '#bdc58f',
    leaves: '#7d9b66',
    accent: '#e9c563',
    detail: 'sunflowers',
  },
  {
    name: '가을 문턱의 정원',
    ground: '#c9c49b',
    leaves: '#b3b178',
    accent: '#d7b77b',
    detail: 'fallen',
  },
  {
    name: '단풍의 정원',
    ground: '#cbb890',
    leaves: '#cb916e',
    accent: '#d89d74',
    detail: 'fallen',
  },
  {
    name: '낙엽 쉬는 정원',
    ground: '#c5bea5',
    leaves: '#a59a7d',
    accent: '#b58d6b',
    detail: 'fallen',
  },
  {
    name: '포근한 겨울 정원',
    ground: '#e0e4da',
    leaves: '#819c8c',
    accent: '#c6d5d9',
    detail: 'snow',
  },
] as const;

export type GardenTheme = (typeof themes)[number];
export type GardenPlot = { key: string; label: string; x: number; z: number; theme: GardenTheme };

function gridCell(index: number) {
  const row = Math.floor(index / 3);
  return { column: row % 2 === 0 ? 2 - (index % 3) : index % 3, row };
}

export function createGardenPlots(today = new Date()): GardenPlot[] {
  const home = gridCell(today.getMonth());
  return Array.from({ length: today.getMonth() + 1 }, (_, index) => {
    const cell = gridCell(index);
    return {
      key: `${today.getFullYear()}-${String(index + 1).padStart(2, '0')}`,
      label: `${today.getFullYear()}년 ${index + 1}월`,
      x: (cell.column - home.column) * plotSpacing,
      z: (cell.row - home.row) * plotSpacing,
      theme: themes[index],
    };
  });
}

export type GardenLink = GardenPosition & { vertical: boolean; from: number; to: number };

export function gardenBridges(plots: GardenPlot[]): GardenLink[] {
  return plots.slice(1).map((plot, index) => ({
    x: (plots[index].x + plot.x) / 2,
    z: (plots[index].z + plot.z) / 2,
    vertical: plots[index].x === plot.x,
    from: index,
    to: index + 1,
  }));
}

export function bridgeCoordinates(x: number, z: number, link: GardenLink) {
  return {
    along: link.vertical ? z - link.z : x - link.x,
    across: link.vertical ? x - link.x : z - link.z,
  };
}

export function isOnGardenGround(x: number, z: number, plots: GardenPlot[]) {
  return (
    plots.some((plot) => Math.hypot(x - plot.x, z - plot.z) <= walkingRadius) ||
    gardenBridges(plots).some((link) => {
      const { along, across } = bridgeCoordinates(x, z, link);
      return Math.abs(along) <= 1.25 && Math.abs(across) <= bridge.halfWidth;
    })
  );
}

export function gardenRegion(position: GardenPosition, previous: number, plots: GardenPlot[]) {
  const index = plots.findIndex(
    (plot) => Math.hypot(position.x - plot.x, position.z - plot.z) <= 2.75,
  );
  return index < 0 ? previous : index;
}
