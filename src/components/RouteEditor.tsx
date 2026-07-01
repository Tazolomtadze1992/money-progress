import { useCallback, useMemo, useRef, useState } from "react";
import { MAP_HEIGHT, MAP_IMAGE, MAP_WIDTH } from "../utils/pathProgress";
import { ROUTE_ACTIVE } from "../styles/colors";
import {
  DEFAULT_BEZIER_ROUTE,
  bezierRouteToPathD,
  cloneBezierRoute,
  describeBezierRoute,
  formatPathForExport,
  getAnchorCount,
  getAnchorPoint,
  moveAnchor,
  moveControlPoint,
  type BezierRoute,
  type DragTarget,
} from "../utils/routePathEditor";

const PREVIEW_PROGRESS = 0.5;

function dragTargetKey(target: DragTarget | null): string | null {
  if (!target) return null;
  if (target.kind === "anchor") return `anchor-${target.index}`;
  return `${target.kind}-${target.segmentIndex}`;
}

export default function RouteEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [route, setRoute] = useState<BezierRoute>(() =>
    cloneBezierRoute(DEFAULT_BEZIER_ROUTE),
  );
  const [selected, setSelected] = useState<DragTarget | null>(null);
  const [dragging, setDragging] = useState<DragTarget | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showCoords, setShowCoords] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const pathD = useMemo(() => bezierRouteToPathD(route), [route]);
  const exportText = useMemo(() => formatPathForExport(pathD), [pathD]);
  const coordLines = useMemo(() => describeBezierRoute(route), [route]);

  const overlayMetrics = useMemo(() => {
    if (!pathD) return { totalLength: 0, dashOffset: 0 };
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    const totalLength = path.getTotalLength();
    const activeLength = totalLength * PREVIEW_PROGRESS;
    return { totalLength, dashOffset: totalLength - activeLength };
  }, [pathD]);

  const clientToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;

    const svgPoint = point.matrixTransform(matrix.inverse());
    return {
      x: svgPoint.x,
      y: svgPoint.y,
    };
  }, []);

  const handlePointerDown = useCallback(
    (target: DragTarget, event: React.PointerEvent<SVGElement>) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      setSelected(target);
      setDragging(target);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;

      const point = clientToSvg(event.clientX, event.clientY);
      if (!point) return;

      setRoute((current) => {
        if (dragging.kind === "anchor") {
          return moveAnchor(current, dragging.index, point);
        }
        return moveControlPoint(current, dragging, point);
      });
    },
    [clientToSvg, dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleReset = useCallback(() => {
    setRoute(cloneBezierRoute(DEFAULT_BEZIER_ROUTE));
    setSelected(null);
    setDragging(null);
    setCopyStatus(null);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyStatus("Copied!");
      window.setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus("Copy failed — select text manually");
    }
  }, [exportText]);

  const anchorCount = getAnchorCount(route);
  const selectedKey = dragTargetKey(selected);
  const draggingKey = dragTargetKey(dragging);

  return (
    <div className="route-editor">
      <div className="route-editor__preview">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="route-editor__svg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <image
            href={MAP_IMAGE}
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
          />

          <path
            d={pathD}
            fill="none"
            stroke="#e91e8c"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.85"
            pointerEvents="none"
          />

          {showOverlay && overlayMetrics.totalLength > 0 && (
            <path
              d={pathD}
              fill="none"
              stroke={ROUTE_ACTIVE}
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={overlayMetrics.totalLength}
              strokeDashoffset={overlayMetrics.dashOffset}
              opacity="0.45"
              pointerEvents="none"
            />
          )}

          <path
            d={pathD}
            fill="none"
            stroke="#1e6e91"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            pointerEvents="none"
          />

          {/* Handle helper lines */}
          {route.segments.length > 0 && (
            <line
              x1={route.start.x}
              y1={route.start.y}
              x2={route.segments[0].cp1.x}
              y2={route.segments[0].cp1.y}
              stroke="#9b59b6"
              strokeWidth="1"
              opacity="0.55"
              pointerEvents="none"
            />
          )}

          {route.segments.map((segment, index) => (
            <g key={`helpers-${segment.id}`}>
              <line
                x1={segment.end.x}
                y1={segment.end.y}
                x2={segment.cp2.x}
                y2={segment.cp2.y}
                stroke="#9b59b6"
                strokeWidth="1"
                opacity="0.55"
                pointerEvents="none"
              />
              {route.segments[index + 1] && (
                <line
                  x1={segment.end.x}
                  y1={segment.end.y}
                  x2={route.segments[index + 1].cp1.x}
                  y2={route.segments[index + 1].cp1.y}
                  stroke="#9b59b6"
                  strokeWidth="1"
                  opacity="0.55"
                  pointerEvents="none"
                />
              )}
            </g>
          ))}

          {/* Control handles */}
          {route.segments.map((segment, segmentIndex) => {
            const cp1Key = `cp1-${segmentIndex}`;
            const cp2Key = `cp2-${segmentIndex}`;

            return (
              <g key={`handles-${segment.id}`}>
                <ControlHandle
                  x={segment.cp1.x}
                  y={segment.cp1.y}
                  isSelected={selectedKey === cp1Key}
                  isDragging={draggingKey === cp1Key}
                  color="#e67e22"
                  onPointerDown={(event) =>
                    handlePointerDown({ kind: "cp1", segmentIndex }, event)
                  }
                />
                <ControlHandle
                  x={segment.cp2.x}
                  y={segment.cp2.y}
                  isSelected={selectedKey === cp2Key}
                  isDragging={draggingKey === cp2Key}
                  color="#9b59b6"
                  onPointerDown={(event) =>
                    handlePointerDown({ kind: "cp2", segmentIndex }, event)
                  }
                />
              </g>
            );
          })}

          {/* Anchor points */}
          {Array.from({ length: anchorCount }, (_, anchorIndex) => {
            const anchor = getAnchorPoint(route, anchorIndex);
            const anchorKey = `anchor-${anchorIndex}`;
            const isSelected = selectedKey === anchorKey;
            const isDragging = draggingKey === anchorKey;

            return (
              <g key={anchorKey}>
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r={isDragging ? 8 : 7}
                  fill={isSelected ? "#1e6e91" : "#ffffff"}
                  stroke={isSelected ? "#ffffff" : "#1e6e91"}
                  strokeWidth="2"
                  style={{ cursor: "grab", touchAction: "none" }}
                  onPointerDown={(event) =>
                    handlePointerDown({ kind: "anchor", index: anchorIndex }, event)
                  }
                />
                {showCoords && (
                  <text
                    x={anchor.x + 10}
                    y={anchor.y - 10}
                    fontSize="9"
                    fill="#1e2e38"
                    fontFamily="Inter, sans-serif"
                    pointerEvents="none"
                  >
                    A{anchorIndex}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="route-editor__panel">
        <h2 className="route-editor__title">Route Editor</h2>
        <p className="route-editor__hint">
          Drag white anchors to move route points. Drag orange/purple handles to
          bend each cubic segment. Copy the result into{" "}
          <code>ROUTE_PATH</code> when aligned.
        </p>

        <label className="route-editor__toggle">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(event) => setShowOverlay(event.target.checked)}
          />
          Show active overlay preview (50%)
        </label>

        <label className="route-editor__toggle">
          <input
            type="checkbox"
            checked={showCoords}
            onChange={(event) => setShowCoords(event.target.checked)}
          />
          Show anchor labels on map
        </label>

        <div className="route-editor__legend">
          <span className="route-editor__legend-item">
            <i className="route-editor__swatch route-editor__swatch--anchor" />
            Anchor
          </span>
          <span className="route-editor__legend-item">
            <i className="route-editor__swatch route-editor__swatch--cp1" />
            cp1 (out)
          </span>
          <span className="route-editor__legend-item">
            <i className="route-editor__swatch route-editor__swatch--cp2" />
            cp2 (in)
          </span>
        </div>

        <div className="route-editor__actions">
          <button type="button" className="route-editor__btn" onClick={handleCopy}>
            Copy path
          </button>
          <button
            type="button"
            className="route-editor__btn route-editor__btn--secondary"
            onClick={handleReset}
          >
            Reset to current path
          </button>
        </div>

        {copyStatus && <p className="route-editor__status">{copyStatus}</p>}

        <label className="route-editor__label" htmlFor="route-path-output">
          Generated SVG path
        </label>
        <textarea
          id="route-path-output"
          className="route-editor__textarea"
          readOnly
          value={exportText}
          rows={10}
        />

        <h3 className="route-editor__subtitle">Point coordinates</h3>
        <ul className="route-editor__coords">
          {coordLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

interface ControlHandleProps {
  x: number;
  y: number;
  color: string;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (event: React.PointerEvent<SVGCircleElement>) => void;
}

function ControlHandle({
  x,
  y,
  color,
  isSelected,
  isDragging,
  onPointerDown,
}: ControlHandleProps) {
  return (
    <circle
      cx={x}
      cy={y}
      r={isDragging ? 6 : 5}
      fill={isSelected ? color : "#ffffff"}
      stroke={color}
      strokeWidth="2"
      opacity={isSelected ? 1 : 0.85}
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={onPointerDown}
    />
  );
}
