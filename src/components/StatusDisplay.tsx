import React from 'react';
import { useStore } from '../store/useStore';

export const StatusDisplay: React.FC = () => {
  const { round, inputBuffer, isPlaying, isPaused, setRound } = useStore();

  return (
    <div className={`w-full h-full flex flex-col gap-6 transition-all duration-500 ${isPaused ? 'grayscale opacity-50' : ''}`}>
      {/* Round Control */}
      <div className="retro-container p-6 flex items-center justify-between">
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30"></div>
        
        <div className="relative z-10 w-full text-center">
          <h3 className="retro-title text-xl text-slate-400">Current Stage</h3>
          <div className="text-6xl font-retro text-amber-400 mt-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">ROUND {round}</div>
        </div>
      </div>

      {/* Input Buffer */}
      <div className="retro-container p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="retro-title text-xl">Memory Sequence</h3>
        </div>
        
        <div className="flex-1 min-h-[120px] bg-black border-4 border-slate-700 p-4 flex flex-wrap gap-3 items-start relative z-10">
          {inputBuffer.length === 0 ? (
            <span className="retro-text text-slate-600 uppercase">Awaiting reel input...</span>
          ) : (
            inputBuffer.map((pos, i) => (
              <div 
                key={i} 
                className="px-4 py-2 bg-amber-500 text-black border-b-4 border-r-4 border-amber-700 font-retro text-2xl font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              >
                {pos}
              </div>
            ))
          )}
        </div>
        
        {isPlaying && (
          <div className="mt-4 text-emerald-400 text-xl font-retro flex items-center gap-2 animate-pulse uppercase tracking-widest relative z-10 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            <div className="w-3 h-3 bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
            Executing Sequence...
          </div>
        )}
      </div>
    </div>
  );
};
