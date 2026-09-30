import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { AppleLogo } from './SharedPrimitives';

export const MacMenuBar: React.FC = () => {
  const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10 z-20"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs font-sans">
        {/* Left Side */}
        <div className="flex items-center gap-5 text-white/80">
          <div className="flex items-center gap-2">
            <AppleLogo className="w-3.5 h-3.5 text-white" />
            <span className="font-bold text-white tracking-wide">Aura</span>
          </div>

          <div className="flex items-center gap-4 text-white/70">
            {menuItems.map((item, idx) => {
              let visibilityClass = 'inline';
              if (idx > 3) {
                visibilityClass = 'hidden md:inline';
              } else if (idx > 2) {
                visibilityClass = 'hidden sm:inline';
              }

              return (
                <span
                  key={item}
                  className={`hover:text-white cursor-pointer transition-colors ${visibilityClass}`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 text-white/60">
          <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
          <span className="font-sans text-[11px] tracking-tight">Wed May 6 1:09 PM</span>
        </div>
      </div>
    </motion.div>
  );
};
