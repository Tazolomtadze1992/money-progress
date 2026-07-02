/** Shared progress animation timing — keep in sync with marker movement */
export const PROGRESS_ANIMATION_MS = 650;

/** Quadratic ease-in-out (matches usePathProgress marker easing) */
export function easeInOutProgress(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
