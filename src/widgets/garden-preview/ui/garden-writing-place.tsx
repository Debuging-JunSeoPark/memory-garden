import { writingPosition } from './garden-walk';

export function GardenWritingPlace({ onOpen }: { onOpen?: () => void }) {
  return (
    <group position={[writingPosition.x, 0.12, writingPosition.z]} onClick={onOpen}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.12, 12]} />
        <meshStandardMaterial color="#d7c6a2" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.6, 8]} />
        <meshStandardMaterial color="#947353" />
      </mesh>
      <mesh position={[0, 0.64, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.07, 0.45]} />
        <meshStandardMaterial color="#c99c6a" />
      </mesh>
      <group position={[0, 0.7, 0]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.39, 0.06, 0.3]} />
          <meshStandardMaterial color="#b87555" />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.035, 0]}>
            <boxGeometry args={[0.17, 0.015, 0.26]} />
            <meshStandardMaterial color="#ffeac1" emissive="#e9c182" emissiveIntensity={0.2} />
          </mesh>
        ))}
        <mesh position={[0.12, 0.055, 0.04]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.009, 0.009, 0.23, 6]} />
          <meshStandardMaterial color="#536b40" />
        </mesh>
      </group>
    </group>
  );
}
