import React from 'react';
import { Toolbar } from './components/Toolbar';
import { CanvasArea } from './components/CanvasArea';
import { PropertiesPanel } from './components/PropertiesPanel';
import { exportToJSON, exportToSVG } from './services/exportService';
import { useCanvasStore } from './store/useCanvasStore';
import { Download, Save } from 'lucide-react';

function App() {
  const { shapes, clearCanvas } = useCanvasStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white font-sans">
      <header className="h-14 border-b border-white/10 bg-[#080b14] flex items-center justify-between px-6 shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-black">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Sistema SVG</span>
            <span className="text-sm font-black leading-none">Gráficos Vectoriales</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportToJSON(shapes)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-white/10">
            <Save size={16} /> JSON
          </button>
          <button onClick={exportToSVG} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-white/10">
            <Download size={16} /> SVG
          </button>
          <button onClick={clearCanvas} className="text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded transition-colors ml-4">
            Limpiar
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <Toolbar />
        <CanvasArea />
        <PropertiesPanel />
      </main>
    </div>
  );
}

export default App;
