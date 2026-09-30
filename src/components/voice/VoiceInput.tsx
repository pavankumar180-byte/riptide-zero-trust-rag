import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, ShieldAlert, Radio } from 'lucide-react';
import { voiceManager, SpeechState } from '../../lib/voice/speechRecognition';

interface VoiceInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeQuery: string;
  setActiveQuery: (query: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onSearch,
  isLoading,
  activeQuery,
  setActiveQuery
}) => {
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  useEffect(() => {
    voiceManager.setCallbacks({
      onTranscript: (text: string, isFinal: boolean) => {
        if (isFinal) {
          setActiveQuery(text);
          setInterimTranscript('');
        } else {
          setInterimTranscript(text);
        }
      },
      onStateChange: (state: SpeechState, msg?: string) => {
        setSpeechState(state);
        if (msg) {
          setErrorMessage(msg);
        } else {
          setErrorMessage(null);
        }
      }
    });
  }, [setActiveQuery]);

  const toggleListening = () => {
    if (speechState === 'listening') {
      voiceManager.stopListening();
    } else {
      setErrorMessage(null);
      voiceManager.startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuery.trim() && !isLoading) {
      if (speechState === 'listening') {
        voiceManager.stopListening();
      }
      onSearch(activeQuery.trim());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Large Microphone Action Area */}
      <div className="relative my-6 flex flex-col items-center">
        {/* Animated Ripple Waves when Listening */}
        {speechState === 'listening' && (
          <>
            <div className="absolute -inset-4 rounded-full bg-[#00d2ff]/20 animate-ping pointer-events-none" />
            <div className="absolute -inset-8 rounded-full bg-[#00d2ff]/10 animate-pulse pointer-events-none" />
          </>
        )}

        <button
          onClick={toggleListening}
          disabled={isLoading}
          aria-label={speechState === 'listening' ? 'Stop Listening' : 'Start Voice Input'}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
            speechState === 'listening'
              ? 'bg-gradient-to-tr from-[#ff3366] to-[#ff6b8b] text-white shadow-[0_0_40px_rgba(255,51,102,0.6)]'
              : 'bg-gradient-to-tr from-[#091020] via-[#0B2551] to-[#00d2ff] text-white hover:shadow-[0_0_35px_rgba(0,210,255,0.4)] border border-[#00d2ff]/40'
          }`}
        >
          {speechState === 'listening' ? (
            <>
              <Radio className="w-8 h-8 animate-pulse text-white" />
              <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-8 h-8 text-[#A4F4FD] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase font-semibold tracking-wider text-white/70 mt-1">Hold / Tap</span>
            </>
          )}
        </button>

        <span className="mt-3 text-xs uppercase font-mono tracking-widest text-[#00d2ff]/80">
          {speechState === 'listening' ? '● STREAMING AUDIO VIA WEB SPEECH API' : 'VOICE-OPERATED ENRON ARCHIVE SEARCH'}
        </span>
      </div>

      {/* Real-time speech transcription indicator */}
      {(interimTranscript || speechState === 'listening') && (
        <div className="w-full max-w-2xl px-4 py-2 mb-3 rounded-lg bg-black/40 border border-[#00d2ff]/30 text-center text-sm font-mono text-[#A4F4FD] animate-pulse">
          <span className="text-white/40 mr-2">[Live Transcript]:</span>
          "{interimTranscript || 'Listening for speech...'}"
        </div>
      )}

      {/* Permission / error message */}
      {errorMessage && (
        <div className="w-full max-w-2xl flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Typed Query Fallback Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl relative">
        <div className="relative flex items-center rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl focus-within:border-[#00d2ff] focus-within:shadow-[0_0_30px_rgba(0,210,255,0.2)] transition-all">
          <input
            type="text"
            value={activeQuery}
            onChange={(e) => setActiveQuery(e.target.value)}
            placeholder='Ask about Enron executive budgets, power grids, or tap mic to speak...'
            className="w-full bg-transparent px-5 py-4 text-sm md:text-base text-white placeholder-white/35 focus:outline-none font-sans"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!activeQuery.trim() || isLoading}
            className="mr-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#3D81E3] text-black font-semibold text-xs md:text-sm tracking-wide flex items-center gap-2 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                Scanning...
              </span>
            ) : (
              <>
                <span>ASK RIPTIDE</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
