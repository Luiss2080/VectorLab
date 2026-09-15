import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Toolbar } from './Toolbar';
import { useCanvasStore } from '../store/useCanvasStore';

describe('Toolbar Component', () => {
  beforeEach(() => {
    useCanvasStore.getState().clearCanvas();
  });

  it('debería renderizar todos los botones de herramientas', () => {
    render(<Toolbar />);
    // Verificar que los botones (al menos por su title) estén presentes
    expect(screen.getByTitle('Seleccionar')).toBeDefined();
    expect(screen.getByTitle('Rectángulo')).toBeDefined();
    expect(screen.getByTitle('Círculo')).toBeDefined();
    expect(screen.getByTitle('Dibujo Libre (Lápiz)')).toBeDefined();
  });

  it('debería agregar un rectángulo al hacer click en el botón correspondiente', () => {
    render(<Toolbar />);
    const btnRect = screen.getByTitle('Rectángulo');
    
    // Simular click
    fireEvent.click(btnRect);
    
    // Verificar en el store
    const shapes = useCanvasStore.getState().shapes;
    expect(shapes).toHaveLength(1);
    expect(shapes[0].type).toBe('rect');
  });

  it('debería cambiar la herramienta actual a Lápiz', () => {
    render(<Toolbar />);
    const btnPen = screen.getByTitle('Dibujo Libre (Lápiz)');
    
    fireEvent.click(btnPen);
    
    expect(useCanvasStore.getState().currentTool).toBe('pen');
  });
});
