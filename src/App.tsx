/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VoiceListener } from './components/VoiceListener';
import { StatusDisplay } from './components/StatusDisplay';
import { AssistController } from './components/AssistController';
import { CameraCapture } from './components/CameraCapture';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden">
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
          Beat the arcade memory game. Snap the reels, speak the positions (A1-C3), and follow the audio cues to tap perfectly.
        </p>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <VoiceListener />
          <AssistController />
        </div>
        <div className="lg:col-span-1 flex flex-col items-stretch">
          <StatusDisplay />
        </div>
        <div className="lg:col-span-1 flex flex-col items-stretch">
          <CameraCapture />
        </div>
      </main>
    </div>
  );
}
