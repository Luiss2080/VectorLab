import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';

export type ShapeType = 'rect' | 'circle' | 'text' | 'triangle' | 'line';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number; // For lines
  y2?: number; // For lines
  fill: string;
  stroke?: string; // For lines
  strokeWidth?: number; // For lines
  text?: string;
  fontSize?: number;
  zIndex: number;
}

interface CanvasState {
  shapes: Shape[];
  selectedId: string | null;
  addShape: (shape: Omit<Shape, 'id' | 'zIndex'>) => void;
  updateShape: (id: string, properties: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  clearCanvas: () => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  duplicateShape: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  temporal(
    persist(
      (set) => ({
        shapes: [],
        selectedId: null,
        addShape: (shape) => set((state) => {
          const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
          return {
            shapes: [...state.shapes, { ...shape, id: Date.now().toString(), zIndex: maxZ + 1 }]
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
      }),
      {
        name: 'canvas-storage',
      }
    ),
    {
      partialize: (state) => ({ shapes: state.shapes }),
    }
  )
);
