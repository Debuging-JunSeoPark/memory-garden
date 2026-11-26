import { bridge, type GardenLink, type GardenPlot } from './garden-plots';
import { GardenSeason } from './garden-season';
import { GardenFlower } from './garden-island';
import { mainTree, monthFlowerbed } from './garden-layout';
import { GardenBookshelf } from './garden-bookshelf';

export function GardenNextPlot({
  plot,
  dates,
  onOpenMemory,
  months,
  onOpenShelf,
}: {
  plot: GardenPlot;
  dates: string[];
  onOpenMemory: (date: string) => void;
  months: string[];
  onOpenShelf?: () => void;
}) {
  return (
    <group position={[plot.x, 0, plot.z]}>
      <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.25, 3.045, 0.5, 32]} />
        <meshStandardMaterial color="#b3926b" roughness={1} />
      </mesh>
      <mesh position={[0, -0.5475, 0]} receiveShadow>
        <cylinderGeometry args={[3.045, 2.85, 0.155, 32]} />
        <meshStandardMaterial color="#a88c61" roughness={1} />
      </mesh>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <cylinderGeometry args={[3.24, 3.25, 0.09, 32]} />
        <meshStandardMaterial color={plot.theme.ground} roughness={1} />
      </mesh>
      <GardenSeason theme={plot.theme} />
      <GardenBookshelf months={months} onOpenShelf={onOpenShelf} />
      <mesh position={[monthFlowerbed.x, 0.15, monthFlowerbed.z]} receiveShadow>
        <boxGeometry args={[1.1, 0.1, 1.65]} />
        <meshStandardMaterial color="#9b8163" />
      </mesh>
      {dates.slice(0, 6).map((date, index) => (
        <GardenFlower
          key={date}
          position={[
            monthFlowerbed.x - 0.28 + (index % 2) * 0.5,
            0.22,
            monthFlowerbed.z - 0.4 + Math.floor(index / 2) * 0.5,
          ]}
          color={index % 2 ? plot.theme.accent : '#ead7a6'}
          onOpen={() => onOpenMemory(date)}
        />
      ))}
      <group position={[mainTree.x, 0.12, mainTree.z]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.16, 1.3, 8]} />
          <meshStandardMaterial color="#8c7051" />
        </mesh>
        <mesh position={[0, 1.5, 0]} scale={[0.8, 1, 0.8]} castShadow>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color={plot.theme.leaves} flatShading />
        </mesh>
      </group>
    </group>
  );
}

export function GardenBridge({ link }: { link: GardenLink }) {
  return (
    <group position={[link.x, 0, link.z]} rotation-y={link.vertical ? -Math.PI / 2 : 0}>
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} position={[-1.32 + index * 0.24, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.23, 0.1, 1.5]} />
          <meshStandardMaterial color={index % 2 ? '#caa57e' : '#d6b48e'} />
        </mesh>
      ))}
      {[-bridge.railZ, bridge.railZ].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.51, z]} castShadow>
            <boxGeometry args={[bridge.railLength, 0.07, bridge.railWidth]} />
            <meshStandardMaterial color="#a88966" />
          </mesh>
          {[-1.25, 0, 1.25].map((x) => (
            <mesh key={x} position={[x, 0.33, z]} castShadow>
              <boxGeometry args={[0.08, 0.6, 0.08]} />
              <meshStandardMaterial color="#a88966" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
