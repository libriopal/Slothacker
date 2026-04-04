import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioPlayback } from '../hooks/useAudioPlayback';

export const VoiceListener: React.FC = () => {
  const { isListening } = useStore();
  const { playSequence } = useAudioPlayback();
  const { toggleListening } = useSpeechRecognition(playSequence);

  return (
    <div className="retro-container p-8 flex flex-col items-center justify-center">
      <button
        onClick={toggleListening}
        className={`relative flex items-center justify-center w-32 h-32 border-b-8 border-r-8 active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none ${
          isListening 
            ? 'bg-red-500 border-red-800' 
            : 'bg-slate-600 border-slate-800'
        }`}
      >
        {isListening ? (
          <>
            <div className="absolute inset-0 border-4 border-red-400 animate-ping opacity-75"></div>
            <Mic className="w-16 h-16 text-white z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />
          </>
        ) : (
          <MicOff className="w-16 h-16 text-slate-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />
        )}
      </button>
      
      <div className="mt-8 text-center relative z-10">
        <h2 className="retro-title text-3xl">
          {isListening ? 'LISTENING...' : 'MIC OFF'}
        </h2>
        <p className="retro-text text-slate-400 mt-4 max-w-xs mx-auto">
          {isListening 
            ? 'SPEAK GRID POSITIONS (E.G., "A1", "B2"). SAY "PLAY" TO START.' 
            : 'CLICK TO ENABLE VOICE INPUT.'}
        </p>
      </div>
    </div>
  );
};
