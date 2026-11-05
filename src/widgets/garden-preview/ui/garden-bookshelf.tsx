import { Shape, type ExtrudeGeometryOptions } from 'three';
import { shelfPosition } from './garden-walk';

const canopy = new Shape()
  .moveTo(-0.81, 0)
  .quadraticCurveTo(0, 0.92, 0.81, 0)
  .lineTo(0.68, 0)
  .quadraticCurveTo(0, 0.68, -0.68, 0)
  .closePath();

const canopyOptions: ExtrudeGeometryOptions = {
  depth: 0.78,
  curveSegments: 16,
  bevelSize: 0.025,
  bevelThickness: 0.025,
  bevelSegments: 2,
};

const shelves = [0.1, 0.59, 1.08];

export function GardenBookshelf({ onOpenGuide }: { onOpenGuide?: () => void }) {
  return (
    <group position={[shelfPosition.x, 0.12, shelfPosition.z]}>
      <mesh position={[0, 0.04, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.08, 0.9]} />
        <meshStandardMaterial color="#ddac8b" />
      </mesh>
      <mesh position={[0, 0.64, -0.28]} castShadow receiveShadow>
        <boxGeometry args={[1.34, 1.12, 0.08]} />
        <meshStandardMaterial color="#926c51" />
      </mesh>
      {[-0.69, 0.69].map((x) => (
        <mesh key={x} position={[x, 0.69, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 1.24, 0.68]} />
          <meshStandardMaterial color="#89a57e" />
        </mesh>
      ))}
      {shelves.map((y) => (
        <mesh key={y} position={[0, y, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[1.32, 0.075, 0.65]} />
          <meshStandardMaterial color="#dbab79" />
        </mesh>
      ))}
      <mesh position={[0, 1.29, -0.38]} castShadow receiveShadow>
        <extrudeGeometry args={[canopy, canopyOptions]} />
        <meshStandardMaterial color="#77966f" roughness={0.85} />
      </mesh>
      <group position={[-0.41, 0.81, 0.23]} rotation={[0, -0.14, -0.13]} onClick={onOpenGuide}>
        <mesh castShadow>
          <boxGeometry args={[0.19, 0.36, 0.24]} />
          <meshStandardMaterial color="#d58550" />
        </mesh>
        <mesh position={[0.096, 0, -0.018]}>
          <boxGeometry args={[0.009, 0.32, 0.19]} />
          <meshStandardMaterial color="#f6e6bd" />
        </mesh>
        <mesh position={[0, 0.061, 0.122]}>
          <boxGeometry args={[0.105, 0.095, 0.012]} />
          <meshStandardMaterial color="#ffe3a1" />
        </mesh>
        <mesh position={[0.025, -0.14, 0.13]}>
          <boxGeometry args={[0.027, 0.105, 0.013]} />
          <meshStandardMaterial color="#ad5748" />
        </mesh>
      </group>
      <group position={[-0.61, 0.08, 0.4]}>
        {[0.025, 0.22].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.086, 0.096, 0.05, 8]} />
            <meshStandardMaterial color="#956747" />
          </mesh>
        ))}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.065, 0.071, 0.15, 8]} />
          <meshStandardMaterial color="#ffd593" emissive="#efa756" emissiveIntensity={0.45} />
        </mesh>
      </group>
      <group position={[0.43, 0.14, 0.21]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.115, 0.075, 0.16, 12]} />
          <meshStandardMaterial color="#e4a18a" />
        </mesh>
        <mesh position={[-0.04, 0.205, 0]} rotation={[0, 0, 0.55]} castShadow>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshStandardMaterial color="#80985f" />
        </mesh>
        <mesh position={[0.05, 0.23, 0.01]} scale={[0.65, 1.2, 0.7]} castShadow>
          <sphereGeometry args={[0.085, 8, 6]} />
          <meshStandardMaterial color="#a6b87d" />
        </mesh>
      </group>
    </group>
  );
}
