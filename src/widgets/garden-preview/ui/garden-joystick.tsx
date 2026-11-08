import { useRef, type PointerEvent } from 'react';
import { still, type Direction } from './garden-walk';

export function GardenJoystick({
  direction,
  onMove,
}: {
  direction: Direction;
  onMove: (direction: Direction) => void;
}) {
  const pointer = useRef<number | null>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 3;
    const length = Math.hypot(x, y);
    onMove(length < 0.15 ? still : { x: x / Math.max(1, length), y: y / Math.max(1, length) });
  }

  function stop(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    onMove(still);
  }

  return (
    <div
      role="group"
      aria-label="이동 조이스틱"
      className="absolute bottom-6 left-5 grid size-24 touch-none place-items-center rounded-full border border-moss/30 bg-paper/75 shadow-sm select-none [@media(pointer:fine)]:hidden"
      onPointerDown={(event) => {
        if (pointer.current !== null || event.button !== 0) return;
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        move(event);
      }}
      onPointerMove={move}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none size-10 rounded-full border border-moss/30 bg-moss/25 shadow-sm"
        style={{ transform: `translate(${direction.x * 23}px, ${direction.y * 23}px)` }}
      />
    </div>
  );
}
