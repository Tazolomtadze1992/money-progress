import { useCoinPickup } from "../hooks/useCoinPickup";
import { COIN_SIZE } from "../utils/pathProgress";
import { COIN_COLLECT_PROGRESS } from "../utils/rewardPositions";

/** Max upward travel during pickup — foreignObject needs headroom above anchor */
const PICKUP_LIFT = 22;

interface RouteCoinProps {
  x: number;
  y: number;
  icon: string;
  progress: number;
  collectThreshold?: number;
}

export default function RouteCoin({
  x,
  y,
  icon,
  progress,
  collectThreshold = COIN_COLLECT_PROGRESS,
}: RouteCoinProps) {
  const half = COIN_SIZE / 2;
  const { phase, onPickupAnimationEnd } = useCoinPickup(progress, collectThreshold);

  if (phase === "hidden") {
    return null;
  }

  const isAnimating = phase === "animating";

  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden="true">
      <foreignObject
        x={-half}
        y={-half - PICKUP_LIFT}
        width={COIN_SIZE}
        height={COIN_SIZE + PICKUP_LIFT}
        overflow="visible"
      >
        <div
          className="journey-map__coin-fo"
          style={{ width: COIN_SIZE, height: COIN_SIZE + PICKUP_LIFT }}
        >
          <div
            className="journey-map__coin-stage"
            style={{ width: COIN_SIZE, height: COIN_SIZE }}
          >
            <div
              className={
                isAnimating
                  ? "journey-map__coin-wrapper journey-map__coin-wrapper--pickup"
                  : "journey-map__coin-wrapper"
              }
              onAnimationEnd={isAnimating ? onPickupAnimationEnd : undefined}
            >
              <div className="journey-map__coin-edge" aria-hidden="true" />

              <div className="journey-map__coin-face journey-map__coin-face--front">
                <div
                  className="journey-map__coin-face-inner"
                  style={{ backgroundImage: `url("${icon}")` }}
                />
              </div>

              <div className="journey-map__coin-face journey-map__coin-face--back">
                <div
                  className="journey-map__coin-face-inner"
                  style={{ backgroundImage: `url("${icon}")` }}
                />
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
