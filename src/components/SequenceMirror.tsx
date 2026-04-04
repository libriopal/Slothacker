import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { GridPosition, SymbolType, GlowColor } from '../types';
import { LayoutGrid, AlertCircle } from 'lucide-react';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { SlotIcon, SlotIconType } from './SlotIcon';

const GRID_COLS = ['A', 'B', 'C'];
const GRID_ROWS = ['1', '2', '3'];

const GLOW_COLORS: Record<GlowColor, string> = {
  red: 'rgba(239, 68, 68, 0.8)',
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(16, 185, 129, 0.8)',
  gray: 'rgba(156, 163, 175, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
  purple: 'rgba(168, 85, 247, 0.8)',
};

const mapSymbolToSlotIcon = (symbol: SymbolType): SlotIconType => {
  switch (symbol) {
    case '1BAR': return 'Single Bar';
    case '2BARS': return 'Double Bar';
    case '3BARS': return 'Triple Bar';
    case 'Cherries': return 'Cherries';
    case 'Bell': return 'Bell';
    case 'Plum': return 'Plum';
    case '7': return '7';
    case '$': return 'Dollar';
    default: return 'Single Bar'; // Fallback
  }
};

export const SequenceMirror: React.FC = () => {
  const { round, inputBuffer, playbackStepIndex, isPlaying, isPaused, addToBuffer, setRound, gridData, setIsPaused } = useStore();
  const { playSequence } = useAudioPlayback();
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);

  // Show waiting popup when playback finishes or at start
  useEffect(() => {
    if (!isPlaying && !isPaused && inputBuffer.length < round) {
      setShowWaitingPopup(true);
    } else {
      setShowWaitingPopup(false);
    }
  }, [isPlaying, isPaused, inputBuffer.length, round]);

  const handleCellClick = (pos: GridPosition) => {
    if (isPlaying || isPaused) return;
    
    addToBuffer(pos);
    
    // If we reached the end of the round, increment round
    if (inputBuffer.length + 1 >= round) {
      setRound(round + 1);
    }
    
    // Pause the game to allow the user to review/unpause
    setIsPaused(true);
  };

  const activePosition = isPlaying && playbackStepIndex >= 0 ? inputBuffer[playbackStepIndex] : null;
  const nextInput = !isPlaying && inputBuffer.length > 0 ? '?' : (activePosition || '--');

  // UI color changes based on state
  const containerBorderColor = showWaitingPopup ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.1)]';
  const titleColor = showWaitingPopup ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className={`retro-container p-8 w-full bg-slate-900/90 transition-all duration-500 relative ${containerBorderColor} ${isPaused ? 'grayscale opacity-50' : ''}`}>
      <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
        <LayoutGrid className={`w-10 h-10 ${titleColor} drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors duration-500`} />
        <h3 className="retro-title text-3xl text-center">ADAPTIVE SEQUENCE MIRROR</h3>
      </div>

      <div className="flex justify-between items-center mb-8 border-b-4 border-slate-700 pb-4 relative z-10">
        <div className="retro-text text-amber-400 text-3xl">ROUND: {round}</div>
        <div className="retro-text text-emerald-400 text-3xl">
          STEP: {isPlaying ? Math.max(0, playbackStepIndex) + 1 : inputBuffer.length + 1} / {round}
        </div>
      </div>

      {showWaitingPopup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-emerald-900/95 border-4 border-emerald-400 p-6 rounded-xl shadow-[0_0_100px_rgba(16,185,129,0.8)] flex flex-col items-center animate-pulse pointer-events-none">
          <AlertCircle className="w-16 h-16 text-emerald-400 mb-4" />
          <h2 className="retro-title text-3xl text-emerald-100 text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">WAITING FOR INPUT</h2>
          <p className="text-emerald-300 font-mono mt-2 text-center text-lg">
            {inputBuffer.length === 0 ? "Tap the first symbol to start!" : "Tap the next symbol in the pattern!"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
        {GRID_ROWS.map(row => (
          GRID_COLS.map(col => {
            const pos = `${col}${row}` as GridPosition;
            const isActive = activePosition === pos;
            const cellData = gridData[pos];
            const hasSymbol = !!cellData;
            
            let bgClass = 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700 hover:border-slate-500 hover:text-slate-300';
            let symbolStyle = {};

            if (isActive) {
              if (hasSymbol) {
                // 70% more transparent background glow (bg-amber-400/30 instead of bg-amber-400)
                bgClass = 'bg-amber-400/30 border-amber-200/50 text-white scale-105 z-10';
                symbolStyle = {
                  textShadow: `0 0 20px ${GLOW_COLORS[cellData.color]}, 0 0 40px ${GLOW_COLORS[cellData.color]}`
                };
              } else {
                // Normal glow
                bgClass = 'bg-amber-400 border-amber-200 text-slate-900 shadow-[0_0_50px_rgba(251,191,36,1)] scale-105 z-10';
              }
            } else if (showWaitingPopup) {
               bgClass += ' hover:bg-emerald-900/50 hover:border-emerald-500 hover:text-emerald-300';
            }

            return (
              <button
                key={pos}
                onClick={() => handleCellClick(pos)}
                disabled={isPlaying || isPaused}
                className={`h-32 md:h-48 rounded-xl border-4 transition-all duration-100 flex items-center justify-center text-5xl md:text-7xl font-bold retro-text relative overflow-hidden
                  ${bgClass}
                  ${isPlaying && !isActive ? 'opacity-30' : 'opacity-100'}
                `}
              >
                {hasSymbol ? (
                  <div style={symbolStyle} className="w-24 h-24 md:w-32 md:h-32 filter drop-shadow-md flex items-center justify-center">
                    <SlotIcon 
                      iconType={mapSymbolToSlotIcon(cellData.symbol)} 
                      size={96} 
                      className="w-full h-full" 
                      treatPinkAsTransparent={true}
                    />
                  </div>
                ) : (
                  pos
                )}
              </button>
            );
          })
        ))}
      </div>

      <div className="bg-black/50 p-6 border-4 border-slate-800 flex justify-between items-center rounded-lg relative z-10">
        <span className="retro-text text-slate-500 text-2xl">NEXT INPUT:</span>
        <span className={`retro-text text-4xl ${showWaitingPopup ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>
          {nextInput}
        </span>
      </div>
    </div>
  );
};
