import React from 'react';
import { Skull, ShieldAlert, CheckCircle, Terminal, Play } from 'lucide-react';
import { ATTACK_DEMO_PRESETS } from '../../lib/security/attackPresets';
import { AttackDemoPreset } from '../../types';

interface AttackDemoPanelProps {
  onSelectPreset: (preset: AttackDemoPreset) => void;
  isLoading: boolean;
}

export const AttackDemoPanel: React.FC<AttackDemoPanelProps> = ({
  onSelectPreset,
  isLoading
}) => {
  return (
    <div className="w-full max-w-5xl my-8 p-6 rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-950/10 to-black/60 backdrop-blur-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              ATTACK DEMO & SECURITY TESTBED
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                JUDGES SUITE
              </span>
            </h3>
            <p className="text-xs text-white/50">
              Trigger prompt injections, indirect email carriers, PII leaks, and zero-trust defenses with 1-click.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ATTACK_DEMO_PRESETS.map((preset) => {
          const isAttack = preset.category !== 'NORMAL_QUERY';
          return (
            <div
              key={preset.id}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isAttack
                  ? 'bg-black/40 border-red-500/30 hover:border-red-400/70 hover:shadow-[0_0_25px_rgba(255,51,102,0.15)]'
                  : 'bg-black/40 border-[#00d2ff]/30 hover:border-[#00d2ff]/70 hover:shadow-[0_0_25px_rgba(0,210,255,0.15)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      isAttack
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30'
                    }`}
                  >
                    {preset.category.replace('_', ' ')}
                  </span>
                  {isAttack ? (
                    <Skull className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-[#00d2ff]" />
                  )}
                </div>

                <h4 className="text-sm font-semibold text-white mb-1.5 leading-snug">
                  {preset.title}
                </h4>

                <p className="text-xs text-white/50 mb-3 leading-relaxed">
                  {preset.description}
                </p>

                <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-white/80 mb-3 line-clamp-2">
                  "{preset.prompt}"
                </div>
              </div>

              <button
                onClick={() => onSelectPreset(preset)}
                disabled={isLoading}
                className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 ${
                  isAttack
                    ? 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40'
                    : 'bg-[#00d2ff]/20 hover:bg-[#00d2ff] text-[#A4F4FD] hover:text-black border border-[#00d2ff]/40'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate Attack Case</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
