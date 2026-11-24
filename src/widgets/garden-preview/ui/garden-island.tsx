import { GardenBookshelf } from './garden-bookshelf';
import { GardenWritingPlace } from './garden-writing-place';

import type { GardenTheme } from './garden-plots';
import { GardenSeason } from './garden-season';
import { bench, homeFlowerbed, mainTree, smallTree } from './garden-layout';

type Point = [number, number, number];

function Tree({ position, scale = 1, color }: { position: Point; scale?: number; color: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 7]} />
        <meshStandardMaterial color="#8c7051" flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[-0.45, 1.55, 0.16]} castShadow>
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0.47, 1.7, 0]} castShadow>
        <icosahedronGeometry args={[0.61, 0]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function Bench() {
  return (
    <group position={[bench.x, 0.12, bench.z]} rotation={[0, 0.15, 0]}>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.19, 0]} castShadow>
          <boxGeometry args={[0.09, 0.38, 0.46]} />
          <meshStandardMaterial color="#6c6650" />
        </mesh>
      ))}
      {[-0.14, 0, 0.14].map((z) => (
        <mesh key={z} position={[0, 0.42, z]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.09, 0.12]} />
          <meshStandardMaterial color="#b99263" />
        </mesh>
      ))}
      <mesh position={[0, 0.76, -0.23]} castShadow>
        <boxGeometry args={[1.15, 0.31, 0.07]} />
        <meshStandardMaterial color="#b99263" />
      </mesh>
    </group>
  );
}

const petalAngles = [0, 1.26, 2.51, 3.77, 5.03];

export function GardenFlower({
  position,
  color,
  onOpen,
}: {
  position: Point;
  color: string;
  onOpen: () => void;
}) {
  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
    >
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.4, 4]} />
        <meshStandardMaterial color="#66844b" />
      </mesh>
      <mesh position={[0.045, 0.2, 0]} rotation={[0, 0, -0.64]} scale={[0.52, 1, 0.35]}>
        <sphereGeometry args={[0.095, 8, 6]} />
        <meshStandardMaterial color="#789759" />
      </mesh>
      {petalAngles.map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 0.083, 0.42, Math.sin(angle) * 0.083]}
          scale={[1, 0.52, 1]}
        >
          <sphereGeometry args={[0.072, 8, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <mesh position={[0, 0.449, 0]} scale={[1, 0.55, 1]} castShadow>
        <sphereGeometry args={[0.057, 8, 6]} />
        <meshStandardMaterial color="#d59e57" />
      </mesh>
    </group>
  );
}

export function GardenIsland({
  theme,
  onOpenShelf,
  onOpenDiary,
  months,
  dates,
  onOpenMemory,
}: {
  theme: GardenTheme;
  onOpenShelf?: () => void;
  onOpenDiary?: () => void;
  months: string[];
  dates: string[];
  onOpenMemory: (date: string) => void;
}) {
  return (
    <group>
      <mesh position={[0, -0.2225, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.25, 3.045, 0.495, 32, 1, true]} />
        <meshStandardMaterial color="#b3926b" flatShading />
      </mesh>
      <mesh position={[0, -0.5475, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.045, 2.98, 0.155, 32]} />
        <meshStandardMaterial color="#c5a17d" flatShading />
      </mesh>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <cylinderGeometry args={[3.24, 3.25, 0.09, 32]} />
        <meshStandardMaterial color={theme.ground} flatShading />
      </mesh>
      <GardenSeason theme={theme} />
      <Tree position={[mainTree.x, 0.12, mainTree.z]} color={theme.leaves} />
      <Tree position={[smallTree.x, 0.12, smallTree.z]} scale={0.61} color={theme.leaves} />
      <GardenBookshelf months={months} onOpenShelf={onOpenShelf} />
      <GardenWritingPlace onOpen={onOpenDiary} />
      <Bench />
      <mesh position={[homeFlowerbed.x, 0.15, homeFlowerbed.z]} receiveShadow>
        <boxGeometry args={[homeFlowerbed.width - 0.15, 0.12, homeFlowerbed.depth - 0.12]} />
        <meshStandardMaterial color="#8d7957" />
      </mesh>
      {[-(homeFlowerbed.width - 0.08) / 2, (homeFlowerbed.width - 0.08) / 2].map((x) => (
        <mesh
          key={x}
          position={[homeFlowerbed.x + x, 0.2, homeFlowerbed.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.08, 0.16, homeFlowerbed.depth]} />
          <meshStandardMaterial color="#b38361" />
        </mesh>
      ))}
      {[-(homeFlowerbed.depth - 0.08) / 2, (homeFlowerbed.depth - 0.08) / 2].map((z) => (
        <mesh
          key={z}
          position={[homeFlowerbed.x, 0.2, homeFlowerbed.z + z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[homeFlowerbed.width - 0.16, 0.16, 0.08]} />
          <meshStandardMaterial color="#b38361" />
        </mesh>
      ))}
      {dates.slice(0, 6).map((date, index) => (
        <GardenFlower
          key={date}
          position={[
            homeFlowerbed.x - 0.28 + (index % 2) * 0.5,
            0.22,
            homeFlowerbed.z - 0.45 + Math.floor(index / 2) * 0.45,
          ]}
          color={index % 2 ? theme.accent : '#efd18a'}
          onOpen={() => onOpenMemory(date)}
        />
      ))}
      {[
        [-2.25, 0.16, -0.7],
        [2.45, 0.18, -0.85],
        [-1.2, 0.14, 2],
      ].map((point, i) => (
        <mesh key={i} position={point as Point} scale={[0.35, 0.2, 0.28]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b0b1a0" flatShading />
        </mesh>
      ))}
      {[
        [-2.2, 0.12, 0.7],
        [1.3, 0.12, 2.5],
        [-1, 0.12, -2.5],
      ].map((point, i) => (
        <mesh key={i} position={point as Point} scale={[0.4, 0.3, 0.4]} castShadow>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#8da565" flatShading />
        </mesh>
      ))}
    </group>
  );
}
