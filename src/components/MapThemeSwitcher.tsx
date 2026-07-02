import { MAP_THEME_LIST, type MapThemeId } from "../utils/mapThemes";

interface MapThemeSwitcherProps {
  themeId: MapThemeId;
  onThemeChange: (themeId: MapThemeId) => void;
}

export default function MapThemeSwitcher({
  themeId,
  onThemeChange,
}: MapThemeSwitcherProps) {
  return (
    <aside className="theme-switcher" aria-label="Map theme">
      <h2 className="theme-switcher__title">Map Theme</h2>
      <p className="theme-switcher__hint">Compare map styles.</p>

      <div className="theme-switcher__options">
        {MAP_THEME_LIST.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-switcher__btn ${
              themeId === theme.id ? "theme-switcher__btn--active" : ""
            }`}
            onClick={() => onThemeChange(theme.id)}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
