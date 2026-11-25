import type { GardenTheme } from './garden-plots';

export function GardenSeason({ theme }: { theme: GardenTheme }) {
  const winter = theme.detail === 'snow';
  const autumn = theme.detail === 'fallen';
  return (
    <group>
      {Array.from({ length: winter ? 7 : 12 }, (_, index) => {
        const angle = index * 2.4;
        const radius = 1.2 + (index % 3) * 0.45;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        if (Math.abs(z) < 0.7 || Math.abs(x) < 0.7 || (x > 0.7 && z > 0)) return null;
        return (
          <group key={index} position={[x, 0.14, z]} rotation-y={angle}>
            {winter ? (
              <mesh scale={[0.48, 0.1, 0.32]} receiveShadow>
                <sphereGeometry args={[0.65, 8, 6]} />
                <meshStandardMaterial color="#f0f0e7" roughness={1} />
              </mesh>
            ) : autumn || theme.detail === 'petals' ? (
              <mesh scale={[0.13, 0.025, 0.22]} rotation-y={index} receiveShadow>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color={index % 2 ? theme.accent : theme.leaves}
                  roughness={1}
                />
              </mesh>
            ) : (
              <group>
                <mesh position-y={0.16}>
                  <cylinderGeometry args={[0.018, 0.025, 0.32, 5]} />
                  <meshStandardMaterial color="#6e8e62" />
                </mesh>
                <mesh position-y={theme.detail === 'sunflowers' ? 0.5 : 0.32} scale={[1, 0.6, 1]}>
                  <icosahedronGeometry args={[theme.detail === 'hydrangea' ? 0.22 : 0.12, 1]} />
                  <meshStandardMaterial color={theme.accent} flatShading />
                </mesh>
                {theme.detail === 'sunflowers' && (
                  <mesh position={[0, 0.55, 0.07]}>
                    <sphereGeometry args={[0.055, 6, 4]} />
                    <meshStandardMaterial color="#8d7050" />
                  </mesh>
                )}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
