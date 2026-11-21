import React, { useRef } from 'react';
import { User, Project, defaultEditSettings } from '../types';
import { Settings, Plus, Image as ImageIcon, Camera, MoreVertical, LayoutGrid, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  user: User | null;
  onNavigate: (s: any) => void;
  onOpenProject: (p: Project) => void;
  onNewProject: (p: Project) => void;
}

export default function HomeDashboard({ user, onNavigate, onOpenProject, onNewProject }: HomeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dummy projects for visual purpose when empty
  const dummyProjects: Project[] = [
    {
      id: 'd1',
      name: 'Sunset Portrait',
      originalImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
      settings: defaultEditSettings,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000
    },
    {
      id: 'd2',
      name: 'City Lights',
      originalImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800',
      settings: defaultEditSettings,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 86400000
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onNewProject({
        id: Math.random().toString(36).substring(7),
        name: 'Untitled Edit',
        originalImage: dataUrl,
        settings: { ...defaultEditSettings },
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
      <header className="flex justify-between items-center px-6 pt-12 pb-4 sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10 z-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pixel<span className="font-light text-indigo-400 ml-1 text-sm uppercase tracking-widest">Forge</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome, {user?.name.split(' ')[0]}</p>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden active:scale-95 shadow-lg"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
          )}
        </button>
      </header>

      <div className="px-6 py-6 scrollbar-hide">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden group shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <ImageIcon strokeWidth={1.5} />
            </div>
            <span className="font-medium text-sm text-gray-300">Gallery</span>
          </motion.div>
          
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Camera API requires native environment or HTTPS.")}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-gray-300 flex items-center justify-center">
              <Camera strokeWidth={1.5} />
            </div>
            <span className="font-medium text-sm text-gray-300">Camera</span>
          </motion.div>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />

        {/* Pro Banner */}
        <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl p-6 mb-10 flex items-center justify-between shadow-lg shadow-indigo-500/20 text-white border border-white/10 backdrop-blur-md">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white/90" /> PixelForge Pro
            </h3>
            <p className="text-white/80 text-sm">Unlock AI tools & premium presets</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-full font-semibold text-sm active:scale-95 shadow-xl transition-colors">
            Upgrade
          </button>
        </div>

        {/* Recent Projects */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight text-white">Recent Projects</h2>
          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
            <LayoutGrid className="w-4 h-4" /> View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-20">
          {dummyProjects.map((proj) => (
            <motion.div 
              key={proj.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenProject(proj)}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 group shadow-lg"
            >
              <div className="aspect-[4/5] bg-black/50 relative overflow-hidden border-b border-white/10">
                <img src={proj.originalImage} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-sm text-gray-100 truncate">{proj.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Edited just now</p>
                </div>
                <button className="p-1 text-gray-500 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md bg-[#050507]/80 backdrop-blur-2xl border-t border-white/10 pb-safe pt-3 px-6 pb-6 flex justify-between z-30">
        <button className="flex flex-col items-center gap-1 text-white">
          <ImageIcon className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Studio</span>
        </button>
        
        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center -mt-8 relative group">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-active:scale-95 transition-transform border border-white/20">
            <Plus className="w-6 h-6" />
          </div>
        </button>

        <button onClick={() => onNavigate('settings')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Settings</span>
        </button>
      </nav>
    </div>
  );
}
