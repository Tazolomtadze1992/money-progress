import { CHEST_HEIGHT, CHEST_WIDTH } from "../utils/pathProgress";

interface RouteTreasureChestProps {
  x: number;
  y: number;
  isOpen: boolean;
  chestClosed: string;
  chestOpen: string;
}

export default function RouteTreasureChest({
  x,
  y,
  isOpen,
  chestClosed,
  chestOpen,
}: RouteTreasureChestProps) {
  const halfW = CHEST_WIDTH / 2;
  const halfH = CHEST_HEIGHT / 2;

  return (
    <g
      className={`journey-map__chest${isOpen ? " journey-map__chest--open" : ""}`}
      transform={`translate(${x}, ${y})`}
      aria-hidden="true"
    >
      <image
        href={isOpen ? chestOpen : chestClosed}
        width={CHEST_WIDTH}
        height={CHEST_HEIGHT}
        x={-halfW}
        y={-halfH}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}
