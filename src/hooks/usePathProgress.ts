import { useCallback, useEffect, useRef, useState } from "react";
import {
  clampProgress,
  getActiveLength,
  getPointAtProgress,
  type PathPoint,
} from "../utils/pathProgress";

const EASE_IN_OUT = "cubic-bezier(0.645, 0.045, 0.355, 1)";

interface UsePathProgressOptions {
  progress: number;
  durationMs?: number;
}

interface PathProgressState {
  animatedProgress: number;
  markerPoint: PathPoint;
  activeLength: number;
  totalLength: number;
  dashOffset: number;
}

export function usePathProgress({
  progress,
  durationMs = 600,
}: UsePathProgressOptions): {
  pathRef: React.RefObject<SVGPathElement | null>;
  state: PathProgressState;
} {
  const pathRef = useRef<SVGPathElement>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [geometry, setGeometry] = useState({
    markerPoint: { x: 0, y: 0 },
    activeLength: 0,
    totalLength: 0,
    dashOffset: 0,
  });

  const updateGeometry = useCallback((value: number) => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    const activeLength = getActiveLength(path, value);

    setGeometry({
      markerPoint: getPointAtProgress(path, value),
      activeLength,
      totalLength,
      dashOffset: totalLength - activeLength,
    });
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    updateGeometry(animatedProgress);
  }, [animatedProgress, updateGeometry]);

  useEffect(() => {
    const target = clampProgress(progress);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setAnimatedProgress(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const from = animatedProgress;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased =
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const next = from + (target - from) * eased;
      setAnimatedProgress(next);

      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from current animated value
  }, [progress, durationMs]);

  return {
    pathRef,
    state: {
      animatedProgress,
      ...geometry,
    },
  };
}

export { EASE_IN_OUT };
