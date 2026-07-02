import { useLayoutEffect, useMemo, useState } from "react";
import { usePathProgress } from "../hooks/usePathProgress";
import {
  CHECKPOINTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ROUTE_PATH,
  getPointAtProgress,
} from "../utils/pathProgress";
import type { MapTheme } from "../utils/mapThemes";
import {
  CHEST_OPEN_PROGRESS,
  REWARD_POSITIONS,
} from "../utils/rewardPositions";
import RouteCoin from "./RouteCoin";
import RouteTreasureChest from "./RouteTreasureChest";
import {
  AMOUNT_PILL,
  CHECKPOINT_ACTIVE,
  CHECKPOINT_ACTIVE_BORDER,
  CHECKPOINT_INACTIVE,
  CHECKPOINT_INACTIVE_BORDER,
  CHECKPOINT_INACTIVE_STAR,
  CREDO_PRIMARY,
} from "../styles/colors";

interface JourneyMapProps {
  progress: number;
  theme: MapTheme;
}

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
      <circle r="17" fill="rgba(30, 46, 58, 0.1)" transform="translate(0, 1.5)" />
      <circle r="16" fill="#ffffff" stroke={CREDO_PRIMARY} strokeWidth="2.5" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
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
  groupOffsetX?: number;
  groupOffsetY?: number;
}

const LABEL_GAP = 4;

function CheckpointNode({
  x,
  y,
  label,
  isPassed,
  groupOffsetX = 0,
  groupOffsetY = 0,
}: CheckpointNodeProps) {
  const badgeRadius = 10;
  const starSize = 5.5;

  const isHighlighted = isPassed;

  const badgeFill = isHighlighted ? CHECKPOINT_ACTIVE : CHECKPOINT_INACTIVE;
  const badgeStroke = isHighlighted
    ? CHECKPOINT_ACTIVE_BORDER
    : CHECKPOINT_INACTIVE_BORDER;
  const starFill = isHighlighted ? "#FFFFFF" : CHECKPOINT_INACTIVE_STAR;

  const labelWidth = label.length > 5 ? 54 : 46;
  const labelHeight = 16;
  const labelY = badgeRadius + LABEL_GAP;

  return (
    <g transform={`translate(${x + groupOffsetX}, ${y + groupOffsetY})`}>
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

export default function JourneyMap({ progress, theme }: JourneyMapProps) {
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

  const isChestOpen = state.animatedProgress >= CHEST_OPEN_PROGRESS - 0.01;

  const { markerPoint, totalLength } = state;

  return (
    <div className="journey-map">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="journey-map__svg"
        role="img"
        aria-label="Savings journey progress map"
      >
        <image
          href={theme.background}
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Invisible motion path — marker & checkpoints */}
        <path ref={pathRef} d={ROUTE_PATH} fill="none" stroke="none" />

        <RouteCoin
          x={REWARD_POSITIONS.coin.x}
          y={REWARD_POSITIONS.coin.y}
          icon={theme.coin}
          progress={state.animatedProgress}
        />

        <RouteTreasureChest
          x={REWARD_POSITIONS.chest.x}
          y={REWARD_POSITIONS.chest.y}
          isOpen={isChestOpen}
          chestClosed={theme.chestClosed}
          chestOpen={theme.chestOpen}
        />

        {positions.map((cp) => (
          <CheckpointNode
            key={cp.id}
            x={cp.x}
            y={cp.y}
            label={cp.label}
            isPassed={cp.isPassed}
            groupOffsetX={cp.groupOffsetX}
            groupOffsetY={cp.groupOffsetY}
          />
        ))}

        {totalLength > 0 && (
          <AvatarMarker x={markerPoint.x} y={markerPoint.y} />
        )}
      </svg>
    </div>
  );
}
