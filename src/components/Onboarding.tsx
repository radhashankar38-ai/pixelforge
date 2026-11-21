import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, Wand2, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Sparkles,
    title: "Pro Adjustments",
    desc: "Refine every detail with our advanced color, light, and tone tools."
  },
  {
    icon: Wand2,
    title: "AI Powered",
    desc: "One-tap auto enhancements, sky replacements, and smart removals."
  },
  {
    icon: Layers,
    title: "Layered Editing",
    desc: "Combine logic, overlays, and text for stunning visual compositions."
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current === slides.length - 1) {
      onComplete();
    } else {
      setCurrent(current + 1);
    }
  };

  const Icon = slides[current].icon;

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center relative overflow-hidden">
        
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center relative z-10"
          >
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
              <Icon className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{slides[current].title}</h2>
            <p className="text-gray-400 text-lg max-w-xs">{slides[current].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12 flex flex-col items-center bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="flex gap-2 mb-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        
        <button 
          onClick={next}
          className="w-full flex items-center justify-between bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all hover:bg-indigo-500"
        >
          <span>{current === slides.length - 1 ? "Get Started" : "Continue"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
