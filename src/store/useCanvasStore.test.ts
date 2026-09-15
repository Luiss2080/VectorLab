import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from './useCanvasStore';

describe('useCanvasStore', () => {
  beforeEach(() => {
    useCanvasStore.getState().clearCanvas();
  });

  it('debería agregar una figura y establecerla como seleccionada', () => {
    const store = useCanvasStore.getState();
    store.addShape({
      type: 'rect',
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: '#000',
    });

    const shapes = useCanvasStore.getState().shapes;
    expect(shapes).toHaveLength(1);
    expect(shapes[0].type).toBe('rect');
    expect(shapes[0].zIndex).toBe(1);
    expect(shapes[0].opacity).toBe(1);
  });

  it('debería eliminar una figura', () => {
    const store = useCanvasStore.getState();
    store.addShape({ type: 'circle', x: 0, y: 0, radius: 50, fill: '#fff' });
    const id = useCanvasStore.getState().shapes[0].id;
    
    useCanvasStore.getState().deleteShape(id);
    expect(useCanvasStore.getState().shapes).toHaveLength(0);
  });

  it('debería duplicar una figura seleccionada', () => {
    const store = useCanvasStore.getState();
    store.addShape({ type: 'triangle', x: 50, y: 50, fill: '#f00' });
    const shapes = useCanvasStore.getState().shapes;
    const originalShape = shapes[0];

    store.duplicateShape(originalShape.id);
    const newShapes = useCanvasStore.getState().shapes;

    expect(newShapes).toHaveLength(2);
    expect(newShapes[1].type).toBe('triangle');
    expect(newShapes[1].x).toBe(70); // original x + 20
    expect(newShapes[1].y).toBe(70); // original y + 20
    expect(useCanvasStore.getState().selectedId).toBe(newShapes[1].id);
  });

  it('debería modificar el z-index correctamente (bringToFront / sendToBack)', () => {
    const store = useCanvasStore.getState();
    store.addShape({ type: 'rect', x: 0, y: 0, fill: '#1' });
    store.addShape({ type: 'rect', x: 0, y: 0, fill: '#2' });
    
    const shapes = useCanvasStore.getState().shapes;
    const id1 = shapes[0].id;
    const id2 = shapes[1].id;

    expect(shapes[0].zIndex).toBe(1);
    expect(shapes[1].zIndex).toBe(2);

    store.bringToFront(id1);
    expect(useCanvasStore.getState().shapes.find(s => s.id === id1)?.zIndex).toBe(3);

    store.sendToBack(id1);
    expect(useCanvasStore.getState().shapes.find(s => s.id === id1)?.zIndex).toBe(0);
  });

  it('debería cambiar el modo snapToGrid', () => {
    const store = useCanvasStore.getState();
    expect(store.snapToGrid).toBe(false);
    store.setSnapToGrid(true);
    expect(useCanvasStore.getState().snapToGrid).toBe(true);
  });
});
