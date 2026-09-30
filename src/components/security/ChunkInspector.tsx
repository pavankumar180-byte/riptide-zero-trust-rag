import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, ShieldCheck, ShieldAlert, FileText } from 'lucide-react';
import { CitedSource } from '../../types';

interface ChunkInspectorProps {
  sources: CitedSource[];
}

export const ChunkInspector: React.FC<ChunkInspectorProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full max-w-5xl my-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-[#00d2ff]" />
          <span className="text-sm font-semibold tracking-wide text-white">CHUNK INSPECTOR</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30">
            {sources.length} Chunks Evaluated
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{isOpen ? 'Collapse' : 'Expand Structure & Security Details'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4">
          <p className="text-xs text-white/50 font-mono">
            Structure-aware dynamic chunking inspection (no fixed 500-token slicing). Each chunk displays its syntactic reason and pre-LLM injection risk score.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                  src.status === 'QUARANTINED'
                    ? 'bg-red-950/20 border-red-500/40 text-red-100'
                    : 'bg-white/[0.02] border-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <FileText className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>Email #{src.email_id}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      src.status === 'QUARANTINED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {src.status === 'QUARANTINED' ? 'QUARANTINED' : 'SAFE'}
                  </span>
                </div>

                <div className="space-y-1.5 text-white/60">
                  <div className="flex justify-between">
                    <span className="text-white/40">Subject:</span>
                    <span className="text-white/90 truncate max-w-[200px]">{src.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Chunk Type:</span>
                    <span className="text-[#A4F4FD] uppercase">{src.chunk_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Chunk Reason:</span>
                    <span className="text-white/80">{src.chunk_reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Token Size:</span>
                    <span className="text-white/80">{src.size_tokens} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Injection Risk:</span>
                    <span className={src.risk_score >= 60 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {src.risk_score}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10">
                  <span className="text-[10px] text-white/40 uppercase block mb-1">Content Excerpt:</span>
                  <p className="text-[11px] text-white/70 italic line-clamp-3 bg-black/30 p-2 rounded">
                    "{src.excerpt}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
