import { useCallback, useEffect, useRef, useState } from "react";
import {
  clampProgress,
  getActiveLength,
  getPointAtProgress,
  type PathPoint,
} from "../utils/pathProgress";
import {
  easeInOutProgress,
  prefersReducedMotion,
  PROGRESS_ANIMATION_MS,
} from "../utils/motion";

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
  durationMs = PROGRESS_ANIMATION_MS,
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

    if (prefersReducedMotion()) {
      setAnimatedProgress(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const from = animatedProgress;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutProgress(t);
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

export { PROGRESS_ANIMATION_MS as PATH_PROGRESS_DURATION_MS };
