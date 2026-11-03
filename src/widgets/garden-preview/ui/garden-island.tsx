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

function Flower({ position, color }: { position: Point; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.4, 4]} />
        <meshStandardMaterial color="#66844b" />
      </mesh>
      <mesh position={[0, 0.43, 0]} castShadow>
        <icosahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

export function GardenIsland() {
  return (
    <group>
      <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.25, 2.9, 0.65, 12]} />
        <meshStandardMaterial color="#b3926b" flatShading />
      </mesh>
      <mesh position={[0, 0.055, 0]} receiveShadow>
        <cylinderGeometry args={[3.25, 3.25, 0.12, 12]} />
        <meshStandardMaterial color="#a3b97b" flatShading />
      </mesh>
      {[-2.55, -1.95, -1.35, -0.75, -0.15, 0.45, 1.05, 1.65, 2.25].map((z, i) => (
        <mesh
          key={z}
          position={[Math.sin(i * 0.7) * 0.24, 0.14, z]}
          rotation={[0, i * 0.15, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[0.32, 0.35, 0.09, 6]} />
          <meshStandardMaterial color={i % 2 ? '#dccfb3' : '#e8dcc1'} flatShading />
        </mesh>
      ))}
      <Tree position={[-1.55, 0.12, -1.2]} />
      <Tree position={[1.4, 0.12, -1.7]} scale={0.68} />
      <Bench />
      <mesh position={[1.55, 0.15, 0.7]} receiveShadow>
        <boxGeometry args={[1.05, 0.12, 1.55]} />
        <meshStandardMaterial color="#8d7957" />
      </mesh>
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
