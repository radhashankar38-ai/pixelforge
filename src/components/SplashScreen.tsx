import React from 'react';
import { motion } from 'motion/react';
import { Aperture } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0C]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 180 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Aperture className="w-24 h-24 text-indigo-400" strokeWidth={1} />
      </motion.div>
      <motion.h1 
        className="text-3xl font-light tracking-widest mt-8 text-white uppercase"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Pixel<span className="font-bold text-indigo-400">Forge</span>
      </motion.h1>
      <motion.p
         className="text-gray-400 mt-3 text-sm tracking-widest uppercase font-bold"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1, duration: 1 }}
      >
        Pro Photo Editor
      </motion.p>
    </div>
  );
}
