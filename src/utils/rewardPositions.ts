export interface RewardPoint {
  x: number;
  y: number;
}

export interface RewardPositions {
  coin: RewardPoint;
  chest: RewardPoint;
}

export type RewardItemId = keyof RewardPositions;

export function cloneRewardPositions(positions: RewardPositions): RewardPositions {
  return {
    coin: { ...positions.coin },
    chest: { ...positions.chest },
  };
}

function roundCoord(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatRewardPositionsExport(
  positions: RewardPositions,
  themeId?: string,
): string {
  const fmt = (point: RewardPoint) =>
    `{ x: ${roundCoord(point.x)}, y: ${roundCoord(point.y)} }`;

  const header = themeId
    ? `// Paste into MAP_THEMES.${themeId} in src/utils/mapThemes.ts\n`
    : "";

  return `${header}rewardPositions: {
  coin: ${fmt(positions.coin)},
  chest: ${fmt(positions.chest)},
},`;
}

export function formatThemeRewardExport(
  themeId: string,
  positions: RewardPositions,
  coinCollectProgress: number,
  chestOpenProgress: number,
): string {
  return `${formatRewardPositionsExport(positions, themeId)}
coinCollectProgress: ${coinCollectProgress},
chestOpenProgress: ${chestOpenProgress},`;
}
