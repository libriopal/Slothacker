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
    A1: { symbol: '1bar', color: 'orange' },
    A2: { symbol: '2bar', color: 'orange' },
    A3: { symbol: '3bar', color: 'orange' },
    B1: { symbol: 'plumb', color: 'purple' },
    B2: { symbol: '$', color: 'green' },
    B3: { symbol: 'cherries', color: 'red' },
    C1: { symbol: 'melon', color: 'green' },
    C2: { symbol: '7', color: 'red' },
    C3: { symbol: 'bell', color: 'orange' },
  },
  
  audioLock: false,
  signalClean: false,
  autoCaptureMode: false, // Default to false to prevent auto-prompting microphone on load
  lastDetectedTone: null,
  audioError: null,

  isPaused: false,
  customTempo: 1200,

  isSettingsOpen: false,
  volume: 80,
  crtEffect: true,
  showGridLabels: true,

  stats: {
    accuracy: 100,
    timingError: 0,
  },

  setRound: (round) => set({ round: Math.max(1, Math.min(18, round)) }),
  addToBuffer: (pos) => set((state) => ({ inputBuffer: [...state.inputBuffer, pos] })),
  removeFromBuffer: (index) => set((state) => ({ 
    inputBuffer: state.inputBuffer.filter((_, i) => i !== index) 
  })),
  undoLastInput: () => set((state) => ({ inputBuffer: state.inputBuffer.slice(0, -1) })),
  clearBuffer: () => set({ inputBuffer: [], round: 1, isPaused: false }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackStepIndex: (playbackStepIndex) => set({ playbackStepIndex }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setCustomTempo: (customTempo) => set({ customTempo }),

  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setVolume: (volume) => set({ volume }),
  setCrtEffect: (crtEffect) => set({ crtEffect }),
  setShowGridLabels: (showGridLabels) => set({ showGridLabels }),
  
  setCameraSetupComplete: (cameraSetupComplete) => set({ cameraSetupComplete }),
  setGridData: (gridData) => set({ gridData }),
  
  setAudioLock: (audioLock) => set({ audioLock }),
  setSignalClean: (signalClean) => set({ signalClean }),
  toggleAutoCapture: () => set((state) => ({ autoCaptureMode: !state.autoCaptureMode })),
  setLastDetectedTone: (lastDetectedTone) => set({ lastDetectedTone }),
  setAudioError: (audioError) => set({ audioError }),

  updateStats: (accuracy, timingError) => set({ stats: { accuracy, timingError } }),
}));
