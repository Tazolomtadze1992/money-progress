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

/** Matches map SVG viewBox pixel dimensions */
export const MAP_WIDTH = 342;
export const MAP_HEIGHT = 322;

export const CHECKPOINTS: CheckpointConfig[] = [
  { id: "cp-1", t: 0.25, amount: 2_000, label: "2,000" },
  { id: "cp-2", t: 0.5, amount: 4_000, label: "4,000" },
  { id: "cp-3", t: 0.75, amount: 6_000, label: "6,000" },
  { id: "cp-4", t: 1, amount: 8_000, label: "8,000" },
];

export const GOAL_AMOUNT = 8_000;

export const COIN_SIZE = 20;
export const CHEST_WIDTH = 32;
export const CHEST_HEIGHT = 28;

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
