import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { audioEngine } from '../services/audioEngine';
import { generateSequenceForRound } from '../utils/levelManager';

export const useAudioPlayback = () => {
  const { inputBuffer, setIsPlaying, setPlaybackStepIndex, customTempo } = useStore();

  const playSequence = useCallback(async () => {
    if (inputBuffer.length === 0) return;

    setIsPlaying(true);
    setPlaybackStepIndex(-1);
    await audioEngine.resume();
    const ctx = audioEngine.getContext();
    
    // Generate sequence with precise timing (God Mode flat timing)
    const sequence = generateSequenceForRound(inputBuffer, customTempo);
    
    const now = ctx.currentTime;
    
    // Schedule sequence
    let sequenceStartTime = now + 0.5; // Start shortly after
    let cumulativeDelay = 0;
    
    sequence.forEach((step, index) => {
      const stepTime = sequenceStartTime + cumulativeDelay;
      audioEngine.scheduleTone(step.position, stepTime);
      
      // Schedule visual sync
      setTimeout(() => {
        setPlaybackStepIndex(index);
      }, (stepTime - now) * 1000);

      cumulativeDelay += step.delay / 1000; // Convert ms to seconds for the NEXT step
    });
    
    // Reset playing state after sequence finishes
    const totalDuration = sequenceStartTime + cumulativeDelay - now;
    setTimeout(() => {
      setPlaybackStepIndex(-1);
      setIsPlaying(false);
    }, totalDuration * 1000);
    
  }, [inputBuffer, setIsPlaying, setPlaybackStepIndex, customTempo]);

  return { playSequence };
};
