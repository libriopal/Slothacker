import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { psychoAnalyzer } from '../services/audioAnalyzer';
import { useAudioPlayback } from './useAudioPlayback';

export const usePsychoacoustic = () => {
  const { 
    autoCaptureMode, 
    setAudioLock, 
    setSignalClean, 
    setLastDetectedTone, 
    setAudioError
  } = useStore();
  
  const requestRef = useRef<number>();
  const lastDetectionTime = useRef<number>(0);
  const toneDebounceMs = 300; // Prevent double-triggering on the same tone

  useEffect(() => {
    if (!autoCaptureMode) {
      psychoAnalyzer.stop();
      setAudioLock(false);
      setSignalClean(false);
      setAudioError(null);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    let isMounted = true;

    const startAnalysis = async () => {
      try {
        await psychoAnalyzer.initialize();
        if (isMounted) {
          setAudioLock(true);
          setAudioError(null);
          analyzeLoop();
        }
      } catch (err: any) {
        if (isMounted) {
          setAudioLock(false);
          setSignalClean(false);
          setAudioError(err.message || "Permission denied");
        }
      }
    };

    const analyzeLoop = () => {
      if (!isMounted) return;

      const features = psychoAnalyzer.analyzeFrame();
      
      if (features) {
        setSignalClean(true);
        
        // Resolve Grid Position for visual hint only
        const pos = psychoAnalyzer.resolveGridPosition(features);
        if (pos) {
          const now = performance.now();
          if (now - lastDetectionTime.current > toneDebounceMs) {
            setLastDetectedTone(pos);
            lastDetectionTime.current = now;
            
            // Clear the detected tone display after a short delay
            setTimeout(() => {
              if (isMounted) setLastDetectedTone(null);
            }, 500);
          }
        }
      } else {
        setSignalClean(false);
      }

      requestRef.current = requestAnimationFrame(analyzeLoop);
    };

    startAnalysis();

    return () => {
      isMounted = false;
      psychoAnalyzer.stop();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoCaptureMode, setAudioLock, setSignalClean, setLastDetectedTone, setAudioError]);
};
