import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { Play, Pause, Rewind, FastForward, Undo2, ChevronLeft } from 'lucide-react';

export const AssistController: React.FC = () => {
  const { inputBuffer, isPlaying, isPaused, round, setRound, undoLastInput, setIsPaused, customTempo } = useStore();
  const { playSequence, stopSequence } = useAudioPlayback();
  
  // Timeline state
  const [currentTime, setCurrentTime] = useState(0);
  const totalTime = inputBuffer.length > 0 ? (inputBuffer.length * customTempo) / 1000 : 0;

  // Update timeline when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused) {
      // Start from 0 when playback starts
      setCurrentTime(0);
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= totalTime) {
          setCurrentTime(totalTime);
          clearInterval(interval);
        } else {
          setCurrentTime(elapsed);
        }
      }, 50);
    } else if (!isPlaying && !isPaused) {
      setCurrentTime(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, totalTime]);

  const handleRestart = () => {
    stopSequence();
    setCurrentTime(0);
    setIsPaused(true); // Just rewind to start, wait for play
  };

  const handleRewind = () => {
    stopSequence();
    setRound(Math.max(1, round - 1));
  };

  const handleSkip = () => {
    stopSequence();
    setRound(Math.min(18, round + 1));
  };

  const handleUndo = () => {
    stopSequence();
    undoLastInput();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalTime > 0 ? Math.min(100, (currentTime / totalTime) * 100) : 0;

  return (
    <div className="retro-container p-4 md:p-6 w-full bg-slate-900/90 border-slate-700">
      
      {/* Timeline Scrubber */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-blue-400 font-mono text-sm w-16 text-right">
          {formatTime(currentTime)}
        </span>
        
        <div className="flex-1 h-4 bg-slate-600 rounded-full relative overflow-hidden border border-slate-500">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-75 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
          <div 
            className="absolute top-0 h-full w-3 bg-blue-300 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-75 ease-linear"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
        
        <span className="text-slate-400 font-mono text-sm w-16">
          {formatTime(totalTime)}
        </span>
      </div>

      {/* Media Controls */}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <button
          onClick={handleUndo}
          disabled={inputBuffer.length === 0}
          className="retro-btn !bg-orange-900/30 !border-orange-800 !text-orange-500 hover:!bg-orange-800/50 disabled:opacity-30 p-3 md:p-4"
          title="Undo Last Input"
        >
          <Undo2 className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="w-px h-8 bg-slate-700 mx-2"></div>

        <button
          onClick={handleRewind}
          disabled={round <= 1}
          className="retro-btn !bg-slate-800 !border-slate-700 !text-slate-300 hover:!bg-slate-700 disabled:opacity-30 p-3 md:p-4"
          title="Previous Round"
        >
          <Rewind className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={handleRestart}
          disabled={inputBuffer.length === 0}
          className="retro-btn !bg-slate-800 !border-slate-700 !text-slate-300 hover:!bg-slate-700 disabled:opacity-30 p-3 md:p-4"
          title="Restart Sequence"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Play Button */}
        <button
          onClick={() => {
            setIsPaused(false);
            playSequence();
          }}
          disabled={inputBuffer.length === 0}
          className={`retro-btn p-4 md:p-6 mx-1 ${
            !isPaused && isPlaying
              ? '!bg-emerald-900/50 !border-emerald-500 !text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
              : '!bg-slate-800 !border-slate-700 !text-slate-500'
          } disabled:opacity-30 disabled:shadow-none`}
          title="Play"
        >
          <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
        </button>

        {/* Pause Button */}
        <button
          onClick={() => {
            stopSequence();
            setIsPaused(true);
          }}
          disabled={inputBuffer.length === 0}
          className={`retro-btn p-4 md:p-6 mx-1 ${
            isPaused 
              ? '!bg-red-900/50 !border-red-500 !text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : '!bg-slate-800 !border-slate-700 !text-slate-500'
          } disabled:opacity-30 disabled:shadow-none`}
          title="Pause"
        >
          <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" />
        </button>

        <button
          onClick={handleSkip}
          disabled={round >= 18}
          className="retro-btn !bg-slate-800 !border-slate-700 !text-slate-300 hover:!bg-slate-700 disabled:opacity-30 p-3 md:p-4"
          title="Next Round"
        >
          <FastForward className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};
