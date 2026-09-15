import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';

/**
 * Tipos de figuras soportadas por el sistema.
 * @typedef {'rect' | 'circle' | 'text' | 'triangle' | 'line' | 'path' | 'image'} ShapeType
 */
export type ShapeType = 'rect' | 'circle' | 'text' | 'triangle' | 'line' | 'path' | 'image';

/**
 * Interfaz que define las propiedades fundamentales de cualquier figura en el lienzo.
 * Contiene tanto coordenadas espaciales como atributos visuales de SVG.
 */
export interface Shape {
  /** Identificador único generado por Date.now() */
  id: string;
  /** Tipo de geometría a renderizar */
  type: ShapeType;
  /** Posición en el eje X */
  x: number;
  /** Posición en el eje Y */
  y: number;
  /** Ancho (Aplica para rectángulos y triángulos) */
  width?: number;
  /** Alto (Aplica para rectángulos y triángulos) */
  height?: number;
  /** Radio (Aplica para círculos) */
  radius?: number;
  /** Coordenada final X (Aplica para líneas) */
  x2?: number; 
  /** Coordenada final Y (Aplica para líneas) */
  y2?: number; 
  /** Datos del trazado SVG (Aplica para paths/dibujo a mano alzada) */
  pathData?: string;
  /** Datos de la imagen en base64 (Aplica para type image) */
  imageUrl?: string;
  /** Color de relleno en formato hexadecimal, rgb, o palabra clave */
  fill: string;
  /** Color del contorno (stroke) */
  stroke?: string; 
  /** Grosor del contorno */
  strokeWidth?: number; 
  /** Contenido de texto (Si aplica) */
  text?: string;
  /** Tamaño de fuente (Si aplica) */
  fontSize?: number;
  /** Orden de profundidad (Capa) */
  zIndex: number;
  /** Transparencia (0.0 a 1.0) */
  opacity?: number; 
}

/**
 * Estado global del lienzo administrado por Zustand.
 */
interface CanvasState {
  /** Lista maestra de figuras dibujadas */
  shapes: Shape[];
  /** ID de la figura actualmente seleccionada por el usuario */
  selectedId: string | null;
  /** Herramienta actual (select o dibujo libre) */
  currentTool: 'select' | 'pen';
  /** Activa o desactiva la alineación magnética a la cuadrícula */
  snapToGrid: boolean;
  /** Añade una nueva figura al final de la pila (Frente) */
  addShape: (shape: Omit<Shape, 'id' | 'zIndex'>) => void;
  /** Actualiza parcialmente las propiedades de una figura existente */
  updateShape: (id: string, properties: Partial<Shape>) => void;
  /** Elimina una figura por su ID */
  deleteShape: (id: string) => void;
  /** Selecciona una figura activa para ver en el panel de propiedades */
  setSelectedId: (id: string | null) => void;
  /** Borra todo el lienzo */
  clearCanvas: () => void;
  /** Envía una figura al tope de la pila de renderizado */
  bringToFront: (id: string) => void;
  /** Envía una figura al fondo de la pila de renderizado */
  sendToBack: (id: string) => void;
  /** Clona una figura existente y la posiciona ligeramente desplazada */
  duplicateShape: (id: string) => void;
  /** Alterna el modo de ajuste a la cuadrícula */
  setSnapToGrid: (snap: boolean) => void;
  /** Cambia la herramienta activa */
  setTool: (tool: 'select' | 'pen') => void;
}

/**
 * Store de Zustand con middlewares:
 * - `temporal` de zundo: Habilita control-Z (Deshacer/Rehacer).
 * - `persist`: Guarda automáticamente en localStorage.
 */
export const useCanvasStore = create<CanvasState>()(
  temporal(
    persist(
      (set) => ({
        shapes: [],
        selectedId: null,
        currentTool: 'select',
        snapToGrid: false,
        addShape: (shape) => set((state) => {
          const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
          return {
            shapes: [...state.shapes, { ...shape, id: Date.now().toString(), zIndex: maxZ + 1, opacity: shape.opacity ?? 1 }]
          };
        }),
        updateShape: (id, properties) => set((state) => ({
          shapes: state.shapes.map(s => s.id === id ? { ...s, ...properties } : s)
        })),
        deleteShape: (id) => set((state) => ({
          shapes: state.shapes.filter(s => s.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId
        })),
        setSelectedId: (id) => set({ selectedId: id }),
        clearCanvas: () => set({ shapes: [], selectedId: null }),
        bringToFront: (id) => set((state) => {
          const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
          return {
            shapes: state.shapes.map(s => s.id === id ? { ...s, zIndex: maxZ + 1 } : s)
          };
        }),
        sendToBack: (id) => set((state) => {
          const minZ = state.shapes.reduce((min, s) => Math.min(min, s.zIndex), 0);
          return {
            shapes: state.shapes.map(s => s.id === id ? { ...s, zIndex: minZ - 1 } : s)
          };
        }),
        duplicateShape: (id) => set((state) => {
          const shape = state.shapes.find(s => s.id === id);
          if (!shape) return state;
          const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
          const newShape = { ...shape, id: Date.now().toString(), x: shape.x + 20, y: shape.y + 20, zIndex: maxZ + 1 };
          return { shapes: [...state.shapes, newShape], selectedId: newShape.id };
        }),
        setSnapToGrid: (snap) => set({ snapToGrid: snap }),
        setTool: (tool) => set({ currentTool: tool })
      }),
      {
        name: 'canvas-storage',
      }
    ),
    {
      partialize: (state) => ({ shapes: state.shapes, snapToGrid: state.snapToGrid }),
    }
  )
);
