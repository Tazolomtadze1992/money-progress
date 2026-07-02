import { useEffect, useRef, useState } from "react";
import {
  easeInOutProgress,
  prefersReducedMotion,
  PROGRESS_ANIMATION_MS,
} from "../utils/motion";

interface UseAnimatedNumberOptions {
  durationMs?: number;
  enabled?: boolean;
}

export function useAnimatedNumber(
  target: number,
  options: UseAnimatedNumberOptions = {},
): number {
  const { durationMs = PROGRESS_ANIMATION_MS, enabled = true } = options;
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(display);
  displayRef.current = display;

  useEffect(() => {
    if (!enabled) {
      setDisplay(target);
      return;
    }

    if (prefersReducedMotion()) {
      setDisplay(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const from = displayRef.current;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutProgress(t);
      const next = Math.round(from + (target - from) * eased);
      setDisplay(next);

      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs, enabled]);

  return display;
}
