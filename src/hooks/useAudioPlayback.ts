import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { audioEngine } from '../services/audioEngine';
import { generateSequenceForRound } from '../utils/levelManager';
import { GridPosition } from '../types';

export const useAudioPlayback = () => {
  const { inputBuffer, setIsPlaying, setPlaybackStepIndex, customTempo, setIsPaused } = useStore();
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const stopSequence = useCallback(() => {
    // Clear all scheduled visual updates
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    
    // Stop all audio
    audioEngine.stopAll();
    
    setIsPlaying(false);
    setPlaybackStepIndex(-1);
  }, [setIsPlaying, setPlaybackStepIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSequence();
  }, [stopSequence]);

  const playSequence = useCallback(async (overrideBuffer?: GridPosition[], pauseAfter: boolean = false) => {
    stopSequence(); // Stop any currently playing sequence

    const bufferToPlay = overrideBuffer || inputBuffer;
    if (bufferToPlay.length === 0) return;

    setIsPlaying(true);
    setPlaybackStepIndex(-1);
    await audioEngine.resume();
    const ctx = audioEngine.getContext();
    
    // Generate sequence with precise timing (God Mode flat timing)
    const sequence = generateSequenceForRound(bufferToPlay, customTempo);
    
    const now = ctx.currentTime;
    
    // Schedule sequence
    let sequenceStartTime = now + 0.5; // Start shortly after
    let cumulativeDelay = 0;
    
    sequence.forEach((step, index) => {
      const stepTime = sequenceStartTime + cumulativeDelay;
      audioEngine.scheduleTone(step.position, stepTime);
      
      // Schedule visual sync
      const timeoutId = setTimeout(() => {
        setPlaybackStepIndex(index);
      }, (stepTime - now) * 1000);
      timeoutRefs.current.push(timeoutId);

      cumulativeDelay += step.delay / 1000; // Convert ms to seconds for the NEXT step
    });
    
    // Reset playing state after sequence finishes
    const totalDuration = sequenceStartTime + cumulativeDelay - now;
    const finishTimeoutId = setTimeout(() => {
      setPlaybackStepIndex(-1);
      setIsPlaying(false);
      // We no longer auto-pause here
    }, totalDuration * 1000);
    timeoutRefs.current.push(finishTimeoutId);
    
  }, [inputBuffer, customTempo, setIsPlaying, setPlaybackStepIndex, stopSequence]);

  return { playSequence, stopSequence };
};
