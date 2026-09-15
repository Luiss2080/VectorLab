import React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const PropertiesPanel: React.FC = () => {
  const { shapes, selectedId, updateShape, deleteShape } = useCanvasStore();
  const selectedShape = shapes.find(s => s.id === selectedId);

  if (!selectedShape) {
    return (
      <div className="w-64 bg-[#161e2e] border-l border-white/10 p-4 text-slate-400 text-sm">
        No hay ninguna figura seleccionada.
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    updateShape(selectedShape.id, {
      [name]: type === 'number' ? Number(value) : value
    });
  };

  return (
    <div className="w-64 bg-[#161e2e] border-l border-white/10 p-4 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Propiedades</h2>
      
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Color de Relleno</label>
        <input 
          type="color" 
          name="fill" 
          value={selectedShape.fill} 
          onChange={handleChange}
          className="w-full h-8 rounded cursor-pointer bg-transparent border-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">X</label>
          <input type="number" name="x" value={Math.round(selectedShape.x)} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Y</label>
          <input type="number" name="y" value={Math.round(selectedShape.y)} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
        </div>
      </div>

      {selectedShape.type === 'rect' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Ancho</label>
            <input type="number" name="width" value={selectedShape.width} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Alto</label>
            <input type="number" name="height" value={selectedShape.height} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
          </div>
        </div>
      )}

      {selectedShape.type === 'circle' && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Radio</label>
          <input type="number" name="radius" value={selectedShape.radius} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
        </div>
      )}

      {selectedShape.type === 'text' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Texto</label>
            <input type="text" name="text" value={selectedShape.text} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Tamaño de Fuente</label>
            <input type="number" name="fontSize" value={selectedShape.fontSize} onChange={handleChange} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-white" />
          </div>
        </>
      )}

      <button 
        onClick={() => deleteShape(selectedShape.id)}
        className="mt-4 py-2 px-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-sm font-medium"
      >
        Eliminar Figura
      </button>
    </div>
  );
};
