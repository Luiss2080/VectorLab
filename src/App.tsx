import { useState, useEffect } from 'react';
declare global {
  interface Window {
    __clipboardId?: string;
  }
}
import { Toolbar } from './components/Toolbar';
import { CanvasArea } from './components/CanvasArea';
import { PropertiesPanel } from './components/PropertiesPanel';
import { exportToJSON, exportToSVG } from './services/exportService';
import { useStore } from 'zustand';
import { useCanvasStore } from './store/useCanvasStore';
import { Download, Save, Undo, Redo, HelpCircle, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { shapes, clearCanvas } = useCanvasStore();
  const { undo, redo } = useCanvasStore.temporal.getState();
  const pastStates = useStore(useCanvasStore.temporal, (state) => state.pastStates);
  const futureStates = useStore(useCanvasStore.temporal, (state) => state.futureStates);

  const [showHelp, setShowHelp] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleExportJSON = () => {
    exportToJSON(shapes);
    toast.success('Proyecto exportado como JSON');
    setShowExport(false);
  };

  const handleExportSVG = () => {
    exportToSVG();
    toast.success('Lienzo exportado como SVG');
    setShowExport(false);
  };

  const handleExportPNG = () => {
    const svgElement = document.querySelector('.canvas-container svg');
    if (!svgElement) return;

    // Convert SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const { width, height } = svgElement.getBoundingClientRect();
      canvas.width = width * 2; // High DPI
      canvas.height = height * 2;
      ctx.scale(2, 2);
      
      // Optional: draw background (if you want non-transparent)
      // ctx.fillStyle = '#02040a';
      // ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `figuras-vectoriales-${Date.now()}.png`;
      a.click();
      toast.success('Lienzo exportado como PNG');
      setShowExport(false);
    };
    img.src = url;
  };

  const handleClear = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todo el lienzo?')) {
      clearCanvas();
      toast.success('Lienzo limpiado');
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (futureStates.length > 0) { redo(); toast('Rehacer'); }
        } else {
          e.preventDefault();
          if (pastStates.length > 0) { undo(); toast('Deshacer'); }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (futureStates.length > 0) { redo(); toast('Rehacer'); }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const { selectedId, deleteShape } = useCanvasStore.getState();
        if (selectedId) {
          deleteShape(selectedId);
          toast.success('Eliminado');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const { selectedId } = useCanvasStore.getState();
        if (selectedId) {
          // Store ID in window or a ref. For simplicity, just immediately duplicate on Paste
          window.__clipboardId = selectedId;
          toast('Copiado');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const { duplicateShape } = useCanvasStore.getState();
        if (window.__clipboardId) {
          duplicateShape(window.__clipboardId);
          toast.success('Pegado');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, pastStates.length, futureStates.length]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#02040a] text-white font-sans relative">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#161e2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      <header className="absolute top-4 left-1/2 -translate-x-1/2 h-14 border border-white/10 bg-[#080b14]/70 backdrop-blur-xl flex items-center justify-between px-4 rounded-2xl shadow-2xl shadow-black/50 z-20 min-w-[600px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-blue-500/20 text-white">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Sistema SVG</span>
            <span className="text-sm font-black leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Pro Editor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => { undo(); toast('Deshacer'); }} 
            disabled={pastStates.length === 0}
            className="flex items-center justify-center p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Deshacer"
          >
            <Undo size={16} />
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button 
            onClick={() => { redo(); toast('Rehacer'); }} 
            disabled={futureStates.length === 0}
            className="flex items-center justify-center p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Rehacer"
          >
            <Redo size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(true)} className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <HelpCircle size={18} />
          </button>
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            Exportar
          </button>
          <button onClick={handleClear} className="text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors ml-1">
            Limpiar
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden absolute inset-0">
        <Toolbar />
        <CanvasArea />
        <PropertiesPanel />
      </main>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161e2e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold">Exportar Lienzo</h3>
                <button onClick={() => setShowExport(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <p className="text-sm text-slate-400 mb-2">Selecciona el formato en el que deseas descargar tu proyecto actual. El formato JSON permite guardar el estado para cargarlo después.</p>
                
                <button onClick={handleExportSVG} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><Download size={24} /></div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">Gráfico Vectorial (SVG)</span>
                      <span className="text-xs text-slate-400">Ideal para web y diseño escalable</span>
                    </div>
                  </div>
                </button>
                
                <button onClick={handleExportJSON} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Save size={24} /></div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">Datos del Proyecto (JSON)</span>
                      <span className="text-xs text-slate-400">Para continuar editando en el futuro</span>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161e2e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-transparent">
                <h3 className="text-lg font-bold flex items-center gap-2"><HelpCircle size={20} className="text-blue-400" /> Manual Rápido</h3>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-6 text-sm text-slate-300 space-y-4">
                <p>Bienvenido al <strong>Sistema SVG Premium</strong>. Esta herramienta te permite crear composiciones vectoriales fácilmente.</p>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white"> Herramientas Básicas:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Utiliza el panel izquierdo para añadir formas (Rectángulos, Círculos, Triángulos, Líneas, Textos).</li>
                    <li>Selecciona una forma haciendo clic sobre ella en el lienzo para activarla.</li>
                    <li>Arrastra las formas libremente para organizar tu composición.</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white"> Propiedades (Panel Derecho):</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Edita las coordenadas (X, Y) y dimensiones con precisión milimétrica.</li>
                    <li>Usa los botones de Z-Index ("Al Frente" / "Al Fondo") para manejar capas.</li>
                    <li>Todo se guarda automáticamente en tu navegador. Si recargas, no perderás tu trabajo.</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 mt-4">
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="bg-white/10 px-2 py-1 rounded text-white font-mono">Tip</span> 
                    Usa los paneles colapsables (botones en las esquinas) para tener una vista 100% limpia del lienzo.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
