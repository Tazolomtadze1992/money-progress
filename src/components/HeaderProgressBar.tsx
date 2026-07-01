import { progressToPercent } from "../utils/pathProgress";
import { ROUTE_ACTIVE } from "../styles/colors";

interface HeaderProgressBarProps {
  progress: number;
}

export default function HeaderProgressBar({ progress }: HeaderProgressBarProps) {
  const percent = progressToPercent(progress);

  return (
    <div
      className="progress-screen__header-bar"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="პროგრესი"
    >
      <div className="progress-screen__header-bar-track">
        <div
          className="progress-screen__header-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: ROUTE_ACTIVE,
          }}
        />
      </div>
    </div>
  );
}
