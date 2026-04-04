import React from 'react';
import { useStore } from '../store/useStore';
import { Activity, Lock, Unlock, Mic, AlertTriangle } from 'lucide-react';
import { usePsychoacoustic } from '../hooks/usePsychoacoustic';

export const AudioIntelligence: React.FC = () => {
  const { 
    audioLock, 
    signalClean, 
    autoCaptureMode, 
    toggleAutoCapture, 
    lastDetectedTone,
    audioError,
    isPaused
  } = useStore();

  // Initialize the psychoacoustic hook
  usePsychoacoustic();

  return (
    <div className={`retro-container p-6 w-full mt-6 border-emerald-900 bg-slate-900/80 transition-all duration-500 ${isPaused ? 'grayscale opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
          <h3 className="retro-title text-lg text-emerald-400">AUDIO INTELLIGENCE</h3>
        </div>
        <button
          onClick={toggleAutoCapture}
          className={`retro-btn text-sm px-4 py-2 flex items-center gap-2 ${
            autoCaptureMode 
              ? '!bg-emerald-600 !border-emerald-800 !text-white shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
              : '!bg-slate-800 !border-slate-900 !text-slate-400'
          }`}
        >
          <Mic className="w-4 h-4" />
          {autoCaptureMode ? 'AUTO-CAPTURE ON' : 'AUTO-CAPTURE OFF'}
        </button>
      </div>

      {audioError && (
        <div className="bg-red-900/50 border border-red-500 p-3 mb-4 rounded flex items-start gap-3 relative z-10">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-bold text-sm">Microphone Access Denied</p>
            <p className="text-red-300 text-xs mt-1">
              Please allow microphone permissions in your browser to use Auto-Capture.
            </p>
          </div>
        </div>
      )}

      <div className="bg-black/50 border-2 border-slate-800 p-4 font-mono text-sm space-y-3 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">AUDIO LOCK:</span>
          <span className={`flex items-center gap-2 ${audioLock ? 'text-emerald-400' : 'text-red-500'}`}>
            {audioLock ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {audioLock ? 'ACTIVE ✓' : 'DISCONNECTED'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500">SIGNAL:</span>
          <span className={signalClean ? 'text-emerald-400' : 'text-slate-600'}>
            {signalClean ? 'CLEAN ▂▃▅▆▇' : 'NOISE ▂_  _'}
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-slate-800 pt-3">
          <span className="text-slate-500">DETECTED:</span>
          <span className="text-amber-400 font-bold text-lg">
            {lastDetectedTone || '--'}
          </span>
        </div>
      </div>
      
      <p className="retro-text text-slate-500 text-xs mt-4 leading-tight relative z-10">
        ASM-ASL v2: Psychoacoustic Sync Assist. Uses semantic audio recognition (pitch + pan) to automatically capture grid sequences from the kiosk speakers.
      </p>
    </div>
  );
};
