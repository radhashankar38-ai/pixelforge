import React, { useState, useRef, useEffect } from 'react';
import { Project, EditSettings, defaultEditSettings, CustomPreset } from '../types';
import { ChevronLeft, Download, Undo, Redo, SlidersHorizontal, Wand2, Crop, Layers, Share, Check, X, SplitSquareHorizontal, RefreshCw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdjustmentsPanel from './AdjustmentsPanel';
import FiltersPanel from './FiltersPanel';
import AIToolsPanel from './AIToolsPanel';

interface EditorProps {
  project: Project | null;
  onBack: () => void;
  onExport: (p: Project) => void;
  onSave: (p: Project) => void;
}

type EditorMode = 'none' | 'adjust' | 'filters' | 'ai' | 'crop';

export default function EditorWorkspace({ project, onBack, onExport, onSave }: EditorProps) {
  const [settings, setSettings] = useState<EditSettings>(project?.settings || {} as EditSettings);
  const [mode, setMode] = useState<EditorMode>('none');
  const [isComparing, setIsComparing] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Apply filters via CSS to the canvas for preview
  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${settings.brightness}%) 
        contrast(${settings.contrast}%) 
        saturate(${settings.saturation}%) 
        hue-rotate(${settings.tint}deg)
        blur(${settings.blur}px)
      `,
    };
  };

  const getPresetClass = () => {
    switch (settings.filter) {
      case 'vintage': return 'sepia-[.5] contrast-125';
      case 'cinematic': return 'saturate-50 contrast-125 hue-rotate-[-10deg]';
      case 'bnw': return 'grayscale contrast-125';
      case 'fade': return 'opacity-80 contrast-75 brightness-110';
      default: return '';
    }
  };

  const handleUpdateSetting = (key: keyof EditSettings, value: number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(defaultEditSettings);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;
    
    const newPreset: CustomPreset = {
      id: Math.random().toString(36).substring(7),
      name: presetName,
      settings: { ...settings }
    };
    
    const saved = localStorage.getItem('pixelforge_presets');
    const presets = saved ? JSON.parse(saved) : [];
    localStorage.setItem('pixelforge_presets', JSON.stringify([...presets, newPreset]));
    
    setShowSavePreset(false);
    setPresetName('');
    alert('Preset saved successfully!');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isComparing || !imageContainerRef.current) return;
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      if (!isDraggingSlider) return;
      clientX = (e as React.PointerEvent).clientX;
    }

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  };

  const handlePointerUp = () => {
    setIsDraggingSlider(false);
  };

  if (!project) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] absolute inset-0 z-50 overflow-hidden" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 py-4 absolute top-0 w-full z-40 bg-white/5 border-b border-white/10 backdrop-blur-md pt-safe">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 shadow-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2 lg:gap-3">
          <button 
             onClick={handleReset}
             className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 hover:bg-white/10 active:scale-95 shadow-lg transition-all"
             title="Reset all edits"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
             onClick={() => setIsComparing(!isComparing)}
             className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 shadow-lg transition-all ${isComparing ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
             title="Compare (Slider)"
          >
            <SplitSquareHorizontal className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSavePreset(true)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 shadow-lg transition-all hidden sm:flex"
            title="Save as Preset"
          >
             <Save className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSave({ ...project, settings })}
            className="px-5 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2 transition-all ml-1"
          >
             <span>Save</span> <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#0A0A0C] pt-20 pb-[100px]">
        <div className="absolute inset-0 pattern-dots pattern-white/5 pattern-bg-transparent pattern-size-4 pattern-opacity-20" />
        
        {/* Save Preset Dialog */}
        <AnimatePresence>
          {showSavePreset && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-80 backdrop-blur-3xl"
            >
              <h3 className="font-bold text-lg text-white mb-2">Save Custom Preset</h3>
              <p className="text-gray-400 text-sm mb-4">Save current adjustments and filters to apply them quickly later.</p>
              <form onSubmit={handleSavePreset}>
                <input 
                  type="text"
                  placeholder="Preset Name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-colors mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowSavePreset(false)} className="flex-1 py-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold tracking-widest uppercase text-sm py-3 rounded-xl shadow-lg ring-1 ring-indigo-500/50 hover:bg-indigo-500 active:scale-95 transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {showSavePreset && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowSavePreset(false)} />}
        
        {/* Image Container */}
        <div 
          ref={imageContainerRef}
          className="relative inline-block max-w-[90%] max-h-full z-10 shadow-[0_0_100px_rgba(79,70,229,0.1)] touch-none select-none"
          onPointerMove={handlePointerMove}
          onTouchMove={handlePointerMove}
        >
           {/* Edited Base Image (Bottom Layer) */}
           <img 
             src={project.originalImage} 
             alt="Edited"
             style={getFilterStyle()}
             draggable={false}
             className={`block max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl ring-1 ring-white/10 pointer-events-none transition-opacity ${isComparing ? 'opacity-100' : 'opacity-100'} ${getPresetClass()}`}
           />
           {settings.vignette > 0 && (
             <div 
               className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay" 
               style={{ boxShadow: `inset 0 0 ${settings.vignette * 2.5}px rgba(0,0,0,0.9)` }}
             />
           )}

           {/* Original Image (Top Layer, clipped when comparing) */}
           {isComparing && (
             <>
               <img 
                 src={project.originalImage} 
                 alt="Original"
                 draggable={false}
                 style={{ 
                   clipPath: `inset(0 ${100 - sliderPos}% 0 0)` 
                 }}
                 className="absolute inset-0 max-h-[65vh] w-auto object-contain rounded-lg pointer-events-none"
               />
               
               {/* Slider Handle */}
               <div 
                 style={{ left: `${sliderPos}%` }}
                 className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 cursor-ew-resize transform -translate-x-1/2"
                 onPointerDown={() => setIsDraggingSlider(true)}
                 onTouchStart={() => setIsDraggingSlider(true)}
               >
                 <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                     <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                   </div>
                 </div>
               </div>
               
               <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full pointer-events-none">
                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-bold tracking-widest uppercase text-white">Compare Mode</span>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Tools Panel */}
      <div className="bg-white/5 backdrop-blur-2xl border-t border-white/10 pb-safe absolute bottom-0 w-full z-30">
        
        {/* Dynamic Context Panel */}
        <AnimatePresence mode="wait">
          {mode === 'adjust' && (
            <AdjustmentsPanel key="adjust-panel" settings={settings as any} onChange={handleUpdateSetting as any} onClose={() => setMode('none')} />
          )}
          {mode === 'filters' && (
            <FiltersPanel key="filters-panel" current={settings.filter} onChange={(f) => handleUpdateSetting('filter', f)} onApplyPreset={(s) => setSettings(s)} onClose={() => setMode('none')} />
          )}
          {mode === 'ai' && (
            <AIToolsPanel key="ai-panel" onApply={(s) => setSettings({...settings, ...s})} onClose={() => setMode('none')} />
          )}
        </AnimatePresence>

        {/* Main Toolbar */}
        <div className="flex justify-between items-center px-6 py-4 overflow-x-auto gap-8 hide-scrollbar">
           <ToolButton icon={<SlidersHorizontal/>} label="Adjust" active={mode==='adjust'} onClick={() => setMode('adjust')} />
           <ToolButton icon={<Layers/>} label="Filters" active={mode==='filters'} onClick={() => setMode('filters')} />
           <ToolButton icon={<Wand2/>} label="AI Tools" active={mode==='ai'} onClick={() => setMode('ai')} highlight />
           <ToolButton icon={<Crop/>} label="Crop" active={mode==='crop'} onClick={() => alert('Crop tool would use cropperjs')} />
           <ToolButton icon={<Save/>} label="Save Preset" active={showSavePreset} onClick={() => setShowSavePreset(true)} className="sm:hidden" />
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon, label, active, onClick, highlight = false, className = '' }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 shrink-0 ${active || highlight ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'} ${className}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${active || highlight ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-transparent border-transparent'}`}>
        {React.cloneElement(icon, { className: "w-6 h-6", strokeWidth: 1.5 })}
      </div>
      <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
}
