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
  /** Optional nudge for the entire checkpoint group (badge + label) */
  groupOffsetX?: number;
  groupOffsetY?: number;
}

/** Matches /lastone.png pixel dimensions */
export const MAP_WIDTH = 342;
export const MAP_HEIGHT = 322;

export const MAP_IMAGE = "/lastone.png";

/**
 * Motion path — tuned via Route Editor to match painted road in lastone.png.
 * viewBox: 0 0 342 322
 */
export const ROUTE_PATH =
  "M 17.3 305.6 " +
  "C 43.3 278.8, 129.8 304.9, 156.5 275.6 " +
  "C 181.5 262.6, 140.1 249.2, 134.7 216.3 " +
  "C 142.8 178.1, 217 215.6, 182 153.4 " +
  "C 172.3 117, 244.8 132.7, 272 117.7 " +
  "C 287.1 90.3, 254.3 107.1, 266.2 74";

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
