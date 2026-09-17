import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Límite de errores de React para toda la aplicación.
 *
 * Sin esto, cualquier excepción no controlada durante el render (por
 * ejemplo, datos corruptos migrados desde `localStorage`) desmonta todo
 * el árbol de React y deja al usuario con una pantalla en blanco, sin
 * ninguna forma de recuperarse salvo borrar el almacenamiento a mano.
 * Este componente atrapa esa excepción y ofrece una salida clara.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Error no controlado en la aplicación:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  private handleClearAndReload = () => {
    try {
      window.localStorage.removeItem('canvas-storage');
    } catch {
      // localStorage puede no estar disponible (modo privado, cuotas, etc.)
    }
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[#02040a] p-6 text-center text-white">
          <h1 className="text-xl font-black">Algo salió mal</h1>
          <p className="max-w-md text-sm text-slate-400">
            La aplicación encontró un error inesperado y no puede continuar.
            Puedes intentar reanudar, o reiniciar el lienzo si el problema
            persiste.
          </p>
          <pre className="max-w-lg overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-left text-xs text-red-400">
            {this.state.error.message}
          </pre>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              Reintentar
            </button>
            <button
              onClick={this.handleClearAndReload}
              className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
            >
              Reiniciar lienzo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
