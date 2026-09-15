import type React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { Square, Circle, Type, MousePointer2 } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { addShape, setSelectedId } = useCanvasStore();

  const handleAddRect = () => {
    addShape({ type: 'rect', x: 100, y: 100, width: 100, height: 100, fill: '#3b82f6' });
  };

  const handleAddCircle = () => {
    addShape({ type: 'circle', x: 200, y: 200, radius: 50, fill: '#f59e0b' });
  };

  const handleAddText = () => {
    addShape({ type: 'text', x: 300, y: 300, text: 'Nuevo Texto', fill: '#ffffff', fontSize: 24 });
  };

  return (
    <div className="w-16 bg-[#161e2e] border-r border-white/10 flex flex-col items-center py-4 gap-4">
      <button onClick={() => setSelectedId(null)} className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white" title="Seleccionar">
        <MousePointer2 size={24} />
      </button>
      <div className="w-8 h-px bg-white/10" />
      <button onClick={handleAddRect} className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white" title="Rectángulo">
        <Square size={24} />
      </button>
      <button onClick={handleAddCircle} className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white" title="Círculo">
        <Circle size={24} />
      </button>
      <button onClick={handleAddText} className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white" title="Texto">
        <Type size={24} />
      </button>
    </div>
  );
};
