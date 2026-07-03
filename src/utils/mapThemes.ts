import type { RewardPositions } from "./rewardPositions";

export type MapThemeId =
  | "cartoon"
  | "cityNature"
  | "city"
  | "treasureIsland"
  | "treasure2";

export interface MapTheme {
  id: MapThemeId;
  label: string;
  background: string;
  coin: string;
  chestClosed: string;
  chestOpen: string;
  routePath: string;
  rewardPositions: RewardPositions;
  coinCollectProgress: number;
  chestOpenProgress: number;
}

const STANDARD_CHEST = {
  chestClosed: "/chest-closed.svg",
  chestOpen: "/chest2.svg",
};

/** Cartoon route — tuned for cartoonish.png (edit per theme in Route Editor) */
const CARTOON_ROUTE_PATH =
  "M 17.3 305.6 " +
  "C 43.3 278.8, 129.8 304.9, 156.5 275.6 " +
  "C 181.5 262.6, 140.1 249.2, 134.7 216.3 " +
  "C 142.8 178.1, 217 215.6, 182 153.4 " +
  "C 172.3 117, 244.8 132.7, 272 117.7 " +
  "C 287.1 90.3, 254.3 107.1, 266.2 74";

const CARTOON_REWARD_POSITIONS: RewardPositions = {
  coin: { x: 160.1, y: 246.3 },
  chest: { x: 185.7, y: 177.1 },
};

const CARTOON_COIN_COLLECT = 0.37;
const CARTOON_CHEST_OPEN = 0.6;

/** Placeholder route/rewards for new themes — edit independently per theme */
function placeholderThemeData(): Pick<
  MapTheme,
  "routePath" | "rewardPositions" | "coinCollectProgress" | "chestOpenProgress"
> {
  return {
    routePath: CARTOON_ROUTE_PATH,
    rewardPositions: {
      coin: { ...CARTOON_REWARD_POSITIONS.coin },
      chest: { ...CARTOON_REWARD_POSITIONS.chest },
    },
    coinCollectProgress: CARTOON_COIN_COLLECT,
    chestOpenProgress: CARTOON_CHEST_OPEN,
  };
}

export const MAP_THEMES: Record<MapThemeId, MapTheme> = {
  cartoon: {
    id: "cartoon",
    label: "Cartoon Map",
    background: "/cartoonish.png",
    coin: "/cartoon-coin.svg",
    ...STANDARD_CHEST,
    routePath: CARTOON_ROUTE_PATH,
    rewardPositions: {
      coin: { ...CARTOON_REWARD_POSITIONS.coin },
      chest: { ...CARTOON_REWARD_POSITIONS.chest },
    },
    coinCollectProgress: CARTOON_COIN_COLLECT,
    chestOpenProgress: CARTOON_CHEST_OPEN,
  },
  cityNature: {
    id: "cityNature",
    label: "City Nature",
    background: "/city-nature.png",
    coin: "/cartoon-coin.svg",
    ...STANDARD_CHEST,
    ...placeholderThemeData(),
  },
  city: {
    id: "city",
    label: "City",
    background: "/city.png",
    coin: "/cartoon-coin.svg",
    ...STANDARD_CHEST,
    ...placeholderThemeData(),
  },
  treasureIsland: {
    id: "treasureIsland",
    label: "Treasure Island",
    background: "/treasure-island.png",
    coin: "/cartoon-coin.svg",
    ...STANDARD_CHEST,
    routePath:
      "M 155.8 318.9 " +
      "C 181.8 292.1, 92.4 274, 119.1 244.7 " +
      "C 132.7 203.8, 178.6 229.3, 192.1 199.9 " +
      "C 213.1 182.6, 215.7 174.2, 184 143.2 " +
      "C 215.1 107.1, 237.3 114.8, 273.8 112.6 " +
      "C 340.2 101.6, 302.7 101.8, 314.6 68.7 ",
    rewardPositions: {
      coin: { x: 125.4, y: 267.8 },
      chest: { x: 199.4, y: 162.6 },
    },
    coinCollectProgress: 0.37,
    chestOpenProgress: 0.6,
  },
  treasure2: {
    id: "treasure2",
    label: "Treasure Island 2",
    background: "/treasure2.png",
    coin: "/cartoon-coin.svg",
    ...STANDARD_CHEST,
    routePath:
      "M 54.4 312 " +
      "C 80.4 285.2, 119 307, 145.7 277.7 " +
      "C 170.7 264.7, 134 227.8, 128.6 194.9 " +
      "C 136.7 156.7, 211.5 177, 201.9 151.7 " +
      "C 187.6 92.7, 196.4 111.3, 219 93.4 " +
      "C 253.6 76.5, 292.2 105.1, 304.1 72 ",
    rewardPositions: {
      coin: { x: 144, y: 221.6 },
      chest: { x: 198.8, y: 152.1 },
    },
    coinCollectProgress: 0.37,
    chestOpenProgress: 0.6,
  },
};

export const DEFAULT_MAP_THEME_ID: MapThemeId = "cartoon";

/** Theme switcher order */
export const MAP_THEME_LIST: MapTheme[] = [
  MAP_THEMES.cartoon,
  MAP_THEMES.treasure2,
  MAP_THEMES.cityNature,
  MAP_THEMES.city,
  MAP_THEMES.treasureIsland,
];

export function getMapTheme(id: MapThemeId): MapTheme {
  return MAP_THEMES[id];
}

export function getThemeSavedRoute(id: MapThemeId): string {
  return MAP_THEMES[id].routePath;
}

export function getThemeSavedRewardPositions(id: MapThemeId): RewardPositions {
  const { rewardPositions } = MAP_THEMES[id];
  return {
    coin: { ...rewardPositions.coin },
    chest: { ...rewardPositions.chest },
  };
}
