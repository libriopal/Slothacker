export type GridRow = "A" | "B" | "C";
export type GridCol = "1" | "2" | "3";
export type GridPosition = `${GridRow}${GridCol}`;

export interface Step {
  position: GridPosition;
  delay: number; // ms delay before this step
}

export interface AppState {
  round: number;
  currentSequence: Step[];
  inputBuffer: GridPosition[];
  isListening: boolean;
  isPlaying: boolean;
  tempoMultiplier: number;
  godMode: boolean;
  stats: {
    accuracy: number;
    timingError: number;
  };
  
  // Actions
  setRound: (round: number) => void;
  addToBuffer: (pos: GridPosition) => void;
  removeFromBuffer: (index: number) => void;
  clearBuffer: () => void;
  setIsListening: (isListening: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setTempoMultiplier: (multiplier: number) => void;
  toggleGodMode: () => void;
  updateStats: (accuracy: number, timingError: number) => void;
}
