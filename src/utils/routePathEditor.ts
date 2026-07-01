import { ROUTE_PATH } from "./pathProgress";

export interface RoutePoint {
  x: number;
  y: number;
}

export interface CubicSegment {
  id: string;
  cp1: RoutePoint;
  cp2: RoutePoint;
  end: RoutePoint;
}

/** Full cubic Bézier route: M start + C segments */
export interface BezierRoute {
  start: RoutePoint;
  segments: CubicSegment[];
}

export type DragTarget =
  | { kind: "anchor"; index: number }
  | { kind: "cp1"; segmentIndex: number }
  | { kind: "cp2"; segmentIndex: number };

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function point(x: number, y: number): RoutePoint {
  return { x, y };
}

/** Parse SVG cubic path into editable Bézier data (preserves control points). */
export function parseBezierRoute(pathD: string): BezierRoute {
  const moveMatch = pathD.match(/M\s+([-\d.]+)\s+([-\d.]+)/i);
  if (!moveMatch) {
    return { start: point(0, 0), segments: [] };
  }

  const start = point(parseFloat(moveMatch[1]), parseFloat(moveMatch[2]));
  const segments: CubicSegment[] = [];

  const curveRegex =
    /C\s+([-\d.]+)\s+([-\d.]+),\s+([-\d.]+)\s+([-\d.]+),\s+([-\d.]+)\s+([-\d.]+)/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = curveRegex.exec(pathD)) !== null) {
    segments.push({
      id: `s-${index}`,
      cp1: point(parseFloat(match[1]), parseFloat(match[2])),
      cp2: point(parseFloat(match[3]), parseFloat(match[4])),
      end: point(parseFloat(match[5]), parseFloat(match[6])),
    });
    index += 1;
  }

  return { start, segments };
}

/** Build SVG `d` from explicit cubic segments (no auto-smoothing). */
export function bezierRouteToPathD(route: BezierRoute): string {
  if (route.segments.length === 0) {
    return `M ${round(route.start.x)} ${round(route.start.y)}`;
  }

  let d = `M ${round(route.start.x)} ${round(route.start.y)}`;

  for (const segment of route.segments) {
    d += ` C ${round(segment.cp1.x)} ${round(segment.cp1.y)}, ${round(segment.cp2.x)} ${round(segment.cp2.y)}, ${round(segment.end.x)} ${round(segment.end.y)}`;
  }

  return d;
}

export function cloneBezierRoute(route: BezierRoute): BezierRoute {
  return {
    start: { ...route.start },
    segments: route.segments.map((segment) => ({
      ...segment,
      cp1: { ...segment.cp1 },
      cp2: { ...segment.cp2 },
      end: { ...segment.end },
    })),
  };
}

/** Anchor index 0 = start; index n = segments[n-1].end */
export function getAnchorPoint(route: BezierRoute, anchorIndex: number): RoutePoint {
  if (anchorIndex === 0) return route.start;
  return route.segments[anchorIndex - 1].end;
}

export function getAnchorCount(route: BezierRoute): number {
  return route.segments.length + 1;
}

function clampPoint(position: RoutePoint): RoutePoint {
  return {
    x: Math.round(Math.min(342, Math.max(0, position.x)) * 10) / 10,
    y: Math.round(Math.min(322, Math.max(0, position.y)) * 10) / 10,
  };
}

/** Move anchor and shift attached handles by the same delta. */
export function moveAnchor(
  route: BezierRoute,
  anchorIndex: number,
  next: RoutePoint,
): BezierRoute {
  const current = getAnchorPoint(route, anchorIndex);
  const clamped = clampPoint(next);
  const dx = clamped.x - current.x;
  const dy = clamped.y - current.y;

  const updated = cloneBezierRoute(route);

  if (anchorIndex === 0) {
    updated.start = clamped;
    if (updated.segments[0]) {
      updated.segments[0].cp1 = clampPoint({
        x: updated.segments[0].cp1.x + dx,
        y: updated.segments[0].cp1.y + dy,
      });
    }
    return updated;
  }

  const segmentIndex = anchorIndex - 1;
  updated.segments[segmentIndex].end = clamped;
  updated.segments[segmentIndex].cp2 = clampPoint({
    x: updated.segments[segmentIndex].cp2.x + dx,
    y: updated.segments[segmentIndex].cp2.y + dy,
  });

  if (updated.segments[segmentIndex + 1]) {
    updated.segments[segmentIndex + 1].cp1 = clampPoint({
      x: updated.segments[segmentIndex + 1].cp1.x + dx,
      y: updated.segments[segmentIndex + 1].cp1.y + dy,
    });
  }

  return updated;
}

export function moveControlPoint(
  route: BezierRoute,
  target: Extract<DragTarget, { kind: "cp1" } | { kind: "cp2" }>,
  next: RoutePoint,
): BezierRoute {
  const updated = cloneBezierRoute(route);
  const clamped = clampPoint(next);
  const segment = updated.segments[target.segmentIndex];

  if (target.kind === "cp1") {
    segment.cp1 = clamped;
  } else {
    segment.cp2 = clamped;
  }

  return updated;
}

/** Format path for pasting into ROUTE_PATH in pathProgress.ts */
export function formatPathForExport(pathD: string): string {
  const parts = pathD.trim().split(/\s+(?=M|C)/i);
  if (parts.length <= 1) return `"${pathD.trim()}"`;

  return parts
    .map((part, index) => {
      const trimmed = part.trim();
      const suffix = index < parts.length - 1 ? " +" : "";
      return `"${trimmed} "${suffix}`;
    })
    .join("\n");
}

export function describeBezierRoute(route: BezierRoute): string[] {
  const lines = [`Start: (${route.start.x}, ${route.start.y})`];

  route.segments.forEach((segment, index) => {
    lines.push(
      `Seg ${index} cp1: (${segment.cp1.x}, ${segment.cp1.y})`,
      `Seg ${index} cp2: (${segment.cp2.x}, ${segment.cp2.y})`,
      `Seg ${index} end: (${segment.end.x}, ${segment.end.y})`,
    );
  });

  return lines;
}

export const DEFAULT_BEZIER_ROUTE = parseBezierRoute(ROUTE_PATH);
