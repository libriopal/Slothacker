import { GridPosition } from '../types';

export interface AudioFeatureVector {
  frequencyHz: number;
  pan: number; // -1.0 (Left) to 1.0 (Right)
  amplitude: number;
}

class PsychoacousticAnalyzer {
  private context: AudioContext | null = null;
  private analyserL: AnalyserNode | null = null;
  private analyserR: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private isRunning = false;

  async initialize() {
    if (this.context) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 2,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });

      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.context.createMediaStreamSource(this.stream);

      // High-pass filter to remove arcade rumble (< 300Hz)
      const highPass = this.context.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 300;

      // Split stereo channels to calculate Pan
      const splitter = this.context.createChannelSplitter(2);
      
      this.analyserL = this.context.createAnalyser();
      this.analyserR = this.context.createAnalyser();
      
      this.analyserL.fftSize = 2048;
      this.analyserR.fftSize = 2048;

      source.connect(highPass);
      highPass.connect(splitter);
      splitter.connect(this.analyserL, 0);
      splitter.connect(this.analyserR, 1);

      this.isRunning = true;
    } catch (err) {
      // Suppress console error for permission denied to avoid cluttering the console
      throw err;
    }
  }

  analyzeFrame(): AudioFeatureVector | null {
    if (!this.isRunning || !this.analyserL || !this.analyserR || !this.context) return null;

    const bufferLength = this.analyserL.frequencyBinCount;
    const dataL = new Float32Array(bufferLength);
    const dataR = new Float32Array(bufferLength);
    
    this.analyserL.getFloatFrequencyData(dataL);
    this.analyserR.getFloatFrequencyData(dataR);

    let maxAmpL = -Infinity;
    let maxAmpR = -Infinity;
    let peakIndexL = 0;

    for (let i = 0; i < bufferLength; i++) {
      if (dataL[i] > maxAmpL) {
        maxAmpL = dataL[i];
        peakIndexL = i;
      }
      if (dataR[i] > maxAmpR) {
        maxAmpR = dataR[i];
      }
    }

    // Convert dB to linear amplitude for easier thresholding
    const linearAmpL = Math.pow(10, maxAmpL / 20);
    const linearAmpR = Math.pow(10, maxAmpR / 20);
    const totalAmp = linearAmpL + linearAmpR;

    if (totalAmp < 0.05) { // Noise floor threshold
      return null;
    }

    // Calculate Pan (-1.0 to 1.0)
    // If mono mic, L and R will be equal, pan = 0.
    let pan = 0;
    if (totalAmp > 0) {
      pan = (linearAmpR - linearAmpL) / totalAmp;
    }

    const nyquist = this.context.sampleRate / 2;
    const frequencyHz = (peakIndexL / bufferLength) * nyquist;

    return {
      frequencyHz,
      pan,
      amplitude: totalAmp
    };
  }

  resolveGridPosition(features: AudioFeatureVector): GridPosition | null {
    let col = '';
    let row = '';

    // Horizontal (Column) via Panning
    // Note: In browser environments without true stereo mics, this might default to Center.
    // We use generous thresholds.
    if (features.pan < -0.3) col = 'A';
    else if (features.pan > 0.3) col = 'C';
    else col = 'B';

    // Vertical (Row) via Pitch
    // High (A5-D6) ~880-1174Hz -> Row 1
    // Mid (E5-A5) ~659-880Hz -> Row 2
    // Low (C4-E4) ~261-329Hz -> Row 3
    if (features.frequencyHz > 850) row = '1';
    else if (features.frequencyHz > 500 && features.frequencyHz <= 850) row = '2';
    else if (features.frequencyHz > 200 && features.frequencyHz <= 500) row = '3';

    if (col && row) {
      return `${col}${row}` as GridPosition;
    }
    return null;
  }

  stop() {
    this.isRunning = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}

export const psychoAnalyzer = new PsychoacousticAnalyzer();
