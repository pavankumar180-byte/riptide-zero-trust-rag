import React from 'react';
import { motion } from 'motion/react';
import { Menu, ShieldCheck } from 'lucide-react';
import { LogoMark, AppleButton } from './SharedPrimitives';

interface NavbarProps {
  onOpenRiptide: () => void;
  activeView: 'aura' | 'riptide';
  setActiveView: (view: 'aura' | 'riptide') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRiptide,
  activeView,
  setActiveView
}) => {
  const links = ['Solutions', 'Pricing', 'Blog', 'Documentation', 'Careers'];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-30 w-full pt-6"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Just the LogoMark (NO "Aura" word) */}
        <div
          onClick={() => setActiveView('aura')}
          className="cursor-pointer transition-transform hover:scale-105"
          title="Aura AI"
        >
          <LogoMark className="w-8 h-8" />
        </div>

        {/* Center Navigation Links with Stagger */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, idx) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Right Desktop: Mode Toggle & AppleButton */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setActiveView(activeView === 'aura' ? 'riptide' : 'aura')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
              activeView === 'riptide'
                ? 'bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white/90 border-white/15'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{activeView === 'riptide' ? 'VIEW AURA CLIENT' : 'ZERO-TRUST VOICE RAG'}</span>
          </button>

          <AppleButton label="Download Aura" />
        </div>

        {/* Mobile Right: Menu Icon Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setActiveView(activeView === 'aura' ? 'riptide' : 'aura')}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-[#00d2ff]"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
