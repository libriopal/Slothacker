import { create } from 'zustand';
import { AppState, GridPosition } from '../types';

export const useStore = create<AppState>((set) => ({
  round: 1,
  currentSequence: [],
  inputBuffer: [],
  isListening: false,
  isPlaying: false,
  tempoMultiplier: 1.0,
  godMode: false,
  stats: {
    accuracy: 100,
    timingError: 0,
  },

  setRound: (round) => set({ round: Math.max(1, Math.min(18, round)) }),
  addToBuffer: (pos) => set((state) => ({ inputBuffer: [...state.inputBuffer, pos] })),
  removeFromBuffer: (index) => set((state) => ({ 
    inputBuffer: state.inputBuffer.filter((_, i) => i !== index) 
  })),
  clearBuffer: () => set({ inputBuffer: [] }),
  setIsListening: (isListening) => set({ isListening }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setTempoMultiplier: (tempoMultiplier) => set({ tempoMultiplier }),
  toggleGodMode: () => set((state) => ({ godMode: !state.godMode })),
  updateStats: (accuracy, timingError) => set({ stats: { accuracy, timingError } }),
}));
