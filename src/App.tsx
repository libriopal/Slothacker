/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StatusDisplay } from './components/StatusDisplay';
import { AssistController } from './components/AssistController';
import { AudioIntelligence } from './components/AudioIntelligence';
import { SequenceMirror } from './components/SequenceMirror';
import { CameraSetup } from './components/CameraSetup';
import { Gamepad2, PauseCircle } from 'lucide-react';
import { useStore } from './store/useStore';
import { useAudioPlayback } from './hooks/useAudioPlayback';

export default function App() {
  const { cameraSetupComplete, isPaused, setIsPaused } = useStore();
  const { playSequence } = useAudioPlayback();

  const handleUnpause = () => {
    setIsPaused(false);
    playSequence();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden transition-all duration-500">
      {!cameraSetupComplete && <CameraSetup />}
      
      {/* Pause Overlay */}
      {isPaused && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={handleUnpause}
        >
          <div className="bg-slate-900/90 border-4 border-red-500 p-8 rounded-2xl flex flex-col items-center max-w-lg text-center shadow-[0_0_100px_rgba(239,68,68,0.5)] animate-pulse">
            <PauseCircle className="w-24 h-24 text-red-500 mb-6" />
            <h2 className="text-4xl font-black text-red-400 mb-4" style={{ fontFamily: '"VT323", monospace' }}>
              SYSTEM PAUSED
            </h2>
            <p className="text-xl text-slate-300" style={{ fontFamily: '"VT323", monospace' }}>
              TAP ANYWHERE TO UNPAUSE AND PLAY THIS ROUND'S PATTERN
            </p>
          </div>
        </div>
      )}
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-600/10 blur-[120px] pointer-events-none rounded-full"></div>
      
      <header className="mb-12 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <Gamepad2 className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-3 drop-shadow-[0_4px_0px_rgba(245,158,11,0.8)]" style={{ fontFamily: '"VT323", monospace' }}>
          SLOT <span className="text-amber-400">HACKER</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-xl" style={{ fontFamily: '"VT323", monospace' }}>
          Automated Psychoacoustic Sync Assist
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8 relative z-10">
        {/* Primary Focus: The Grid */}
        <div className="w-full">
          <SequenceMirror />
        </div>

        {/* Secondary Controls & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <AudioIntelligence />
          </div>
          <div className="flex flex-col gap-6">
            <StatusDisplay />
            <AssistController />
          </div>
        </div>
      </main>
    </div>
  );
}
