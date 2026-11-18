import { bridge, nextPlotX } from './garden-plots';

export function GardenNextPlot() {
  return (
    <group position={[nextPlotX, 0, 0]}>
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
        <meshStandardMaterial color="#b4c39a" roughness={1} />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[2.65 - index * 0.65, 0.14, 0]} receiveShadow>
          <cylinderGeometry args={[0.24, 0.28, 0.08, 8]} />
          <meshStandardMaterial color="#e4dccb" />
        </mesh>
      ))}
      <group position={[-1.5, 0.12, -1.2]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.16, 1.3, 8]} />
          <meshStandardMaterial color="#8c7051" />
        </mesh>
        <mesh position={[0, 1.5, 0]} scale={[0.8, 1, 0.8]} castShadow>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#8eaa7d" flatShading />
        </mesh>
      </group>
    </group>
  );
}

export function GardenBridge() {
  return (
    <group position={[nextPlotX / 2, 0, 0]}>
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
