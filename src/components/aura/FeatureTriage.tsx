import React from 'react';
import { motion } from 'motion/react';
import { SectionEyebrow } from './SharedPrimitives';

export const FeatureTriage: React.FC = () => {
  const chips = [
    'Auto-categorize',
    'Snooze for later',
    'Silent newsletters',
    'One-tap unsubscribe'
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left Column Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col"
        >
          <SectionEyebrow label="Triage" tag="AI-native" />

          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02] text-white">
            Clear your inbox <br /> in a single pass.
          </h2>

          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            Aura reads every message, understands intent, and routes the noise away from the signal. Focus on what moves your day forward — the rest handles itself.
          </p>

          {/* Chips Row */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {chips.map(chip => (
              <span
                key={chip}
                className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Liquid-Glass Card with 4 sub-cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="liquid-glass rounded-2xl p-5 border border-white/10 space-y-3"
        >
          <div className="text-xs font-mono text-white/40 mb-3 px-1">
            Today · 42 messages triaged
          </div>

          {/* Sub-card 1: Priority */}
          <div className="liquid-glass rounded-lg p-3 border border-white/10 bg-black/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#ffffff] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                Priority
              </span>
              <span className="text-white/50 text-[11px] font-mono">4</span>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              <div>Sophia Chen — Q3 review</div>
              <div>David Lim — contract signoff</div>
            </div>
          </div>

          {/* Sub-card 2: Follow-up */}
          <div className="liquid-glass rounded-lg p-3 border border-white/10 bg-black/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#e5e5e5] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e5e5e5]" />
                Follow-up
              </span>
              <span className="text-white/50 text-[11px] font-mono">7</span>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              <div>Marcus — design review</div>
              <div>Figma — comment thread</div>
            </div>
          </div>

          {/* Sub-card 3: Updates */}
          <div className="liquid-glass rounded-lg p-3 border border-white/10 bg-black/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#a3a3a3] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#a3a3a3]" />
                Updates
              </span>
              <span className="text-white/50 text-[11px] font-mono">18</span>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              <div>Vercel — deploy ready</div>
              <div>GitHub — PR #482 merged</div>
            </div>
          </div>

          {/* Sub-card 4: Archived */}
          <div className="liquid-glass rounded-lg p-3 border border-white/10 bg-black/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#525252] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#525252]" />
                Archived
              </span>
              <span className="text-white/50 text-[11px] font-mono">13</span>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              <div>Stripe payout · Newsletter · Receipts</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
