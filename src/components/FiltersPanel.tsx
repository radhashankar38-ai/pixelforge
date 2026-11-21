import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { CustomPreset, EditSettings } from '../types';

interface Props {
  key?: string;
  current: string;
  onChange: (f: string) => void;
  onApplyPreset?: (settings: EditSettings) => void;
  onClose: () => void;
}

const FILTERS = [
  { id: 'none', label: 'Original', class: '' },
  { id: 'vintage', label: 'Vintage', class: 'sepia-[.5] contrast-125' },
  { id: 'cinematic', label: 'Cinema', class: 'saturate-50 contrast-125 hue-rotate-[-10deg]' },
  { id: 'bnw', label: 'Noir', class: 'grayscale contrast-125' },
  { id: 'fade', label: 'Faded', class: 'opacity-80 contrast-75 brightness-110' },
];

export default function FiltersPanel({ current, onChange, onApplyPreset, onClose }: Props) {
  const [presets, setPresets] = useState<CustomPreset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('pixelforge_presets');
    if (saved) {
      setPresets(JSON.parse(saved));
    }
  }, []);

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPresets = presets.filter(p => p.id !== id);
    setPresets(newPresets);
    localStorage.setItem('pixelforge_presets', JSON.stringify(newPresets));
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-full left-0 w-full bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl max-h-[50vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white tracking-wide">Filters & Presets</h3>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white active:scale-95 transition-all">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Default Filters</h4>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
          {FILTERS.map(f => {
            const isActive = current === f.id;
            return (
              <button 
                key={f.id}
                onClick={() => onChange(f.id)}
                className="flex flex-col items-center gap-2 shrink-0 group"
              >
                <div className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${isActive ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-white/10 group-hover:border-white/30'}`}>
                   <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" className={`w-full h-full object-cover ${f.class}`} alt={f.label} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {presets.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">My Presets</h4>
          <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
            {presets.map(preset => {
              // We won't try to compute if it's "active" easily since it's a bundle of settings
              return (
                <button 
                  key={preset.id}
                  onClick={() => onApplyPreset && onApplyPreset(preset.settings)}
                  className="flex flex-col items-center gap-2 shrink-0 group relative"
                >
                  <div className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all border-white/10 group-hover:border-indigo-500/50 bg-indigo-900/20 flex flex-col justify-end p-2 relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
                    <span className="text-white font-bold text-[10px] uppercase tracking-wider truncate w-full z-10 text-center">{preset.name}</span>
                  </div>
                  <div 
                    onClick={(e) => handleDeletePreset(preset.id, e)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
