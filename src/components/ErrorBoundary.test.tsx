import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const Bomb = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza normalmente cuando no hay errores', () => {
    render(
      <ErrorBoundary>
        <div>contenido normal</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('contenido normal')).toBeDefined();
  });

  it('atrapa un error de render y muestra la pantalla de recuperación', () => {
    // React logs the error to console.error; silence it for this test.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeDefined();
    expect(screen.getByText('boom')).toBeDefined();
  });

  it('permite reintentar tras un error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldThrow = true;
    const Toggle = () => {
      if (shouldThrow) throw new Error('boom');
      return <div>recuperado</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <Toggle />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeDefined();

    shouldThrow = false;
    fireEvent.click(screen.getByText('Reintentar'));
    rerender(
      <ErrorBoundary>
        <Toggle />
      </ErrorBoundary>
    );

    expect(screen.getByText('recuperado')).toBeDefined();
  });
});
