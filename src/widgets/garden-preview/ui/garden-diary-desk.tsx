export function GardenDiaryDesk() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[12, 0.35, 8]} />
        <meshStandardMaterial color="#b8906c" roughness={0.9} />
      </mesh>
      {[-3.5, -1.75, 0, 1.75, 3.5].map((z) => (
        <mesh key={z} position={[0, -0.017, z]} receiveShadow>
          <boxGeometry args={[12, 0.005, 0.012]} />
          <meshStandardMaterial color="#9e7654" />
        </mesh>
      ))}
      <group position={[-4.2, 0.01, -2.4]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.37, 0.25, 0.5, 12]} />
          <meshStandardMaterial color="#e3ad91" />
        </mesh>
        {[
          [-0.2, 0.7, 0],
          [0.16, 0.95, 0.06],
          [0, 0.82, -0.12],
        ].map((position, index) => (
          <mesh
            key={index}
            position={position as [number, number, number]}
            scale={[0.65, 1.4, 0.65]}
            castShadow
          >
            <sphereGeometry args={[0.28, 8, 6]} />
            <meshStandardMaterial color={index % 2 ? '#809762' : '#9eaf76'} />
          </mesh>
        ))}
      </group>
      <group position={[4.05, 0.04, 1.8]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <boxGeometry args={[0.65, 0.14, 1.1]} />
          <meshStandardMaterial color="#d8b477" />
        </mesh>
        <mesh position={[0, 0.15, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 8]} />
          <meshStandardMaterial color="#58725a" />
        </mesh>
      </group>
    </group>
  );
}
