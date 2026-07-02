export interface RewardPoint {
  x: number;
  y: number;
}

export interface RewardPositions {
  coin: RewardPoint;
  chest: RewardPoint;
}

export type RewardItemId = keyof RewardPositions;

/** Progress at which the coin appears collected (decorative fade) */
export const COIN_COLLECT_PROGRESS = 0.37;

/**
 * Progress at which the chest opens (when avatar passes the chest on the route).
 * Tune to match chest placement along the path (~0.82 for current position).
 */
export const CHEST_OPEN_PROGRESS = 0.82;

/**
 * Saved reward positions in map SVG coordinates (viewBox 0 0 342 322).
 * Tune in Route Editor, then paste the exported block here.
 */
export const REWARD_POSITIONS: RewardPositions = {
  coin: { x: 160.1, y: 246.3 },
  chest: { x: 211.8, y: 117 },
};

export function cloneRewardPositions(positions: RewardPositions): RewardPositions {
  return {
    coin: { ...positions.coin },
    chest: { ...positions.chest },
  };
}

export function getDefaultRewardPositions(): RewardPositions {
  return cloneRewardPositions(REWARD_POSITIONS);
}

function roundCoord(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatRewardPositionsExport(positions: RewardPositions): string {
  const fmt = (point: RewardPoint) =>
    `{ x: ${roundCoord(point.x)}, y: ${roundCoord(point.y)} }`;

  return `export const REWARD_POSITIONS = {
  coin: ${fmt(positions.coin)},
  chest: ${fmt(positions.chest)},
};`;
}
