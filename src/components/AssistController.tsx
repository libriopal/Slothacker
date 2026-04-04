import React from 'react';
import { useStore } from '../store/useStore';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { Play, Pause, Trash2, Clock } from 'lucide-react';

export const AssistController: React.FC = () => {
  const { inputBuffer, isPlaying, isPaused, clearBuffer, customTempo, setCustomTempo, setIsPaused } = useStore();
  const { playSequence } = useAudioPlayback();

  const handlePlayPause = () => {
    if (isPaused) {
      setIsPaused(false);
      playSequence();
    } else {
      playSequence();
    }
  };

  return (
    <div className="retro-container p-6 w-full bg-slate-900/80 border-slate-700">
      <h3 className="retro-title text-lg text-slate-300 mb-4">MANUAL OVERRIDE</h3>
      
      <div className="flex items-center gap-4 mb-6 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <Clock className="w-5 h-5 text-amber-400" />
        <label className="text-slate-300 font-mono text-sm flex-1">CUSTOM TIMING (MS):</label>
        <input 
          type="number" 
          value={customTempo}
          onChange={(e) => setCustomTempo(Math.max(100, Math.min(3000, parseInt(e.target.value) || 600)))}
          className="bg-slate-900 border border-amber-500/50 rounded px-3 py-1 text-amber-400 font-mono w-24 text-center focus:outline-none focus:border-amber-400"
          step="50"
          min="100"
          max="3000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isPaused ? (
          <button
            onClick={handlePlayPause}
            className="retro-btn !bg-red-900/50 !border-red-700 !text-red-400 hover:!bg-red-800/50 flex flex-col items-center justify-center py-4 gap-2"
          >
            <Pause className="w-6 h-6" />
            <span>PAUSED</span>
          </button>
        ) : (
          <button
            onClick={handlePlayPause}
            disabled={isPlaying || inputBuffer.length === 0}
            className="retro-btn !bg-emerald-900/50 !border-emerald-700 !text-emerald-400 hover:!bg-emerald-800/50 disabled:opacity-50 flex flex-col items-center justify-center py-4 gap-2"
          >
            <Play className="w-6 h-6" />
            <span>PLAY</span>
          </button>
        )}
        
        <button
          onClick={clearBuffer}
          disabled={isPlaying || inputBuffer.length === 0}
          className="retro-btn !bg-slate-800 !border-slate-600 !text-slate-400 hover:!bg-slate-700 disabled:opacity-50 flex flex-col items-center justify-center py-4 gap-2"
        >
          <Trash2 className="w-6 h-6" />
          <span>CLEAR</span>
        </button>
      </div>
    </div>
  );
};
