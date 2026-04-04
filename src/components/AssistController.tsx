import React from 'react';
import { useStore } from '../store/useStore';
import { Settings2, Zap } from 'lucide-react';

export const AssistController: React.FC = () => {
  const { tempoMultiplier, setTempoMultiplier, godMode, toggleGodMode } = useStore();

  return (
    <div className="retro-container p-6 w-full">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Settings2 className="w-8 h-8 text-amber-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
        <h3 className="retro-title text-xl">Assist Settings</h3>
      </div>
      
      <div className="space-y-6 relative z-10">
        <div>
          <div className="flex justify-between retro-text mb-4">
            <span className="text-slate-300">TEMPO ADJ</span>
            <span className="text-amber-400 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">{tempoMultiplier.toFixed(1)}X</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={tempoMultiplier}
            onChange={(e) => setTempoMultiplier(parseFloat(e.target.value))}
            className="w-full h-4 bg-slate-800 border-2 border-slate-600 appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between retro-text text-slate-500 mt-2">
            <span>FAST</span>
            <span>NORM</span>
            <span>SLOW</span>
          </div>
        </div>

        <div className="pt-4 border-t-4 border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="retro-text text-slate-300 flex items-center gap-2">
              <Zap className={`w-5 h-5 ${godMode ? 'text-emerald-400' : 'text-slate-500'}`} />
              GOD MODE
            </span>
          </div>
          <button
            onClick={toggleGodMode}
            className={`retro-btn w-full !text-xl ${
              godMode 
                ? '!bg-emerald-500 !border-emerald-700 !text-black shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                : '!bg-slate-800 !border-slate-900 !text-slate-500'
            }`}
          >
            {godMode ? 'ACTIVE: STEADY RHYTHM' : 'OFF'}
          </button>
          <p className="retro-text text-slate-500 text-sm mt-2 leading-tight">
            Removes all complex rhythms and speed scaling. Forces a steady, slow pace for every round.
          </p>
        </div>
      </div>
    </div>
  );
};
