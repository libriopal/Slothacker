import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { audioEngine } from '../services/audioEngine';
import { generateSequenceForRound } from '../utils/levelManager';

export const useAudioPlayback = () => {
  const { round, inputBuffer, tempoMultiplier, godMode, setIsPlaying } = useStore();

  const playSequence = useCallback(async () => {
    if (inputBuffer.length === 0) return;

    setIsPlaying(true);
    await audioEngine.resume();
    const ctx = audioEngine.getContext();
    
    // Generate sequence with precise timing
    const sequence = generateSequenceForRound(round, inputBuffer, tempoMultiplier, godMode);
    
    // Schedule countdown
    const now = ctx.currentTime;
    const countdownStart = now + 0.1;
    
    // 3, 2, 1, Go
    for (let i = 3; i >= 0; i--) {
      const time = countdownStart + (3 - i) * 0.5;
      audioEngine.scheduleCountdown(i, time);
    }
    
    // Schedule sequence
    let sequenceStartTime = countdownStart + 2.0; // Start after countdown
    let cumulativeDelay = 0;
    
    sequence.forEach((step) => {
      cumulativeDelay += step.delay / 1000; // Convert ms to seconds
      const stepTime = sequenceStartTime + cumulativeDelay;
      audioEngine.scheduleTone(step.position, stepTime);
    });
    
    // Reset playing state after sequence finishes
    const totalDuration = sequenceStartTime + cumulativeDelay - now + 0.5;
    setTimeout(() => {
      setIsPlaying(false);
    }, totalDuration * 1000);
    
  }, [round, inputBuffer, tempoMultiplier, godMode, setIsPlaying]);

  return { playSequence };
};
