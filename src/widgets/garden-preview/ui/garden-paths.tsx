import type { GardenLink, GardenPlot } from './garden-plots';

export function GardenPaths({
  plot,
  index,
  links,
}: {
  plot: GardenPlot;
  index: number;
  links: GardenLink[];
}) {
  return (
    <group position={[plot.x, 0, plot.z]}>
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[0.31, 0.34, 0.08, 8]} />
        <meshStandardMaterial color="#e4dccb" />
      </mesh>
      {links
        .filter((link) => link.from === index || link.to === index)
        .map((link) => (
          <group key={`${link.from}-${link.to}`}>
            {[0.8, 1.6, 2.4].map((distance, step) => (
              <mesh
                key={distance}
                position={[
                  Math.sign(link.x - plot.x) * distance,
                  0.14,
                  Math.sign(link.z - plot.z) * distance,
                ]}
                rotation-y={step * 0.18}
                receiveShadow
              >
                <cylinderGeometry args={[0.26, 0.29, 0.08, 8]} />
                <meshStandardMaterial color={step % 2 ? '#dccfb3' : '#e8dcc1'} />
              </mesh>
            ))}
          </group>
        ))}
    </group>
  );
}
