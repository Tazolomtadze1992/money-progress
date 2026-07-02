import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  format,
  durationMs,
  className,
}: AnimatedNumberProps) {
  const display = useAnimatedNumber(value, { durationMs });

  return <span className={className}>{format(display)}</span>;
}
