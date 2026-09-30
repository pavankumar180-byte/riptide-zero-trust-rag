export type SpeechState = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

export interface VoiceRecognitionCallbacks {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onStateChange: (state: SpeechState, errorMessage?: string) => void;
}

export class VoiceRecognitionManager {
  private recognition: any = null;
  private state: SpeechState = 'idle';
  private callbacks: VoiceRecognitionCallbacks | null = null;
  private isBrowserSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      if (SpeechRecognition) {
        this.isBrowserSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupHandlers();
      } else {
        this.isBrowserSupported = false;
        this.state = 'unsupported';
      }
    }
  }

  public isSupported(): boolean {
    return this.isBrowserSupported;
  }

  public getState(): SpeechState {
    return this.state;
  }

  public setCallbacks(callbacks: VoiceRecognitionCallbacks) {
    this.callbacks = callbacks;
  }

  private setupHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.state = 'listening';
      this.callbacks?.onStateChange('listening');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const activeTranscript = finalTranscript || interimTranscript;
      if (activeTranscript) {
        this.callbacks?.onTranscript(activeTranscript, Boolean(finalTranscript));
      }
    };

    this.recognition.onerror = (event: any) => {
      const err = event.error || 'Unknown voice error';
      this.state = 'error';
      let message = 'Speech recognition error';
      if (err === 'not-allowed') {
        message = 'Microphone permission denied. Please allow microphone access or use typed query fallback.';
      } else if (err === 'no-speech') {
        message = 'No speech detected. Please speak into your microphone.';
      }
      this.callbacks?.onStateChange('error', message);
    };

    this.recognition.onend = () => {
      if (this.state === 'listening') {
        this.state = 'idle';
        this.callbacks?.onStateChange('idle');
      }
    };
  }

  public startListening() {
    if (!this.isBrowserSupported || !this.recognition) {
      this.callbacks?.onStateChange('unsupported', 'Web Speech API is not supported in this browser. Please use typed input.');
      return;
    }

    try {
      this.state = 'listening';
      this.recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
    }
  }

  public stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
      this.state = 'idle';
      this.callbacks?.onStateChange('idle');
    } catch (err) {
      console.warn('SpeechRecognition stop error:', err);
    }
  }
}

export const voiceManager = new VoiceRecognitionManager();
