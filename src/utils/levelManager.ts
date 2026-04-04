import { GridPosition, Step } from '../types';

export const generateSequenceForRound = (
  buffer: GridPosition[],
  customTempo: number = 600
): Step[] => {
  if (buffer.length === 0) return [];

  const sequence: Step[] = [];
  
  // Use the custom tempo provided by the user
  const delay = customTempo; 

  buffer.forEach((pos) => {
    sequence.push({ position: pos, delay: delay });
  });

  return sequence;
};
