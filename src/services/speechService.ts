export type SpeechCallback = (transcript: string) => void;
export type ErrorCallback = (error: string) => void;

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback: SpeechCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private onEndCallback: () => void = () => {};

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        if (this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEndCallback();
      };
    }
  }

  public start(onResult: SpeechCallback, onError: ErrorCallback, onEnd: () => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }
    
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    if (!this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public normalizeInput(transcript: string): string[] {
    // Clean transcript: uppercase, remove spaces
    const clean = transcript.toUpperCase().replace(/\s+/g, '');
    
    // Extract all valid grid tokens (A1-C3)
    const regex = /([A-C][1-3])/g;
    const matches = clean.match(regex);
    
    return matches || [];
  }
  
  public isCommand(transcript: string, command: string): boolean {
    return transcript.toLowerCase().includes(command.toLowerCase());
  }
}

export const speechService = new SpeechService();
