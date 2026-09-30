import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, EyeOff, Activity, RefreshCw } from 'lucide-react';
import { RAGResult, TrustScoreState } from '../../types';

interface SecurityPipelineStatusProps {
  lastResult: RAGResult | null;
  trustScore: TrustScoreState;
  onResetTrustScore: () => void;
}

export const SecurityPipelineStatus: React.FC<SecurityPipelineStatusProps> = ({
  lastResult,
  trustScore,
  onResetTrustScore
}) => {
  const queryRisk = lastResult ? lastResult.query_security.risk_score : 0;
  const isQueryBlocked = lastResult ? lastResult.query_security.status === 'BLOCKED' : false;
  
  const totalRetrieved = lastResult ? lastResult.retrieved_chunks.length : 0;
  const quarantinedCount = lastResult ? lastResult.quarantined_chunks_count : 0;
  const safeRetrievedCount = lastResult ? lastResult.safe_chunks_count : 0;

  const piiLeaks = lastResult ? lastResult.pii_guard.leaks_detected : 0;

  // Trust score status colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10';
    if (score >= 50) return 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10';
    return 'text-[#ff3366] border-[#ff3366]/40 bg-[#ff3366]/10';
  };

  const getMeterColor = (score: number) => {
    if (score >= 80) return 'bg-[#10b981]';
    if (score >= 50) return 'bg-[#f59e0b]';
    return 'bg-[#ff3366]';
  };

  return (
    <div className="w-full max-w-5xl my-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00d2ff]" />
          <h2 className="text-xs uppercase font-mono tracking-widest text-white/70">
            Real-Time Zero-Trust Security Pipeline
          </h2>
        </div>

        {/* Live Trust Score Meter Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-black/40 text-xs font-mono">
            <span className="text-white/50">TRUST SCORE:</span>
            <span className="font-bold text-white">{trustScore.score}/100</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getScoreColor(trustScore.score)}`}>
              {trustScore.status}
            </span>
          </div>
          <button
            onClick={onResetTrustScore}
            title="Reset Trust Score to 100"
            className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Trust Score Progress Line */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-500 ${getMeterColor(trustScore.score)}`}
          style={{ width: `${trustScore.score}%` }}
        />
      </div>

      {/* 4 Pipeline Gate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gate 1: Query Security */}
        <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
          isQueryBlocked 
            ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_20px_rgba(255,51,102,0.15)]' 
            : 'bg-black/40 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Gate 1: Query</span>
            <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
            {queryRisk}% <span className="text-xs font-normal text-white/40">Risk</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {isQueryBlocked ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff3366]" />
                <span className="text-[#ff3366] font-bold">BLOCKED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#10b981]">✓ SAFE</span>
              </>
            )}
          </div>
          {lastResult && (
            <p className="mt-2 text-[11px] text-white/40 line-clamp-2 leading-tight">
              {lastResult.query_security.reason}
            </p>
          )}
        </div>

        {/* Gate 2: Retrieval Security */}
        <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
          quarantinedCount > 0 
            ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
            : 'bg-black/40 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Gate 2: Retrieval</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#00d2ff]" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
            {totalRetrieved} <span className="text-xs font-normal text-white/40">Chunks</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            {quarantinedCount > 0 ? (
              <span className="text-[#f59e0b] font-bold">
                {quarantinedCount} quarantined
              </span>
            ) : (
              <span className="text-[#10b981]">
                {safeRetrievedCount > 0 ? `${safeRetrievedCount} verified safe` : '0 quarantined'}
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-white/40 leading-tight">
            Scans each chunk before LLM injection gate.
          </p>
        </div>

        {/* Gate 3: PII Leak Guard */}
        <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
          piiLeaks > 0 
            ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_20px_rgba(0,210,255,0.15)]' 
            : 'bg-black/40 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Gate 3: PII Guard</span>
            <EyeOff className="w-3.5 h-3.5 text-[#00d2ff]" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
            {piiLeaks} <span className="text-xs font-normal text-white/40">Leaks</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {piiLeaks > 0 ? (
              <span className="text-[#00d2ff] font-bold">
                ✓ {piiLeaks} REDACTED
              </span>
            ) : (
              <span className="text-[#10b981]">
                ✓ SAFE (0 Leaks)
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-white/40 leading-tight">
            Regex sanitization of emails, phones, SSNs.
          </p>
        </div>

        {/* Gate 4: Grounding (Cite or Refuse) */}
        <div className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="font-mono uppercase text-[11px] tracking-wider">Gate 4: Grounding</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
            {lastResult ? (lastResult.evidence_grounded ? 'GROUNDED' : 'REFUSED') : 'READY'}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/70">
            {lastResult ? (
              lastResult.evidence_grounded ? (
                <span className="text-[#10b981]">✓ Sources Cited</span>
              ) : (
                <span className="text-amber-400">Anti-Hallucination</span>
              )
            ) : (
              <span className="text-white/40">Archive Standby</span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-white/40 leading-tight">
            Refuses to guess if evidence is insufficient.
          </p>
        </div>
      </div>
    </div>
  );
};
