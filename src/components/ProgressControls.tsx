interface ProgressControlsProps {
  progress: number;
  onProgressChange: (value: number) => void;
  onSimulateSaving: () => void;
  isSimulating: boolean;
}

const PRESETS = [
  { label: "0%", value: 0 },
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
];

export default function ProgressControls({
  progress,
  onProgressChange,
  onSimulateSaving,
  isSimulating,
}: ProgressControlsProps) {
  const percent = Math.round(progress * 100);

  return (
    <aside className="controls" aria-label="Prototype controls">
      <h2 className="controls__title">Progress Controls</h2>
      <p className="controls__hint">
        Test marker movement, route fill, and checkpoint activation.
      </p>

      <div className="controls__presets">
        {PRESETS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={`controls__btn ${
              Math.abs(progress - value) < 0.001 ? "controls__btn--active" : ""
            }`}
            onClick={() => onProgressChange(value)}
            disabled={isSimulating}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="controls__slider-label" htmlFor="progress-slider">
        Custom: {percent}%
      </label>
      <input
        id="progress-slider"
        type="range"
        min="0"
        max="100"
        step="1"
        value={percent}
        className="controls__slider"
        onChange={(e) => onProgressChange(Number(e.target.value) / 100)}
        disabled={isSimulating}
      />

      <button
        type="button"
        className="controls__simulate"
        onClick={onSimulateSaving}
        disabled={isSimulating}
      >
        {isSimulating ? "Simulating…" : "Simulate saving"}
      </button>
    </aside>
  );
}
