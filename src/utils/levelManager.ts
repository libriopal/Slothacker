import { GridPosition, Step } from '../types';

export const generateSequenceForRound = (
  round: number,
  buffer: GridPosition[],
  tempoMultiplier: number = 1.0,
  godMode: boolean = false
): Step[] => {
  if (buffer.length === 0) return [];

  const sequence: Step[] = [];
  
  // GOD MODE: Completely removes complex rhythms and speed scaling.
  // Forces a steady, slow, and comfortable pace for every single step.
  if (godMode) {
    const steadyDelay = 600 * tempoMultiplier;
    buffer.forEach((pos) => {
      sequence.push({ position: pos, delay: steadyDelay });
    });
    return sequence;
  }

  // Calculate base delay scaling from 600ms down to 200ms across 18 rounds
  const speedFactor = Math.max(200, 600 - (round * 22));
  let baseDelay = speedFactor * tempoMultiplier;

  // Assistant Intervention: Slow down the pattern for later rounds to make the game easier.
  // The arcade game gets blindingly fast, so the assistant compensates by playing it back 
  // at a more manageable speed for rounds 10+, adding back some delay so it's not impossible.
  if (round > 10) {
    const assistSlowdown = (round - 10) * 35; // Gradually adds up to 280ms back by round 18
    baseDelay += (assistSlowdown * tempoMultiplier);
  }

  buffer.forEach((pos, index) => {
    let delay = baseDelay;

    // Pre-intermission rounds (5, 10, 15)
    if (round % 5 === 0) {
      delay = baseDelay * 0.9; // Slightly faster to build tension
    }
    // Post-intermission rounds (6, 11, 16) - Tricky syncopation
    else if ((round - 1) % 5 === 0 && round > 1) {
      if (index > 0 && index % 3 === 0) delay = baseDelay * 1.5;
    }
    // Late game extreme difficulty (Rounds 13-18)
    else if (round >= 13) {
      if (index > 0) {
        if (index % 4 === 0) delay = baseDelay * 1.8; // Long pause
        else if (index % 2 === 0) delay = baseDelay * 0.8; // Quick step (moderated to not be too fast)
      }
    }

    sequence.push({ position: pos, delay });
  });

  return sequence;
};
