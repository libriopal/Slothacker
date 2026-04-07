export type GridRow = "A" | "B" | "C";
export type GridCol = "1" | "2" | "3";
export type GridPosition = `${GridRow}${GridCol}`;

export type SymbolType = '1bar' | '2bar' | '2bar2' | '3bar' | 'cherries' | 'plumb' | 'bell' | 'melon' | '7' | '$';
export type GlowColor = 'red' | 'blue' | 'green' | 'gray' | 'orange' | 'purple';

export interface GridCellData {
  symbol: SymbolType;
  color: GlowColor;
}

export interface Step {
  position: GridPosition;
  delay: number; // ms delay before this step
}

export interface AppState {
  round: number;
  currentSequence: Step[];
  inputBuffer: GridPosition[];
  isPlaying: boolean;
  playbackStepIndex: number;
  
  cameraSetupComplete: boolean;
  gridData: Record<GridPosition, GridCellData | null>;
  
  // Audio Intelligence State
  audioLock: boolean;
  signalClean: boolean;
  autoCaptureMode: boolean;
  lastDetectedTone: string | null;
  audioError: string | null;
  
  isPaused: boolean;
  customTempo: number;
  
  // New Settings
  isSettingsOpen: boolean;
  volume: number;
  crtEffect: boolean;
  showGridLabels: boolean;
  
  stats: {
    accuracy: number;
    timingError: number;
  };
  
  // Actions
  setRound: (round: number) => void;
  addToBuffer: (pos: GridPosition) => void;
  removeFromBuffer: (index: number) => void;
  undoLastInput: () => void;
  clearBuffer: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackStepIndex: (index: number) => void;
  setIsPaused: (isPaused: boolean) => void;
  setCustomTempo: (tempo: number) => void;
  
  setIsSettingsOpen: (isOpen: boolean) => void;
  setVolume: (volume: number) => void;
  setCrtEffect: (enabled: boolean) => void;
  setShowGridLabels: (show: boolean) => void;
  
  setCameraSetupComplete: (complete: boolean) => void;
  setGridData: (data: Record<GridPosition, GridCellData | null>) => void;
  
  // Audio Intelligence Actions
  setAudioLock: (locked: boolean) => void;
  setSignalClean: (clean: boolean) => void;
  toggleAutoCapture: () => void;
  setLastDetectedTone: (tone: string | null) => void;
  setAudioError: (error: string | null) => void;
  
  updateStats: (accuracy: number, timingError: number) => void;
}
