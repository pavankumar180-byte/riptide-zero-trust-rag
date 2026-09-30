import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Sparkles, Database, FileCheck, Terminal, Cpu, Info } from 'lucide-react';
import { VoiceInput } from '../voice/VoiceInput';
import { SecurityPipelineStatus } from '../security/SecurityPipelineStatus';
import { ChunkInspector } from '../security/ChunkInspector';
import { AttackDemoPanel } from '../security/AttackDemoPanel';
import { AnswerView } from './AnswerView';
import { processZeroTrustQuery } from '../../lib/rag/engine';
import { trustScoreManager } from '../../lib/trustScore';
import { vectorStore } from '../../lib/rag/vectorStore';
import { RAGResult, TrustScoreState, AttackDemoPreset } from '../../types';

interface RiptideConsoleProps {
  onSwitchToAura?: () => void;
}

export const RiptideConsole: React.FC<RiptideConsoleProps> = ({ onSwitchToAura }) => {
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<RAGResult | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScoreState>(trustScoreManager.getState());
  const indexStatus = vectorStore.getIndexStatus();

  useEffect(() => {
    const unsubscribe = trustScoreManager.subscribe(state => {
      setTrustScore(state);
    });
    return unsubscribe;
  }, []);

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await processZeroTrustQuery(queryText);
      setLastResult(result);
    } catch (err) {
      console.error('Zero-Trust RAG execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: AttackDemoPreset) => {
    setActiveQuery(preset.prompt);
    handleSearch(preset.prompt);
  };

  return (
    <div className="relative z-10 w-full min-h-screen py-10 px-4 md:px-8 flex flex-col items-center">
      {/* Header Banner */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-[#00d2ff]" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono">
              RIPTIDE
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30">
              ZERO-TRUST VOICE RAG
            </span>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Trust Nothing By Default · Untrusted Speech · Untrusted Documents · Sanitized LLM Output
          </p>
        </div>

        {/* Index Status & Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="text-white/50">ENRON ARCHIVE:</span>
            <span className="text-[#A4F4FD] font-bold">10,482 Emails</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              DEMO DATA READY
            </span>
          </div>

          {onSwitchToAura && (
            <button
              onClick={onSwitchToAura}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition-colors"
            >
              Switch to Aura Landing
            </button>
          )}
        </div>
      </div>

      {/* Voice Input & Interactive Search Box */}
      <VoiceInput
        onSearch={handleSearch}
        isLoading={isLoading}
        activeQuery={activeQuery}
        setActiveQuery={setActiveQuery}
      />

      {/* Real-time Security Pipeline Gate Visualizer */}
      <SecurityPipelineStatus
        lastResult={lastResult}
        trustScore={trustScore}
        onResetTrustScore={() => trustScoreManager.resetScore()}
      />

      {/* Answer View & Grounded Sources */}
      <AnswerView
        result={lastResult}
        isLoading={isLoading}
      />

      {/* Expandable Structure-Aware Chunk Inspector */}
      {lastResult && lastResult.sources.length > 0 && (
        <ChunkInspector sources={lastResult.sources} />
      )}

      {/* Attack Demo & Security Testbed for Judges */}
      <AttackDemoPanel
        onSelectPreset={handleSelectPreset}
        isLoading={isLoading}
      />

      {/* Zero-Trust Architecture Guarantee Card */}
      <div className="w-full max-w-5xl my-8 p-5 rounded-2xl border border-white/10 bg-black/40 text-xs font-mono text-white/60 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Info className="w-4 h-4 text-[#00d2ff]" />
          <span>ZERO-TRUST SECURITY INVARIANTS IN ENFORCEMENT</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-white font-bold block mb-1">1. Untrusted Voice</span>
            Spoken speech parsed via Web Speech API is quarantined & scanned for prompt injection before any LLM contact.
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-white font-bold block mb-1">2. Untrusted Retrieval</span>
            Email chunks are dynamic structure-aware parsed and checked for embedded instructions before context inclusion.
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-white font-bold block mb-1">3. Untrusted Output</span>
            All generated answers pass through the post-generation PII Guard to redact phone numbers, emails, and identifiers.
          </div>
        </div>
      </div>
    </div>
  );
};
