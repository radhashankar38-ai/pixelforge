import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, Eraser, MoveUpRight, Zap, Check } from 'lucide-react';
import { EditSettings } from '../types';

interface Props {
  key?: string;
  onApply: (s: Partial<EditSettings>) => void;
  onClose: () => void;
}

const AI_TOOLS = [
  { id: 'auto', icon: Zap, label: 'Auto FX', desc: 'Smart enhance overall image' },
  { id: 'sky', icon: Sparkles, label: 'Sky Enhancer', desc: 'Boost sky tones & contrast' },
  { id: 'mood', icon: Sparkles, label: 'Auto Mood', desc: 'AI cinematic color grading' },
  { id: 'sharp', icon: MoveUpRight, label: 'Crystal Clear', desc: 'AI detail enhancement' }
];

export default function AIToolsPanel({ onApply, onClose }: Props) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleApply = (id: string) => {
    setProcessing(id);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setProcessing(null);
      if (id === 'auto') {
        onApply({
          brightness: 110,
          contrast: 115,
          saturation: 120,
        });
        showToast('Auto FX applied successfully!');
      } else if (id === 'sky') {
        onApply({
          contrast: 125,
          saturation: 130,
          tint: -15,
          brightness: 95
        });
        showToast('Sky enhancement applied!');
      } else if (id === 'sharp') {
        onApply({
          contrast: 110,
          brightness: 105
        });
        showToast('Details enhanced!');
      } else if (id === 'mood') {
        onApply({
          contrast: 120,
          saturation: 85,
          tint: 20,
          vignette: 25
        });
        showToast('AI Mood grading applied!');
      }
    }, 1500);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg border border-indigo-500/50 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase z-50 whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-full left-0 w-full bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> AI Tools
          </h3>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white active:scale-95 transition-all">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          {AI_TOOLS.map(tool => {
            const Icon = tool.icon;
            const isProcessing = processing === tool.id;
            
            return (
              <button 
                key={tool.id}
                disabled={!!processing}
                onClick={() => handleApply(tool.id)}
                className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-start gap-4 text-left active:scale-95 transition-all disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  {isProcessing ? (
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                       <Sparkles className="w-5 h-5" />
                     </motion.div>
                  ) : (
                     <Icon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest text-white block">{tool.label}</span>
                  <span className="text-[10px] text-gray-400 line-clamp-1">{tool.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
