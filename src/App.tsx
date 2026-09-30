import React, { useState } from 'react';
import { Navbar } from './components/aura/Navbar';
import { Hero } from './components/aura/Hero';
import { MacMenuBar } from './components/aura/MacMenuBar';
import { InboxMockup } from './components/aura/InboxMockup';
import { FeatureTriage } from './components/aura/FeatureTriage';
import { LogoCloud } from './components/aura/LogoCloud';
import { Testimonials } from './components/aura/Testimonials';
import { Pricing } from './components/aura/Pricing';
import { FinalCTA } from './components/aura/FinalCTA';
import { RiptideConsole } from './components/rag/RiptideConsole';
import { Mic, ShieldCheck, X } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<'aura' | 'riptide'>('aura');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Global Background Video (Fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />
      </div>

      {/* Fixed Vertical Guide Lines at 36rem Container Edges */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Main Navbar */}
      <Navbar
        onOpenRiptide={() => setActiveView('riptide')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* View Switcher: Aura Landing vs RIPTIDE Zero-Trust Console */}
      {activeView === 'aura' ? (
        <main className="relative z-10 flex flex-col">
          {/* Section 2 — Hero */}
          <Hero />

          {/* Section 3 — macOS Menu Bar Strip */}
          <MacMenuBar />

          {/* Section 4 — Realistic Inbox Mockup */}
          <InboxMockup onOpenVoiceRAG={() => setActiveView('riptide')} />

          {/* Section 5 — FeatureTriage */}
          <FeatureTriage />

          {/* Section 6 — LogoCloud */}
          <LogoCloud />

          {/* Section 7 — Testimonials */}
          <Testimonials />

          {/* Section 8 — Pricing */}
          <Pricing />

          {/* Section 9 — FinalCTA */}
          <FinalCTA />

          {/* Floating Action Trigger for RIPTIDE Voice Assistant */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setActiveView('riptide')}
              className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#091020] via-[#0B2551] to-[#00d2ff] border border-[#00d2ff]/50 text-white font-mono text-xs font-semibold shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4 text-[#A4F4FD] group-hover:animate-pulse" />
              <span>RIPTIDE VOICE RAG</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            </button>
          </div>
        </main>
      ) : (
        <main className="relative z-10">
          <RiptideConsole onSwitchToAura={() => setActiveView('aura')} />
        </main>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 text-center text-xs text-white/40 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
            <span>RIPTIDE — Zero-Trust Voice RAG Assistant & Aura Platform</span>
          </div>
          <div>Enron 10,000+ Email Corpus · Web Speech API · Structure-Aware Dynamic Chunking</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
