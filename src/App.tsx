import { useCallback, useEffect, useRef, useState } from "react";
import MoneyPotProgressScreen from "./components/MoneyPotProgressScreen";
import PhoneFrame from "./components/PhoneFrame";
import ProgressControls from "./components/ProgressControls";
import { clampProgress } from "./utils/pathProgress";

const SIMULATION_STEPS = [0, 0.25, 0.5, 0.75, 1];
const STEP_DELAY_MS = 900;

export default function App() {
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

  return (
    <div className="app">
      <div className="app__layout">
        <PhoneFrame>
          <MoneyPotProgressScreen
            progress={progress}
            onBack={() => setProgress(0)}
          />
        </PhoneFrame>

        <ProgressControls
          progress={progress}
          onProgressChange={handleProgressChange}
          onSimulateSaving={handleSimulateSaving}
          isSimulating={isSimulating}
        />
      </div>
    </div>
  );
}
