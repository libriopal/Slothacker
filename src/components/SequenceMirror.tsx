import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { GridPosition, SymbolType, GlowColor } from '../types';
import { LayoutGrid, AlertCircle } from 'lucide-react';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { SymbolGenerator } from './SymbolGenerator';

const GRID_ROWS = ['A', 'B', 'C'];
const GRID_COLS = ['1', '2', '3'];

const GLOW_COLORS: Record<GlowColor, string> = {
  red: 'rgba(239, 68, 68, 0.8)',
  blue: 'rgba(59, 130, 246, 0.8)',
  green: 'rgba(16, 185, 129, 0.8)',
  gray: 'rgba(156, 163, 175, 0.8)',
  orange: 'rgba(249, 115, 22, 0.8)',
  purple: 'rgba(168, 85, 247, 0.8)',
};

export const SequenceMirror: React.FC = () => {
  const { round, inputBuffer, playbackStepIndex, isPlaying, isPaused, addToBuffer, gridData, showGridLabels } = useStore();
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
    
    // Play the sequence with the new buffer (no auto-pause)
    playSequence([...inputBuffer, pos]);
  };

  const activePosition = isPlaying && playbackStepIndex >= 0 ? inputBuffer[playbackStepIndex] : null;

  // UI color changes based on state
  const containerBorderColor = showWaitingPopup ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.1)]';
  const titleColor = showWaitingPopup ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className={`retro-container p-4 md:p-8 w-full bg-slate-900/90 transition-all duration-500 relative ${containerBorderColor} ${isPaused ? 'grayscale opacity-50' : ''}`}>
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <LayoutGrid className={`w-8 h-8 ${titleColor} drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors duration-500`} />
          <h3 className="retro-title text-xl md:text-2xl">SEQUENCE MIRROR</h3>
        </div>
        <div className="retro-text text-amber-400 text-2xl md:text-3xl">
          {round}/18
        </div>
      </div>

      {/* Horizontal Sequence Display */}
      <div className="flex flex-wrap justify-center gap-1 md:gap-2 mb-8 relative z-10 bg-black/30 p-3 rounded-lg border border-slate-800">
        {Array.from({ length: 18 }).map((_, i) => {
          const val = inputBuffer[i];
          return (
            <div key={i} className={`font-mono text-sm md:text-base font-bold ${val ? 'text-amber-400' : 'text-slate-600'}`}>
              [{val || '__'}]
            </div>
          );
        })}
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

      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-4 relative z-10">
        {GRID_ROWS.map(row => (
          GRID_COLS.map(col => {
            const pos = `${row}${col}` as GridPosition;
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
                  filter: `drop-shadow(0 0 20px ${GLOW_COLORS[cellData.color]}) drop-shadow(0 0 40px ${GLOW_COLORS[cellData.color]})`
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
                className={`h-24 md:h-32 lg:h-40 rounded-xl border-4 transition-all duration-100 flex items-center justify-center text-5xl md:text-7xl font-bold retro-text relative overflow-hidden
                  ${bgClass}
                  ${isPlaying && !isActive ? 'opacity-30' : 'opacity-100'}
                `}
              >
                {showGridLabels && (
                  <div className="absolute top-1 left-2 text-xs md:text-sm font-mono text-slate-400/50 pointer-events-none">
                    {pos}
                  </div>
                )}
                {hasSymbol ? (
                  <div style={symbolStyle} className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center saturate-50">
                    <SymbolGenerator type={cellData.symbol as any} size={80} />
                  </div>
                ) : (
                  pos
                )}
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
};
