import React from 'react';
import { motion } from 'motion/react';
import { AppleButton, gradientStyle } from './SharedPrimitives';

export const Hero: React.FC = () => {
  return (
    <section className="relative z-10 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center px-6">
      {/* Motion H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[0.9] flex flex-col items-center"
      >
        <span className="text-white">Your email.</span>
        <span
          className="animate-shiny mt-2"
          style={gradientStyle}
        >
          Revitalized
        </span>
      </motion.h1>

      {/* Motion Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
      >
        Aura is the premier inbox platform for the current era. It leverages powerful AI to organize, prioritize, and refine your messages into total clarity.
      </motion.p>

      {/* Motion Div with Button & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <AppleButton label="Download Aura" />
        <span className="text-xs text-white/40">
          Download for Intel / Apple Silicon
        </span>
      </motion.div>
    </section>
  );
};
