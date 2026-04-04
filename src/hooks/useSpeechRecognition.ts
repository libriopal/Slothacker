import { useEffect, useCallback } from 'react';
import { speechService } from '../services/speechService';
import { useStore } from '../store/useStore';
import { GridPosition } from '../types';
import { audioEngine } from '../services/audioEngine';

export const useSpeechRecognition = (onPlayCommand: () => void) => {
  const { isListening, setIsListening, addToBuffer, clearBuffer } = useStore();

  const handleResult = useCallback((transcript: string) => {
    console.log("Heard:", transcript);
    
    // Check for commands
    if (speechService.isCommand(transcript, 'play') || speechService.isCommand(transcript, 'go')) {
      onPlayCommand();
      return;
    }
    
    if (speechService.isCommand(transcript, 'clear') || speechService.isCommand(transcript, 'reset')) {
      clearBuffer();
      return;
    }

    // Parse grid positions
    const positions = speechService.normalizeInput(transcript);
    
    if (positions.length > 0) {
      positions.forEach(pos => {
        addToBuffer(pos as GridPosition);
      });
    } else {
      // If we heard something but it wasn't a valid command or position
      if (transcript.trim().length > 0) {
        audioEngine.playError();
      }
    }
  }, [addToBuffer, clearBuffer, onPlayCommand]);

  const handleError = useCallback((error: string) => {
    console.error("Speech error:", error);
    if (error !== 'no-speech') {
      setIsListening(false);
    }
  }, [setIsListening]);

  const handleEnd = useCallback(() => {
    // Auto-restart if we are supposed to be listening
    if (isListening) {
      speechService.start(handleResult, handleError, handleEnd);
    }
  }, [isListening, handleResult, handleError]);

  useEffect(() => {
    if (isListening) {
      audioEngine.init(); // Ensure audio context is initialized
      speechService.start(handleResult, handleError, handleEnd);
    } else {
      speechService.stop();
    }

    return () => {
      speechService.stop();
    };
  }, [isListening, handleResult, handleError, handleEnd]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return { toggleListening };
};
