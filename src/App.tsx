import React, { useEffect } from 'react';
import { AssistController } from './components/AssistController';
import { AudioIntelligence } from './components/AudioIntelligence';
import { SequenceMirror } from './components/SequenceMirror';
import { PauseCircle, Rewind, FastForward, Undo2, Play, ChevronLeft, Settings, X } from 'lucide-react';
import { useStore } from './store/useStore';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const { 
    isPaused, setIsPaused, round, setRound, inputBuffer, undoLastInput,
    isSettingsOpen, setIsSettingsOpen, volume, setVolume,
    crtEffect, setCrtEffect, showGridLabels, setShowGridLabels,
    customTempo, setCustomTempo
  } = useStore();
  const { playSequence } = useAudioPlayback();

  useEffect(() => {
    audioEngine.setMasterVolume(volume);
  }, [volume]);

  const handleUnpause = () => {
    setIsPaused(false);
    if (inputBuffer.length >= round) {
      setRound(round + 1);
    }
  };

  const handleRewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRound(Math.max(1, round - 1));
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRound(Math.min(18, round + 1));
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation();
    undoLastInput();
  };

  const toggleSettings = () => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    } else {
      setIsSettingsOpen(true);
      setIsPaused(true);
    }
  };

  return (
    <div className={`h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-4 px-4 font-sans relative overflow-hidden transition-all duration-500 ${crtEffect ? 'crt-overlay' : ''}`}>
      
      {/* Settings Button */}
      <div className="absolute top-4 right-4 z-[60]">
        <button 
          onClick={toggleSettings}
          className={`retro-btn p-3 ${isSettingsOpen ? '!bg-red-900/50 !border-red-500 !text-red-400' : '!bg-slate-800 !border-slate-700 !text-slate-300'}`}
        >
          {isSettingsOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
        </button>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-start pt-20 px-4 overflow-y-auto">
          <div className="w-full max-w-3xl flex flex-col gap-6">
            <h2 className="retro-title text-3xl text-emerald-400 mb-4 border-b-2 border-emerald-900 pb-2">SETTINGS</h2>
            
            <div className="retro-container p-6 bg-slate-900/80 border-slate-700 flex flex-col gap-6">
              
              {/* Volume */}
              <div className="flex flex-col gap-2">
                <label className="text-emerald-400 font-mono flex justify-between">
                  <span>MASTER VOLUME</span>
                  <span>{volume}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Custom Tempo */}
              <div className="flex flex-col gap-2">
                <label className="text-emerald-400 font-mono flex justify-between">
                  <span>PLAYBACK SPEED (ms per step)</span>
                  <span>{customTempo}ms</span>
                </label>
                <input 
                  type="range" 
                  min="200" max="2000" step="50"
                  value={customTempo} 
                  onChange={(e) => setCustomTempo(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-mono">CRT SCANLINES</span>
                <button 
                  onClick={() => setCrtEffect(!crtEffect)}
                  className={`retro-btn px-4 py-2 ${crtEffect ? '!bg-emerald-900/50 !border-emerald-500 !text-emerald-400' : '!bg-slate-800 !border-slate-700 !text-slate-500'}`}
                >
                  {crtEffect ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-mono">SHOW GRID LABELS</span>
                <button 
                  onClick={() => setShowGridLabels(!showGridLabels)}
                  className={`retro-btn px-4 py-2 ${showGridLabels ? '!bg-emerald-900/50 !border-emerald-500 !text-emerald-400' : '!bg-slate-800 !border-slate-700 !text-slate-500'}`}
                >
                  {showGridLabels ? 'ON' : 'OFF'}
                </button>
              </div>

            </div>

            {/* Audio Intelligence moved here */}
            <AudioIntelligence />
            
          </div>
        </div>
      )}

      {/* Pause Overlay (only show if settings is NOT open) */}
      {isPaused && !isSettingsOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={handleUnpause}
        >
          <div 
            className="bg-slate-900/95 border-4 border-red-500 p-6 md:p-8 rounded-2xl flex flex-col items-center max-w-lg w-full mx-4 text-center shadow-[0_0_100px_rgba(239,68,68,0.5)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <PauseCircle className="w-20 h-20 text-red-500 mb-4 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-black text-red-400 mb-2" style={{ fontFamily: '"VT323", monospace' }}>
              SYSTEM PAUSED
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8" style={{ fontFamily: '"VT323", monospace' }}>
              TAP "RESUME" TO START NEXT ROUND
            </p>

            <div className="grid grid-cols-4 gap-2 w-full mb-4">
              <button onClick={handleRewind} className="retro-btn !bg-slate-800 !border-slate-600 !text-slate-300 hover:!bg-slate-700 py-3 flex flex-col items-center justify-center gap-1">
                <Rewind className="w-5 h-5" />
                <span className="text-[10px] font-bold">REWIND</span>
              </button>
              <button onClick={handleUndo} className="retro-btn !bg-orange-900/50 !border-orange-700 !text-orange-400 hover:!bg-orange-800/50 py-3 flex flex-col items-center justify-center gap-1">
                <Undo2 className="w-5 h-5" />
                <span className="text-[10px] font-bold">UNDO</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsPaused(false); }} className="retro-btn !bg-slate-800 !border-slate-600 !text-slate-300 hover:!bg-slate-700 py-3 flex flex-col items-center justify-center gap-1">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-[10px] font-bold">RESTART</span>
              </button>
              <button onClick={handleSkip} className="retro-btn !bg-slate-800 !border-slate-600 !text-slate-300 hover:!bg-slate-700 py-3 flex flex-col items-center justify-center gap-1">
                <FastForward className="w-5 h-5" />
                <span className="text-[10px] font-bold">SKIP</span>
              </button>
            </div>

            <button onClick={handleUnpause} className="w-full retro-btn !bg-emerald-900/50 !border-emerald-700 !text-emerald-400 hover:!bg-emerald-800/50 py-4 text-xl flex items-center justify-center gap-2">
              <Play className="w-6 h-6" />
              RESUME
            </button>
          </div>
        </div>
      )}
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-600/10 blur-[120px] pointer-events-none rounded-full"></div>
      
      <main className="w-full max-w-3xl flex-1 flex flex-col gap-4 relative z-10 justify-center">
        <SequenceMirror />
        <AssistController />
      </main>
    </div>
  );
}
