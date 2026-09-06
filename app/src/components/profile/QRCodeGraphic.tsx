import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { mulberry32 } from '../../data/randomOverlay';

const GRID = 21;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

function inFinderZone(x: number, y: number): boolean {
  const topLeft = x < 7 && y < 7;
  const topRight = x >= GRID - 7 && y < 7;
  const bottomLeft = x < 7 && y >= GRID - 7;
  return topLeft || topRight || bottomLeft;
}

function finderModule(x: number, y: number): boolean {
  const fx = x < 7 ? x : x >= GRID - 7 ? x - (GRID - 7) : x;
  const fy = y < 7 ? y : y >= GRID - 7 ? y - (GRID - 7) : y;
  const onOuterRing = fx === 0 || fx === 6 || fy === 0 || fy === 6;
  const onInnerCore = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
  return onOuterRing || onInnerCore;
}

/** Renders a scannable-looking (but decorative, non-functional) QR module
 * grid — deterministic per `seed` so the same profile always draws the
 * same pattern — used to fill the blank slot baked into the widget art. */
export function QRCodeGraphic({ seed, size, color = '#14102B' }: { seed: string; size: number; color?: string }) {
  const rng = mulberry32(hashString(seed));
  const modules: { x: number; y: number }[] = [];

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (inFinderZone(x, y)) {
        if (finderModule(x, y)) modules.push({ x, y });
        continue;
      }
      // Timing pattern: alternating dots along row/col 6, like real QR.
      if (x === 6 || y === 6) {
        if ((x + y) % 2 === 0) modules.push({ x, y });
        continue;
      }
      if (rng() < 0.42) modules.push({ x, y });
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${GRID} ${GRID}`}>
      <Rect x={0} y={0} width={GRID} height={GRID} fill="none" />
      {modules.map((m, i) => (
        <Rect key={i} x={m.x} y={m.y} width={1} height={1} fill={color} />
      ))}
    </Svg>
  );
}
