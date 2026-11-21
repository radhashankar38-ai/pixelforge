import React, { useState } from 'react';
import { Project } from '../types';
import { ChevronLeft, Download, Share2, Instagram, Facebook, Twitter, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  project: Project | null;
  onBack: () => void;
  onDone: () => void;
}

export default function ExportScreen({ project, onBack, onDone }: Props) {
  const [quality, setQuality] = useState('High');
  const [format, setFormat] = useState('JPG');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
      <header className="flex justify-between items-center px-4 py-4 pt-12 sticky top-0 bg-white/5 backdrop-blur-md z-20 border-b border-white/10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-white active:scale-95">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-medium">Export Options</h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 p-6 flex flex-col">
         {/* Preview */}
         <div className="aspect-[4/3] bg-black/50 rounded-2xl mb-8 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg shadow-indigo-500/5">
           {project && (
             <img 
               src={project.originalImage} 
               alt="Preview" 
               className="max-w-full max-h-full object-contain"
               style={{
                  filter: `
                    brightness(${project.settings.brightness}%) 
                    contrast(${project.settings.contrast}%) 
                    saturate(${project.settings.saturation}%) 
                    hue-rotate(${project.settings.tint}deg)
                    blur(${project.settings.blur}px)
                  `
               }}
             />
           )}
         </div>

         {/* Options */}
         <div className="space-y-6">
           <div>
             <h3 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Format</h3>
             <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-xl">
               {['JPG', 'PNG', 'WEBP'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setFormat(f)}
                   className={`flex-1 py-2 text-xs font-bold tracking-widest rounded-lg transition-all ${format === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                   {f}
                 </button>
               ))}
             </div>
           </div>

           <div>
             <h3 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Quality</h3>
             <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-xl">
               {['Standard', 'High', 'Maximum'].map(q => (
                 <button 
                   key={q}
                   onClick={() => setQuality(q)}
                   className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${quality === q ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                   {q}
                 </button>
               ))}
             </div>
           </div>
         </div>

         {/* Social Share */}
         <div className="mt-8">
           <h3 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Quick Share</h3>
           <div className="flex gap-4">
             <ShareBtn icon={Instagram} color="text-pink-500" />
             <ShareBtn icon={Facebook} color="text-blue-500" />
             <ShareBtn icon={Twitter} color="text-sky-500" />
             <ShareBtn icon={Share2} color="text-white" />
           </div>
         </div>

         <div className="mt-auto pt-6">
           <AnimatePresence mode="wait">
             {success ? (
               <motion.button 
                 key="success"
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 onClick={onDone}
                 className="w-full bg-green-500 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2"
               >
                 <Check className="w-5 h-5" /> Done
               </motion.button>
             ) : (
               <motion.button 
                 key="export"
                 whileTap={{ scale: 0.95 }}
                 onClick={handleExport}
                 disabled={isExporting}
                 className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-70"
               >
                 {isExporting ? 'Exporting...' : (
                   <><Download className="w-5 h-5" /> Save to Camera Roll</>
                 )}
               </motion.button>
             )}
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function ShareBtn({ icon: Icon, color }: any) {
  return (
    <button className="flex-1 aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-lg">
      <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.5} />
    </button>
  );
}
