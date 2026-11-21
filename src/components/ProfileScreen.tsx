import React from 'react';
import { User } from '../types';
import { ChevronLeft, LogOut, Settings, Award, HardDrive, Smartphone, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  user: User | null;
  onLogout: () => void;
  onBack: () => void;
}

export default function ProfileScreen({ user, onLogout, onBack }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
      <header className="flex justify-between items-center px-4 py-4 pt-12 sticky top-0 bg-white/5 backdrop-blur-md z-20 border-b border-white/10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-white active:scale-95">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-medium">Profile</h2>
        <div className="w-10" />
      </header>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-bold border border-indigo-500/30 overflow-hidden shadow-lg shadow-indigo-500/10">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="profile" /> : user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              {user?.isPro ? <><Award className="w-3 h-3 text-yellow-500" /> Pro Member</> : 'Free Plan'}
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <ProfileMenu icon={HardDrive} label="Storage & Backup" />
          <ProfileMenu icon={Smartphone} label="App Settings" />
          <ProfileMenu icon={HelpCircle} label="Help & Support" />
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white/5 border border-red-500/30 text-red-400 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-500/10 backdrop-blur-md"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function ProfileMenu({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors active:bg-white/5">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="font-semibold text-gray-300 text-sm tracking-wide">{label}</span>
      </div>
      <ChevronLeft className="w-5 h-5 text-gray-600 rotate-180" />
    </button>
  );
}
