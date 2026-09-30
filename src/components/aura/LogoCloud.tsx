import React from 'react';
import { motion } from 'motion/react';

export const LogoCloud: React.FC = () => {
  const logos = ['Linear', 'Vercel', 'Figma', 'Stripe', 'Ramp', 'Notion', 'Loom', 'Arc'];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
      {/* Centered Kicker */}
      <div className="text-xs uppercase tracking-widest text-white/40 font-mono">
        Trusted by the world's most thoughtful teams
      </div>

      {/* Grid of Logos */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
        {logos.map((name, idx) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className="text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors cursor-pointer flex items-center justify-center py-2"
          >
            {name}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
