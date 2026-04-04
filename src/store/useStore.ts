import { create } from 'zustand';
import { AppState, GridPosition } from '../types';

export const useStore = create<AppState>((set) => ({
  round: 1,
  currentSequence: [],
  inputBuffer: [],
  isPlaying: false,
  playbackStepIndex: -1,
  
  cameraSetupComplete: false,
  gridData: {
    A1: null, B1: null, C1: null,
    A2: null, B2: null, C2: null,
    A3: null, B3: null, C3: null,
  },
  
  audioLock: false,
  signalClean: false,
  autoCaptureMode: false, // Default to false to prevent auto-prompting microphone on load
  lastDetectedTone: null,
  audioError: null,

  isPaused: false,
  customTempo: 600,

  stats: {
    accuracy: 100,
    timingError: 0,
  },

  setRound: (round) => set({ round: Math.max(1, Math.min(18, round)) }),
  addToBuffer: (pos) => set((state) => ({ inputBuffer: [...state.inputBuffer, pos] })),
  removeFromBuffer: (index) => set((state) => ({ 
    inputBuffer: state.inputBuffer.filter((_, i) => i !== index) 
  })),
  clearBuffer: () => set({ inputBuffer: [], round: 1, isPaused: false }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackStepIndex: (playbackStepIndex) => set({ playbackStepIndex }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setCustomTempo: (customTempo) => set({ customTempo }),
  
  setCameraSetupComplete: (cameraSetupComplete) => set({ cameraSetupComplete }),
  setGridData: (gridData) => set({ gridData }),
  
  setAudioLock: (audioLock) => set({ audioLock }),
  setSignalClean: (signalClean) => set({ signalClean }),
  toggleAutoCapture: () => set((state) => ({ autoCaptureMode: !state.autoCaptureMode })),
  setLastDetectedTone: (lastDetectedTone) => set({ lastDetectedTone }),
  setAudioError: (audioError) => set({ audioError }),

  updateStats: (accuracy, timingError) => set({ stats: { accuracy, timingError } }),
}));
