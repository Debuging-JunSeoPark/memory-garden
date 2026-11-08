import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group } from 'three';
import {
  directionKeys,
  isNearShelf,
  isNearWritingPlace,
  spawnPosition,
  still,
  walk,
  type Direction,
} from './garden-walk';

export function GardenPlayer({
  active,
  joystick,
  onNearShelf,
  onFirstMove,
  onOpenShelf,
  onNearWritingPlace,
  onOpenDiary,
}: {
  active: boolean;
  joystick: Direction;
  onNearShelf: (near: boolean) => void;
  onFirstMove: () => void;
  onOpenShelf: () => void;
  onNearWritingPlace: (near: boolean) => void;
  onOpenDiary: () => void;
}) {
  const model = useRef<Group>(null);
  const keys = useRef(new Set<string>());
  const nearby = useRef(false);
  const nearWriting = useRef(isNearWritingPlace(spawnPosition));
  const moved = useRef(false);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return;
    const pressed = keys.current;
    const clear = () => pressed.clear();
    const press = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Enter' && (nearby.current || nearWriting.current) && !event.repeat) {
        const target = event.target;
        if (!(target instanceof Element) || !target.closest('button, a, input, select, textarea')) {
          event.preventDefault();
          if (nearby.current) onOpenShelf();
          else onOpenDiary();
        }
        return;
      }
      const key = event.key.toLowerCase();
      const directionKey = event.key.startsWith('Arrow') ? event.key : key;
      if (!Object.hasOwn(directionKeys, directionKey)) return;
      event.preventDefault();
      pressed.add(directionKey);
      invalidate();
    };
    const release = (event: KeyboardEvent) => {
      const key = event.key.startsWith('Arrow') ? event.key : event.key.toLowerCase();
      if (pressed.delete(key)) invalidate();
    };

    window.addEventListener('keydown', press);
    window.addEventListener('keyup', release);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      clear();
      window.removeEventListener('keydown', press);
      window.removeEventListener('keyup', release);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
    };
  }, [active, invalidate, onOpenShelf, onOpenDiary]);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate, joystick]);

  useFrame((_, delta) => {
    const player = model.current;
    if (!active || !player) return;
    const keyboard = { ...still };
    for (const key of keys.current) {
      keyboard.x += directionKeys[key].x;
      keyboard.y += directionKeys[key].y;
    }
    const direction =
      keys.current.size > 0 ? { x: Math.sign(keyboard.x), y: Math.sign(keyboard.y) } : joystick;
    if (!direction.x && !direction.y) return;

    const next = walk(player.position, direction, delta);
    if (!moved.current && (next.x !== player.position.x || next.z !== player.position.z)) {
      moved.current = true;
      onFirstMove();
    }
    player.position.x = next.x;
    player.position.z = next.z;
    player.rotation.y = next.heading;
    const near = isNearShelf(next);
    if (near !== nearby.current) {
      nearby.current = near;
      onNearShelf(near);
    }
    const nearDiary = isNearWritingPlace(next);
    if (nearDiary !== nearWriting.current) {
      nearWriting.current = nearDiary;
      onNearWritingPlace(nearDiary);
    }
    invalidate();
  });

  return (
    <group ref={model} visible={active} position={[spawnPosition.x, 0.17, spawnPosition.z]}>
      <mesh position={[0, 0.29, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.15, 4, 10]} />
        <meshStandardMaterial color="#d39066" />
      </mesh>
      <mesh position={[0, 0.59, 0.01]} castShadow>
        <sphereGeometry args={[0.17, 12, 8]} />
        <meshStandardMaterial color="#edbb8e" />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.19, 0.12, 12]} />
        <meshStandardMaterial color="#52765b" />
      </mesh>
      {[-0.07, 0.07].map((x) => (
        <group key={x} position-x={x}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.095, 0.12, 0.17]} />
            <meshStandardMaterial color="#634d43" />
          </mesh>
          <mesh position={[0, 0.6, 0.165]}>
            <sphereGeometry args={[0.016, 6, 4]} />
            <meshStandardMaterial color="#3c3830" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
