import { useLayoutEffect, useMemo, useState } from "react";
import { usePathProgress } from "../hooks/usePathProgress";
import {
  CHECKPOINTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ROUTE_PATH,
  getPointAtProgress,
} from "../utils/pathProgress";
import {
  AMOUNT_PILL,
  CHECKPOINT_ACTIVE,
  CHECKPOINT_ACTIVE_BORDER,
  CHECKPOINT_INACTIVE,
  CHECKPOINT_INACTIVE_BORDER,
  CHECKPOINT_INACTIVE_STAR,
  CREDO_PRIMARY,
  ROUTE_ACTIVE,
} from "../styles/colors";

interface JourneyMapProps {
  progress: number;
}

const ROAD_STROKE = 20;
const ROAD_OUTLINE_STROKE = 24;

/** Simple 5-point star, centered at origin */
function StarIcon({ size, fill }: { size: number; fill: string }) {
  const s = size;
  return (
    <path
      d={`M 0 ${-s} L ${s * 0.24} ${-s * 0.31} L ${s * 0.95} ${-s * 0.31} L ${s * 0.38} ${s * 0.12} L ${s * 0.59} ${s} L 0 ${s * 0.42} L ${-s * 0.59} ${s} L ${-s * 0.38} ${s * 0.12} L ${-s * 0.95} ${-s * 0.31} L ${-s * 0.24} ${-s * 0.31} Z`}
      fill={fill}
    />
  );
}

function AvatarMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r="19" fill="rgba(30, 46, 58, 0.1)" transform="translate(0, 1.5)" />
      <circle r="18" fill="#ffffff" stroke={CREDO_PRIMARY} strokeWidth="3" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fill={CREDO_PRIMARY}
        fontFamily="Inter, sans-serif"
      >
        T
      </text>
    </g>
  );
}

interface CheckpointNodeProps {
  x: number;
  y: number;
  label: string;
  isPassed: boolean;
}

function CheckpointNode({
  x,
  y,
  label,
  isPassed,
}: CheckpointNodeProps) {
  const badgeRadius = 11;
  const starSize = 5.5;

  const isHighlighted = isPassed;

  const badgeFill = isHighlighted ? CHECKPOINT_ACTIVE : CHECKPOINT_INACTIVE;
  const badgeStroke = isHighlighted
    ? CHECKPOINT_ACTIVE_BORDER
    : CHECKPOINT_INACTIVE_BORDER;
  const starFill = isHighlighted ? "#FFFFFF" : CHECKPOINT_INACTIVE_STAR;

  const labelWidth = label.length > 5 ? 54 : 46;
  const labelHeight = 16;
  const labelY = badgeRadius + 4;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        r={badgeRadius}
        fill={badgeFill}
        stroke={badgeStroke}
        strokeWidth={isHighlighted ? 2.5 : 2}
        style={{ transition: "stroke 400ms ease, fill 400ms ease" }}
      />
      <StarIcon size={starSize} fill={starFill} />

      <g transform={`translate(0, ${labelY})`}>
        <rect
          x={-labelWidth / 2}
          y="0"
          width={labelWidth}
          height={labelHeight}
          rx={labelHeight / 2}
          fill={AMOUNT_PILL}
          style={{ transition: "opacity 400ms ease" }}
        />
        <text
          x="0"
          y={labelHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="600"
          fill="#FFFFFF"
          fontFamily="Inter, sans-serif"
        >
          {label}
        </text>
      </g>
    </g>
  );
}

export default function JourneyMap({ progress }: JourneyMapProps) {
  const { pathRef, state } = usePathProgress({ progress, durationMs: 650 });
  const [pathReady, setPathReady] = useState(false);

  useLayoutEffect(() => {
    if (pathRef.current) {
      pathRef.current.getTotalLength();
      setPathReady(true);
    }
  }, [pathRef]);

  const positions = useMemo(() => {
    const path = pathRef.current;
    if (!path || !pathReady) return [];

    return CHECKPOINTS.map((cp) => {
      const point = getPointAtProgress(path, cp.t);
      const isPassed = progress >= cp.t - 0.01;
      return { ...cp, ...point, isPassed };
    });
  }, [progress, pathReady, state.animatedProgress, pathRef]);

  const { markerPoint, totalLength, dashOffset } = state;

  return (
    <div className="journey-map">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="journey-map__svg"
        role="img"
        aria-label="Savings journey progress map"
      >
        <image
          href="/without-road.png"
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
        />

        <path ref={pathRef} d={ROUTE_PATH} fill="none" stroke="none" />

        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="#d5cdb8"
          strokeWidth={ROAD_OUTLINE_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="#f2ecdf"
          strokeWidth={ROAD_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {totalLength > 0 && (
          <path
            d={ROUTE_PATH}
            fill="none"
            stroke={ROUTE_ACTIVE}
            strokeWidth={ROAD_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />
        )}

        {positions.map((cp) => (
          <CheckpointNode
            key={cp.id}
            x={cp.x}
            y={cp.y}
            label={cp.label}
            isPassed={cp.isPassed}
          />
        ))}

        {totalLength > 0 && (
          <AvatarMarker x={markerPoint.x} y={markerPoint.y} />
        )}
      </svg>
    </div>
  );
}
