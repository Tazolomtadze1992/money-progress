import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

export type CoinPickupPhase = "visible" | "animating" | "hidden";

function isPastThreshold(progress: number, threshold: number): boolean {
  return progress >= threshold - 0.01;
}

export function useCoinPickup(
  progress: number,
  threshold: number,
): {
  phase: CoinPickupPhase;
  onPickupAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => void;
} {
  const [phase, setPhase] = useState<CoinPickupPhase>(() =>
    isPastThreshold(progress, threshold) ? "hidden" : "visible",
  );
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    const prev = prevProgressRef.current;
    prevProgressRef.current = progress;

    const wasPast = isPastThreshold(prev, threshold);
    const isPast = isPastThreshold(progress, threshold);

    if (!isPast && wasPast) {
      setPhase("visible");
      return;
    }

    if (isPast && !wasPast) {
      if (prefersReducedMotion()) {
        setPhase("hidden");
      } else {
        setPhase("animating");
      }
    }
  }, [progress, threshold]);

  const onPickupAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLElement>) => {
      if (event.animationName !== "coin-pickup") return;
      setPhase("hidden");
    },
    [],
  );

  return { phase, onPickupAnimationEnd };
}
