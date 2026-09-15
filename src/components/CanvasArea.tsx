import React, { useState, useRef } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const CanvasArea: React.FC = () => {
  const { shapes, selectedId, setSelectedId, updateShape } = useCanvasStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getCoords = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id);
    const coords = getCoords(e);
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      setOffset({ x: coords.x - shape.x, y: coords.y - shape.y });
    }
  };

  const handlePointerMove = (e: React.MouseEvent) => {
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

  return (
    <div className="flex-1 bg-black overflow-hidden" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        onPointerDown={() => setSelectedId(null)}
        onPointerMove={handlePointerMove}
      >
        {shapes.map((shape) => {
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
                className="cursor-pointer"
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
                className="cursor-pointer"
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
          return null;
        })}
      </svg>
    </div>
  );
};
