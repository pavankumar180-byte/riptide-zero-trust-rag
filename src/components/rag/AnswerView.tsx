import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, BookOpen, Clock, Copy, Check } from 'lucide-react';
import { RAGResult } from '../../types';

interface AnswerViewProps {
  result: RAGResult | null;
  isLoading: boolean;
}

export const AnswerView: React.FC<AnswerViewProps> = ({ result, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl my-6 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center min-h-[220px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#00d2ff]/20 border-t-[#00d2ff] animate-spin" />
          <Sparkles className="w-5 h-5 text-[#00d2ff] absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="mt-4 text-center font-mono">
          <p className="text-sm font-semibold text-white">ZERO-TRUST PIPELINE ENGAGED</p>
          <p className="text-xs text-white/50 mt-1">Scanning speech → Checking query injection → Retrieving chunks → Scanning data payloads → Sanitizing PII</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isBlocked = result.query_security.status === 'BLOCKED';
  const isRefusal = !result.evidence_grounded && !isBlocked;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.final_answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl my-6 space-y-6">
      {/* Primary Answer Container */}
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-2xl transition-all shadow-2xl ${
        isBlocked
          ? 'bg-red-950/20 border-red-500/40 shadow-[0_0_30px_rgba(255,51,102,0.15)]'
          : 'bg-[#0e1014]/90 border-white/10'
      }`}>
        {/* Answer Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            {isBlocked ? (
              <ShieldAlert className="w-4 h-4 text-red-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
            )}
            <span className="font-bold text-white tracking-wider uppercase">
              {isBlocked ? 'THREAT CONTAINMENT RESPONSE' : 'RIPTIDE GROUNDED SYNTHESIS'}
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1 text-white/50">
              <Clock className="w-3 h-3" />
              {result.execution_time_ms}ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* PII Guard Status Pill */}
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
              result.pii_guard.leaks_detected > 0
                ? 'bg-cyan-500/10 text-[#00d2ff] border-[#00d2ff]/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {result.pii_guard.leaks_detected > 0 ? (
                <>
                  <span>PII GUARD:</span>
                  <span>{result.pii_guard.leaks_detected} IDENTIFIERS REDACTED</span>
                </>
              ) : (
                <>
                  <span>PII GUARD:</span>
                  <span>0 LEAKS ✓ SAFE</span>
                </>
              )}
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all"
              title="Copy answer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-white/90 whitespace-pre-line font-sans">
          {result.final_answer}
        </div>
      </div>

      {/* Cited Sources List (Cite or Refuse) */}
      {result.sources.length > 0 && !isBlocked && (
        <div className="p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00d2ff]" />
              <h3 className="text-xs uppercase font-mono tracking-widest text-white/70">
                Supporting Email Sources ({result.sources.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-white/40">
              Untrusted External Data Treated Exclusively as Evidence
            </span>
          </div>

          <div className="space-y-3">
            {result.sources.map((src, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs font-mono transition-all ${
                  src.status === 'QUARANTINED'
                    ? 'bg-red-950/20 border-red-500/40 text-red-200'
                    : 'bg-white/[0.02] border-white/10 text-white/80'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>Email #{src.email_id}</span>
                    <span className="text-white/40 font-normal">|</span>
                    <span className="text-[#A4F4FD] font-normal">{src.subject}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-[11px]">
                      Risk: <strong className={src.risk_score >= 60 ? 'text-red-400' : 'text-emerald-400'}>{src.risk_score}%</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        src.status === 'QUARANTINED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {src.status === 'QUARANTINED' ? 'QUARANTINED (EXCLUDED)' : 'SAFE EVIDENCE'}
                    </span>
                  </div>
                </div>

                <p className="text-white/60 font-sans text-xs line-clamp-2 italic">
                  "{src.excerpt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
