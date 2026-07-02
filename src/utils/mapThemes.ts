export type MapThemeId = "soft" | "cartoon";

export interface MapTheme {
  id: MapThemeId;
  label: string;
  background: string;
  coin: string;
  chestClosed: string;
  chestOpen: string;
}

export const MAP_THEMES: Record<MapThemeId, MapTheme> = {
  soft: {
    id: "soft",
    label: "Soft Map",
    background: "/lastone.png",
    coin: "/coin.svg",
    chestClosed: "/chest-closed.svg",
    chestOpen: "/chest2.svg",
  },
  cartoon: {
    id: "cartoon",
    label: "Cartoon Map",
    background: "/cartoonish.png",
    coin: "/cartoon-coin.svg",
    chestClosed: "/chest-closed.svg",
    chestOpen: "/chest2.svg",
  },
};

export const DEFAULT_MAP_THEME_ID: MapThemeId = "cartoon";

/** Theme switcher order — Cartoon first, Soft second */
export const MAP_THEME_LIST: MapTheme[] = [MAP_THEMES.cartoon, MAP_THEMES.soft];

export function getMapTheme(id: MapThemeId): MapTheme {
  return MAP_THEMES[id];
}
