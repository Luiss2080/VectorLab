import { useState, useRef } from 'react';
import type React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const CanvasArea = () => {
  const { shapes, selectedId, setSelectedId, updateShape } = useCanvasStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getCoords = (e: React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id);
    const coords = getCoords(e);
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      setOffset({ x: coords.x - shape.x, y: coords.y - shape.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId) {
      const coords = getCoords(e);
      updateShape(draggingId, {
        x: coords.x - offset.x,
        y: coords.y - offset.y
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Sort by zIndex before rendering
  const sortedShapes = [...shapes].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="flex-1 bg-[#05080f] overflow-hidden relative" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        onPointerDown={() => setSelectedId(null)}
        onPointerMove={handlePointerMove}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" pointerEvents="none" />
        
        {sortedShapes.map((shape) => {
          const isSelected = shape.id === selectedId;
          const strokeProps = isSelected ? { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4' } : {};

          if (shape.type === 'rect') {
            return (
              <rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                onPointerDown={(e) => handlePointerDown(e, shape.id)}
                className="cursor-pointer transition-colors"
                {...strokeProps}
              />
            );
          }
          if (shape.type === 'circle') {
            return (
              <circle
                key={shape.id}
                cx={shape.x}
                cy={shape.y}
                r={shape.radius}
                fill={shape.fill}
                onPointerDown={(e) => handlePointerDown(e, shape.id)}
                className="cursor-pointer transition-colors"
                {...strokeProps}
              />
            );
          }
          if (shape.type === 'text') {
            return (
              <text
                key={shape.id}
                x={shape.x}
                y={shape.y}
                fill={shape.fill}
                fontSize={shape.fontSize}
                fontFamily="Inter, sans-serif"
                onPointerDown={(e) => handlePointerDown(e, shape.id)}
                className="cursor-pointer select-none"
                style={{ dominantBaseline: 'hanging' }}
              >
                {shape.text}
              </text>
            );
          }
          if (shape.type === 'triangle') {
            const w = shape.width || 100;
            const h = shape.height || 100;
            const points = `${shape.x + w/2},${shape.y} ${shape.x + w},${shape.y + h} ${shape.x},${shape.y + h}`;
            return (
              <polygon
                key={shape.id}
                points={points}
                fill={shape.fill}
                onPointerDown={(e) => handlePointerDown(e, shape.id)}
                className="cursor-pointer transition-colors"
                {...strokeProps}
              />
            );
          }
          if (shape.type === 'line') {
            const x2 = shape.x2 ?? (shape.x + 100);
            const y2 = shape.y2 ?? (shape.y + 100);
            return (
              <line
                key={shape.id}
                x1={shape.x}
                y1={shape.y}
                x2={x2}
                y2={y2}
                stroke={shape.stroke || shape.fill}
                strokeWidth={shape.strokeWidth || 4}
                onPointerDown={(e) => handlePointerDown(e, shape.id)}
                className="cursor-pointer"
                {...(isSelected ? { strokeDasharray: '4', stroke: '#3b82f6' } : {})}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};
