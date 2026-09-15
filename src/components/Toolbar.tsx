import { useCanvasStore } from '../store/useCanvasStore';
import { Square, Circle, Type, MousePointer2, Triangle, Minus, PanelLeftClose, PanelLeftOpen, Pen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * Componente Toolbar (Barra de Herramientas Flotante)
 * Permite al usuario seleccionar herramientas y crear figuras básicas.
 */
export const Toolbar = () => {
  const { addShape, setSelectedId, setTool, currentTool, snapToGrid, setSnapToGrid } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(true);

  const handleAddRect = () => { addShape({ type: 'rect', x: 100, y: 100, width: 100, height: 100, fill: '#3b82f6' }); setTool('select'); };
  const handleAddCircle = () => { addShape({ type: 'circle', x: 200, y: 200, radius: 50, fill: '#f59e0b' }); setTool('select'); };
  const handleAddText = () => { addShape({ type: 'text', x: 300, y: 300, text: 'Nuevo Texto', fill: '#ffffff', fontSize: 24 }); setTool('select'); };
  const handleAddTriangle = () => { addShape({ type: 'triangle', x: 400, y: 400, width: 100, height: 100, fill: '#10b981' }); setTool('select'); };
  const handleAddLine = () => { addShape({ type: 'line', x: 100, y: 500, x2: 250, y2: 650, fill: '#ef4444', strokeWidth: 4 }); setTool('select'); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 2MB to avoid local storage bloat)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. El límite es 2MB para no saturar la memoria local.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      addShape({
        type: 'image',
        x: 200,
        y: 200,
        width: 300,
        height: 300,
        imageUrl: base64,
        fill: 'transparent'
      });
      setTool('select');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset input
  };

  return (
    <div className="relative h-full flex items-center z-10 pointer-events-none">
      <div className="absolute left-2 pointer-events-auto">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#161e2e]/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors shadow-xl"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 12, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="pointer-events-auto ml-10 bg-[#161e2e]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl"
          >
            <button onClick={() => setSelectedId(null)} className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white" title="Seleccionar">
              <MousePointer2 size={24} />
            </button>
            <div className="w-8 h-px bg-white/10 mx-auto" />
            <button onClick={handleAddRect} className="p-3 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-slate-400" title="Rectángulo">
              <Square size={24} />
            </button>
            <button onClick={handleAddCircle} className="p-3 rounded-xl hover:bg-amber-500/20 hover:text-amber-400 transition-colors text-slate-400" title="Círculo">
              <Circle size={24} />
            </button>
            <button onClick={handleAddTriangle} className="p-3 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-slate-400" title="Triángulo">
              <Triangle size={24} />
            </button>
            <button onClick={handleAddLine} className="p-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors text-slate-400" title="Línea">
              <Minus size={24} strokeWidth={4} />
            </button>
            <button onClick={handleAddText} className="p-3 rounded-xl hover:bg-white/20 transition-colors text-slate-400 hover:text-white" title="Texto">
              <Type size={24} />
            </button>
            <button 
              onClick={() => setTool('pen')} 
              className={`p-3 rounded-xl transition-colors ${currentTool === 'pen' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-white/10'}`} 
              title="Dibujo Libre (Lápiz)"
            >
              <Pen size={24} />
            </button>
            <label className="p-3 rounded-xl hover:bg-white/20 transition-colors text-slate-400 hover:text-white cursor-pointer" title="Subir Imagen">
              <ImageIcon size={24} />
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
            </label>
            
            <div className="w-8 h-px bg-white/10 mx-auto" />
            
            <button 
              onClick={() => setSnapToGrid(!snapToGrid)} 
              className={`p-3 rounded-xl transition-colors ${snapToGrid ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-white/10'}`} 
              title="Ajustar a Cuadrícula (Snap to Grid)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
