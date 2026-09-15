import type React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { Square, Circle, Type, MousePointer2, Triangle, Minus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const Toolbar = () => {
  const { addShape, setSelectedId } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(true);

  const handleAddRect = () => addShape({ type: 'rect', x: 100, y: 100, width: 100, height: 100, fill: '#3b82f6' });
  const handleAddCircle = () => addShape({ type: 'circle', x: 200, y: 200, radius: 50, fill: '#f59e0b' });
  const handleAddText = () => addShape({ type: 'text', x: 300, y: 300, text: 'Nuevo Texto', fill: '#ffffff', fontSize: 24 });
  const handleAddTriangle = () => addShape({ type: 'triangle', x: 400, y: 400, width: 100, height: 100, fill: '#10b981' });
  const handleAddLine = () => addShape({ type: 'line', x: 100, y: 500, x2: 250, y2: 650, fill: '#ef4444', strokeWidth: 4 });

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
