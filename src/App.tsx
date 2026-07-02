import { useCallback, useEffect, useRef, useState } from "react";
import MoneyPotProgressScreen from "./components/MoneyPotProgressScreen";
import PhoneFrame from "./components/PhoneFrame";
import ProgressControls from "./components/ProgressControls";
import RouteEditor from "./components/RouteEditor";
import MapThemeSwitcher from "./components/MapThemeSwitcher";
import { clampProgress } from "./utils/pathProgress";
import {
  DEFAULT_MAP_THEME_ID,
  getMapTheme,
  type MapThemeId,
} from "./utils/mapThemes";

const SIMULATION_STEPS = [0, 0.25, 0.5, 0.75, 1];
const STEP_DELAY_MS = 900;

type AppMode = "prototype" | "editor";

export default function App() {
  const [mode, setMode] = useState<AppMode>("prototype");
  const [mapThemeId, setMapThemeId] = useState<MapThemeId>(DEFAULT_MAP_THEME_ID);
  const [progress, setProgress] = useState(0.25);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const handleProgressChange = useCallback((value: number) => {
    setProgress(clampProgress(value));
  }, []);

  const runSimulationStep = useCallback((index: number) => {
    if (index >= simulationRef.current.length) {
      setIsSimulating(false);
      return;
    }

    setProgress(simulationRef.current[index]);
    timeoutRef.current = window.setTimeout(
      () => runSimulationStep(index + 1),
      STEP_DELAY_MS,
    );
  }, []);

  const handleSimulateSaving = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    simulationRef.current = SIMULATION_STEPS;
    setIsSimulating(true);
    setProgress(0);
    timeoutRef.current = window.setTimeout(() => runSimulationStep(1), STEP_DELAY_MS);
  }, [runSimulationStep]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const mapTheme = getMapTheme(mapThemeId);

  return (
    <div className="app">
      <div className="app__shell">
        <nav className="app__tabs" aria-label="Prototype modes">
          <button
            type="button"
            className={`app__tab ${mode === "prototype" ? "app__tab--active" : ""}`}
            onClick={() => setMode("prototype")}
          >
            Prototype
          </button>
          <button
            type="button"
            className={`app__tab ${mode === "editor" ? "app__tab--active" : ""}`}
            onClick={() => setMode("editor")}
          >
            Route Editor
          </button>
        </nav>

        {mode === "prototype" ? (
          <div className="app__layout">
            <div className="app__layout-side app__layout-side--left">
              <MapThemeSwitcher
                themeId={mapThemeId}
                onThemeChange={setMapThemeId}
              />
            </div>

            <div className="app__layout-center">
              <PhoneFrame>
                <MoneyPotProgressScreen
                  progress={progress}
                  theme={mapTheme}
                  onBack={() => setProgress(0)}
                />
              </PhoneFrame>
            </div>

            <div className="app__layout-side app__layout-side--right">
              <ProgressControls
                progress={progress}
                onProgressChange={handleProgressChange}
                onSimulateSaving={handleSimulateSaving}
                isSimulating={isSimulating}
              />
            </div>
          </div>
        ) : (
          <RouteEditor themeId={mapThemeId} onThemeChange={setMapThemeId} />
        )}
      </div>
    </div>
  );
}
