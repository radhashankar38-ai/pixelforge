import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EditSettings } from '../types';
import { Sun, Contrast, Droplet, Aperture, ChevronDown } from 'lucide-react';

interface Props {
  key?: string;
  settings: EditSettings;
  onChange: (k: keyof EditSettings, v: number) => void;
  onClose: () => void;
}

const TOOLS = [
  { id: 'brightness', icon: Sun, label: 'Bright', min: 0, max: 200, default: 100 },
  { id: 'contrast', icon: Contrast, label: 'Contrast', min: 0, max: 200, default: 100 },
  { id: 'saturation', icon: Droplet, label: 'Saturate', min: 0, max: 200, default: 100 },
  { id: 'vignette', icon: Aperture, label: 'Vignette', min: 0, max: 100, default: 0 },
  { id: 'blur', icon: Droplet, label: 'Blur', min: 0, max: 20, default: 0 },
  { id: 'tint', icon: Sun, label: 'Tint', min: -180, max: 180, default: 0 },
];

export default function AdjustmentsPanel({ settings, onChange, onClose }: Props) {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);

  const currentValue = settings[activeTool.id as keyof EditSettings] as number;

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-full left-0 w-full bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white tracking-wide">{activeTool.label}</h3>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white active:scale-95 transition-all">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <span className="text-sm font-bold text-indigo-400 mb-2 block text-center">
          {currentValue}
        </span>
        <input 
          type="range"
          min={activeTool.min}
          max={activeTool.max}
          value={currentValue}
          onChange={(e) => onChange(activeTool.id as keyof EditSettings, parseInt(e.target.value))}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500 shadow-inner"
        />
      </div>

      <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
        {TOOLS.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool.id === tool.id;
          return (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              className={`flex flex-col items-center gap-2 shrink-0 w-16 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
