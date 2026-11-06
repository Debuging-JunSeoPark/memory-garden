import { GardenBookshelf } from './garden-bookshelf';

type Point = [number, number, number];

function Tree({ position, scale = 1 }: { position: Point; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 7]} />
        <meshStandardMaterial color="#8c7051" flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color="#78975b" flatShading />
      </mesh>
      <mesh position={[-0.45, 1.55, 0.16]} castShadow>
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#8da569" flatShading />
      </mesh>
      <mesh position={[0.47, 1.7, 0]} castShadow>
        <icosahedronGeometry args={[0.61, 0]} />
        <meshStandardMaterial color="#6b8b52" flatShading />
      </mesh>
    </group>
  );
}

function Bench() {
  return (
    <group position={[-1.45, 0.12, 0.65]} rotation={[0, 0.15, 0]}>
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

function Flower({ position, color }: { position: Point; color: string }) {
  return (
    <group position={position}>
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

export function GardenIsland({ onOpenShelf }: { onOpenShelf?: () => void }) {
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
        <meshStandardMaterial color="#a3b97b" flatShading />
      </mesh>
      {[-1.52, -0.96, -0.38, 0.19, 0.77, 1.38, 2, 2.55].map((z, i) => (
        <mesh
          key={z}
          position={[Math.sin(i * 0.7) * 0.24, 0.14, z]}
          rotation={[0, i * 0.15, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.3, 0.34, 0.09, 8]} />
          <meshStandardMaterial color={i % 2 ? '#dccfb3' : '#e8dcc1'} flatShading />
        </mesh>
      ))}
      <Tree position={[-1.55, 0.12, -1.2]} />
      <Tree position={[2.05, 0.12, -1.24]} scale={0.61} />
      <GardenBookshelf onOpenShelf={onOpenShelf} />
      <Bench />
      <mesh position={[1.55, 0.15, 0.7]} receiveShadow>
        <boxGeometry args={[1.05, 0.12, 1.55]} />
        <meshStandardMaterial color="#8d7957" />
      </mesh>
      {[-0.56, 0.56].map((x) => (
        <mesh key={x} position={[1.55 + x, 0.2, 0.7]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.16, 1.67]} />
          <meshStandardMaterial color="#b38361" />
        </mesh>
      ))}
      {[-0.79, 0.79].map((z) => (
        <mesh key={z} position={[1.55, 0.2, 0.7 + z]} castShadow receiveShadow>
          <boxGeometry args={[1.04, 0.16, 0.08]} />
          <meshStandardMaterial color="#b38361" />
        </mesh>
      ))}
      {[0, 1, 2].flatMap((row) =>
        [0, 1].map((column) => (
          <Flower
            key={`${row}-${column}`}
            position={[1.27 + column * 0.5, 0.22, 0.2 + row * 0.5]}
            color={(row + column) % 2 ? '#e6ad9b' : '#efd18a'}
          />
        )),
      )}
      {[
        [-2.35, 0.16, 0],
        [2.3, 0.18, -0.4],
        [-1.2, 0.14, 2],
      ].map((point, i) => (
        <mesh key={i} position={point as Point} scale={[0.35, 0.2, 0.28]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#b0b1a0" flatShading />
        </mesh>
      ))}
      {[
        [-2.1, 0.12, 1.7],
        [1.2, 0.12, 2.1],
        [-0.7, 0.12, -2.5],
      ].map((point, i) => (
        <mesh key={i} position={point as Point} scale={[0.4, 0.3, 0.4]} castShadow>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#8da565" flatShading />
        </mesh>
      ))}
    </group>
  );
}
