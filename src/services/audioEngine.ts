import { GridPosition } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private activeOscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private currentVolume: number = 0.8;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentVolume;
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
    }
  }

  public setMasterVolume(volumePercent: number) {
    this.currentVolume = volumePercent / 100;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getContext(): AudioContext {
    this.init();
    return this.ctx!;
  }

  public async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public stopAll() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
    });
    this.activeOscillators = [];
  }

  private getFrequency(row: string): number {
    // Arcade chime frequencies (higher, brighter)
    switch (row) {
      case 'A': return 1046.50; // C6 (Top row)
      case 'B': return 880.00;  // A5 (Middle row)
      case 'C': return 659.25;  // E5 (Bottom row)
      default: return 440;
    }
  }

  private getPan(col: string): number {
    switch (col) {
      case '1': return -0.8; // Left
      case '2': return 0;    // Center
      case '3': return 0.8;  // Right
      default: return 0;
    }
  }

  public scheduleTone(position: GridPosition, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const row = position.charAt(0);
    const col = position.charAt(1);

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();

    // Digital chime sound
    osc.type = 'sine';
    osc.frequency.value = this.getFrequency(row);

    panner.pan.value = this.getPan(col);

    // Pluck envelope (fast attack, exponential decay)
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.6, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.4);
    
    this.activeOscillators.push(osc);
    
    // Clean up reference after it finishes
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
    }, (time - this.ctx.currentTime + 0.5) * 1000);
  }

  public scheduleCountdown(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'square';
    // Higher pitch for "Go" (0), lower for 3, 2, 1
    osc.frequency.value = step === 0 ? 880 : 440;
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.15);
  }

  public playError() {
    if (!this.ctx || !this.masterGain) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.3);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.3);
  }
}

export const audioEngine = new AudioEngine();
