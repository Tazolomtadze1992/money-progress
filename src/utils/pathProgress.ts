export interface PathPoint {
  x: number;
  y: number;
}

export interface CheckpointConfig {
  id: string;
  /** 0–1 position along the path */
  t: number;
  amount: number;
  label: string;
}

/** Matches /without-road.png pixel dimensions */
export const MAP_WIDTH = 342;
export const MAP_HEIGHT = 319;

/**
 * Winding route traced from with-road.png reference.
 * viewBox: 0 0 342 319
 *
 * Key landmarks along the path:
 * - Start: top edge (~45% from left)
 * - First bend: upper-left near pond
 * - Second bend: center-right near cottage
 * - Third bend: lower-left meadow
 * - End: bottom-right flag
 */
export const ROUTE_PATH =
  "M 154 8 " +
  "C 130 25, 110 55, 96 70 " +
  "C 82 95, 160 120, 212 144 " +
  "C 240 165, 170 178, 120 207 " +
  "C 70 215, 200 250, 301 230";

export const CHECKPOINTS: CheckpointConfig[] = [
  { id: "cp-1", t: 0.25, amount: 2_000, label: "2,000" },
  { id: "cp-2", t: 0.5, amount: 4_000, label: "4,000" },
  { id: "cp-3", t: 0.75, amount: 6_000, label: "6,000" },
  { id: "cp-4", t: 1, amount: 8_000, label: "8,000" },
];

export const GOAL_AMOUNT = 8_000;

export function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function getPointAtProgress(
  path: SVGPathElement,
  progress: number,
): PathPoint {
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length * clampProgress(progress));
  return { x: point.x, y: point.y };
}

export function getActiveLength(path: SVGPathElement, progress: number): number {
  return path.getTotalLength() * clampProgress(progress);
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US");
}

export function progressToAmount(progress: number): number {
  return Math.round(GOAL_AMOUNT * clampProgress(progress));
}

export function progressToPercent(progress: number): number {
  return Math.round(clampProgress(progress) * 100);
}
