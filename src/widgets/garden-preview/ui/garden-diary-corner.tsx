export function GardenDiaryCorner() {
  return (
    <group position={[4, -0.1, 0]}>
      <mesh position={[0, -0.18, 0]} scale={[1.4, 0.18, 1.2]} receiveShadow>
        <sphereGeometry args={[1, 40, 24]} />
        <meshStandardMaterial color="#e2e8d8" roughness={1} />
      </mesh>
      <mesh position={[0, 0.36, 0]} scale={[0.62, 0.6, 0.62]} castShadow>
        <sphereGeometry args={[1, 40, 32]} />
        <meshStandardMaterial color="#efd9cb" roughness={1} />
      </mesh>
      <mesh position={[0, 0.87, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#a99a7e" roughness={1} />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 1.1, 12]} />
        <meshStandardMaterial color="#8c9e75" roughness={1} />
      </mesh>
      {[
        { position: [-0.3, 1.24, 0.02], rotation: -0.65, color: '#a4b58e' },
        { position: [0.28, 1.57, 0], rotation: 0.65, color: '#b9c6a5' },
        { position: [-0.12, 1.95, 0], rotation: -0.25, color: '#9eb38b' },
      ].map(({ position, rotation, color }, index) => (
        <mesh
          key={index}
          position={position as [number, number, number]}
          rotation={[0, 0, rotation]}
          scale={[0.25, 0.46, 0.15]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
      <mesh position={[-0.85, -0.01, 0.45]} scale={[0.25, 0.14, 0.2]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#e6ddd0" roughness={1} />
      </mesh>
    </group>
  );
}
