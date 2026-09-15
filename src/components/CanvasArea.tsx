import { useState, useRef, useEffect } from 'react';
import type React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Componente principal que renderiza el SVG y gestiona todas las interacciones físicas:
 * - Selección y arrastre de figuras.
 * - Paneo y Zoom (Lienzo infinito).
 * - Dibujo a mano alzada (Herramienta Lápiz).
 * - Menú Contextual (Click Derecho).
 */
export const CanvasArea = () => {
  const { shapes, selectedId, setSelectedId, updateShape, addShape, duplicateShape, deleteShape, bringToFront, sendToBack, currentTool, setTool } = useCanvasStore();
  
  // Estado de Arrastre de Figuras
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Estado de Paneo y Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Estado de Dibujo Libre
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  
  // Estado del Menú Contextual
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; shapeId: string | null } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Activa el modo paneo al mantener la barra espaciadora
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isPanning) document.body.style.cursor = 'grab';
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') document.body.style.cursor = 'default';
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning]);

  // Previene que aparezca el menú contextual del navegador
  useEffect(() => {
    const handleContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, []);

  /**
   * Convierte coordenadas de la pantalla a coordenadas del SVG interno tomando en cuenta Pan y Zoom.
   */
  const getCoords = (e: React.PointerEvent | React.WheelEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  /** Maneja el Zoom In/Out con la rueda del ratón */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(0.1, zoom * zoomFactor), 5);
    
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setPan({
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom)
    });
    setZoom(newZoom);
    setContextMenu(null);
  };

  /** Maneja el inicio de interacción (Click) sobre el fondo del lienzo */
  const handlePointerDown = (e: React.PointerEvent) => {
    setContextMenu(null);
    
    // Si presiona Alt, Shift o click medio -> Iniciar paneo
    if (e.button === 1 || e.altKey || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      document.body.style.cursor = 'grabbing';
      return;
    }
    
    // Si la herramienta es el Lápiz, iniciamos un nuevo trazo
    if (currentTool === 'pen') {
      const coords = getCoords(e);
      const newId = Date.now().toString();
      addShape({
        type: 'path',
        x: coords.x,
        y: coords.y,
        pathData: `M ${coords.x} ${coords.y}`,
        fill: 'transparent',
        stroke: '#3b82f6', // Color por defecto
        strokeWidth: 4
      });
      // Sobrescribimos el ID manual ya que addShape genera uno nuevo asíncronamente
      // En vez de eso, buscaremos la última figura añadida en pointerMove, 
      // pero para simplificar, usaremos un truco:
      setTimeout(() => {
        const state = useCanvasStore.getState();
        const lastShape = state.shapes[state.shapes.length - 1];
        if(lastShape && lastShape.type === 'path') {
          setCurrentPathId(lastShape.id);
          setIsDrawing(true);
          setSelectedId(lastShape.id);
        }
      }, 0);
      return;
    }
    
    // Click en el fondo deselecciona
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect' && (e.target as Element).getAttribute('fill') === 'url(#grid)') {
      setSelectedId(null);
    }
  };

  /** Maneja el clic sobre una figura existente */
  const handleShapePointerDown = (e: React.PointerEvent, id: string) => {
    if (isPanning || e.button === 1 || currentTool === 'pen') return;
    e.stopPropagation();
    
    if (e.button === 2) {
      setSelectedId(id);
      setContextMenu({ x: e.clientX, y: e.clientY, shapeId: id });
      return;
    }

    setContextMenu(null);
    setSelectedId(id);
    setDraggingId(id);
    const coords = getCoords(e);
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      setOffset({ x: coords.x - shape.x, y: coords.y - shape.y });
    }
  };

  /** Maneja el movimiento del cursor (Arrastre, Paneo, o Dibujo) */
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
      return;
    }

    if (isDrawing && currentPathId) {
      const coords = getCoords(e);
      const shape = shapes.find(s => s.id === currentPathId);
      if (shape && shape.pathData) {
        updateShape(currentPathId, {
          pathData: `${shape.pathData} L ${coords.x} ${coords.y}`
        });
      }
      return;
    }

    if (draggingId && currentTool === 'select') {
      const coords = getCoords(e);
      let newX = coords.x - offset.x;
      let newY = coords.y - offset.y;
      
      const { snapToGrid } = useCanvasStore.getState();
      if (snapToGrid) {
        newX = Math.round(newX / 40) * 40;
        newY = Math.round(newY / 40) * 40;
      }
      
      updateShape(draggingId, {
        x: newX,
        y: newY
      });
    }
  };

  /** Maneja el fin de la interacción */
  const handlePointerUp = () => {
    setDraggingId(null);
    setIsPanning(false);
    
    if (isDrawing) {
      setIsDrawing(false);
      setCurrentPathId(null);
      setTool('select'); // Volver a modo selección automáticamente
    }
    
    document.body.style.cursor = 'default';
  };

  const sortedShapes = [...shapes].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="flex-1 bg-[#02040a] overflow-hidden relative" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onWheel={handleWheel}
        style={{ cursor: currentTool === 'pen' ? 'crosshair' : 'default' }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" pointerEvents="all" />
        
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {sortedShapes.map((shape) => {
            const isSelected = shape.id === selectedId;
            const strokeProps = isSelected ? { stroke: '#3b82f6', strokeWidth: 2 / zoom, strokeDasharray: `${4/zoom}` } : {};
            const opacity = shape.opacity ?? 1;

            if (shape.type === 'rect') {
              return <rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.fill} opacity={opacity} onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer" {...strokeProps} />;
            }
            if (shape.type === 'circle') {
              return <circle key={shape.id} cx={shape.x} cy={shape.y} r={shape.radius} fill={shape.fill} opacity={opacity} onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer" {...strokeProps} />;
            }
            if (shape.type === 'text') {
              return <text key={shape.id} x={shape.x} y={shape.y} fill={shape.fill} opacity={opacity} fontSize={shape.fontSize} fontFamily="Inter, sans-serif" onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer select-none" style={{ dominantBaseline: 'hanging' }}>{shape.text}</text>;
            }
            if (shape.type === 'triangle') {
              const w = shape.width || 100;
              const h = shape.height || 100;
              const points = `${shape.x + w/2},${shape.y} ${shape.x + w},${shape.y + h} ${shape.x},${shape.y + h}`;
              return <polygon key={shape.id} points={points} fill={shape.fill} opacity={opacity} onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer" {...strokeProps} />;
            }
            if (shape.type === 'line') {
              const x2 = shape.x2 ?? (shape.x + 100);
              const y2 = shape.y2 ?? (shape.y + 100);
              return <line key={shape.id} x1={shape.x} y1={shape.y} x2={x2} y2={y2} opacity={opacity} stroke={shape.stroke || shape.fill} strokeWidth={shape.strokeWidth || 4} onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer" {...(isSelected ? { strokeDasharray: `${4/zoom}`, stroke: '#3b82f6' } : {})} />;
            }
            if (shape.type === 'path') {
              return <path key={shape.id} d={shape.pathData} fill="none" opacity={opacity} stroke={shape.stroke || shape.fill} strokeWidth={shape.strokeWidth || 4} strokeLinecap="round" strokeLinejoin="round" onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer" {...(isSelected ? { strokeDasharray: `${4/zoom}`, stroke: '#3b82f6' } : {})} />;
            }
            if (shape.type === 'image') {
              return (
                <g key={shape.id} onPointerDown={(e) => handleShapePointerDown(e, shape.id)} className="cursor-pointer">
                  <image href={shape.imageUrl} x={shape.x} y={shape.y} width={shape.width} height={shape.height} opacity={opacity} preserveAspectRatio="none" />
                  {isSelected && <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill="none" stroke="#3b82f6" strokeWidth={2/zoom} strokeDasharray={`${4/zoom}`} />}
                </g>
              );
            }
            return null;
          })}
        </g>
      </svg>

      {/* Menú Contextual */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed bg-[#161e2e]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 min-w-[160px] z-50"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button onClick={() => { if(contextMenu.shapeId) duplicateShape(contextMenu.shapeId); setContextMenu(null); toast.success('Duplicado'); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"><Copy size={14} /> Duplicar</button>
            <button onClick={() => { if(contextMenu.shapeId) bringToFront(contextMenu.shapeId); setContextMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"><ArrowUpToLine size={14} /> Traer al Frente</button>
            <button onClick={() => { if(contextMenu.shapeId) sendToBack(contextMenu.shapeId); setContextMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full text-left"><ArrowDownToLine size={14} /> Enviar al Fondo</button>
            <div className="h-px bg-white/10 my-1 mx-2" />
            <button onClick={() => { if(contextMenu.shapeId) deleteShape(contextMenu.shapeId); setContextMenu(null); toast.success('Eliminado'); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/80 rounded-lg transition-colors w-full text-left"><Trash2 size={14} /> Eliminar</button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicador de Zoom */}
      <div className="absolute bottom-4 left-4 bg-[#161e2e]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 font-mono shadow-lg pointer-events-none">
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
};
