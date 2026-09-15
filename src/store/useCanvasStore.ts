import { create } from 'zustand';

export type ShapeType = 'rect' | 'circle' | 'text';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill: string;
  text?: string;
  fontSize?: number;
}

interface CanvasState {
  shapes: Shape[];
  selectedId: string | null;
  addShape: (shape: Omit<Shape, 'id'>) => void;
  updateShape: (id: string, properties: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  shapes: [],
  selectedId: null,
  addShape: (shape) => set((state) => ({
    shapes: [...state.shapes, { ...shape, id: Date.now().toString() }]
  })),
  updateShape: (id, properties) => set((state) => ({
    shapes: state.shapes.map(s => s.id === id ? { ...s, ...properties } : s)
  })),
  deleteShape: (id) => set((state) => ({
    shapes: state.shapes.filter(s => s.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  setSelectedId: (id) => set({ selectedId: id }),
  clearCanvas: () => set({ shapes: [], selectedId: null })
}));
