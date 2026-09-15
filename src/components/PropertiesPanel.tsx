import type React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PanelRightClose, PanelRightOpen, ArrowUpToLine, ArrowDownToLine, Trash2 } from 'lucide-react';

export const PropertiesPanel = () => {
  const { shapes, selectedId, updateShape, deleteShape, bringToFront, sendToBack } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(true);
  
  const selectedShape = shapes.find(s => s.id === selectedId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (!selectedShape) return;
    updateShape(selectedShape.id, {
      [name]: type === 'number' ? Number(value) : value
    });
  };

  return (
    <div className="relative h-full flex items-center z-10 pointer-events-none">
      <div className="absolute right-2 pointer-events-auto">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#161e2e]/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors shadow-xl"
        >
          {isOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: -12, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="pointer-events-auto mr-10 w-64 bg-[#161e2e]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-5 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <h2 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Propiedades</h2>
            
            {!selectedShape ? (
              <div className="text-slate-400 text-sm text-center py-10 opacity-60">
                Selecciona una figura en el lienzo para editar sus propiedades.
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-medium">Color de Relleno</label>
                  <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-lg border border-white/5">
                    <input 
                      type="color" 
                      name="fill" 
                      value={selectedShape.fill} 
                      onChange={handleChange}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className="text-xs font-mono text-slate-300">{selectedShape.fill.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500">Transparencia (Opacidad)</label>
                  <div className="flex items-center gap-3 bg-black/50 p-2 rounded-lg border border-white/10">
                    <input 
                      type="range" 
                      name="opacity" 
                      min="0.1" 
                      max="1" 
                      step="0.05"
                      value={selectedShape.opacity ?? 1} 
                      onChange={handleChange}
                      className="w-full accent-blue-500"
                    />
                    <span className="text-xs font-mono text-slate-300 w-8 text-right">{Math.round((selectedShape.opacity ?? 1) * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500">Posición X</label>
                    <input type="number" name="x" value={Math.round(selectedShape.x)} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500">Posición Y</label>
                    <input type="number" name="y" value={Math.round(selectedShape.y)} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>

                {(selectedShape.type === 'rect' || selectedShape.type === 'triangle') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500">Ancho</label>
                      <input type="number" name="width" value={selectedShape.width || 0} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500">Alto</label>
                      <input type="number" name="height" value={selectedShape.height || 0} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                )}

                {selectedShape.type === 'circle' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500">Radio</label>
                    <input type="number" name="radius" value={selectedShape.radius || 0} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                )}
                
                {selectedShape.type === 'line' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Fin X (X2)</label>
                        <input type="number" name="x2" value={selectedShape.x2 || 0} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Fin Y (Y2)</label>
                        <input type="number" name="y2" value={selectedShape.y2 || 0} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500">Grosor de Línea</label>
                      <input type="number" name="strokeWidth" value={selectedShape.strokeWidth || 4} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </>
                )}

                {selectedShape.type === 'text' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500">Texto</label>
                      <input type="text" name="text" value={selectedShape.text || ''} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500">Tamaño de Fuente</label>
                      <input type="number" name="fontSize" value={selectedShape.fontSize || 16} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </>
                )}

                <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Orden (Z-Index)</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => bringToFront(selectedShape.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs transition-colors text-slate-300"
                    >
                      <ArrowUpToLine size={14} /> Al Frente
                    </button>
                    <button 
                      onClick={() => sendToBack(selectedShape.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs transition-colors text-slate-300"
                    >
                      <ArrowDownToLine size={14} /> Al Fondo
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => deleteShape(selectedShape.id)}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md transition-colors text-sm font-semibold"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
