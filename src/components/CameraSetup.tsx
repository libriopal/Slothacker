import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Camera, X, Loader2, SkipForward } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { GridPosition, GlowColor, SymbolType } from '../types';

const COLORS: GlowColor[] = ['red', 'blue', 'green', 'gray', 'orange', 'purple'];

export const CameraSetup: React.FC = () => {
  const { setCameraSetupComplete, setGridData } = useStore();
  const [step, setStep] = useState<'prompt' | 'camera' | 'analyzing'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setStep('camera');
      setError(null);
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  useEffect(() => {
    if (videoRef.current && stream && step === 'camera') {
      videoRef.current.srcObject = stream;
    }
  }, [stream, step]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSkip = () => {
    stopCamera();
    setCameraSetupComplete(true);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setStep('analyzing');
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return handleSkip();
    
    ctx.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    stopCamera();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            },
            {
              text: "Analyze this 3x3 slot machine grid. Identify the symbol in each of the 9 positions. The possible symbols are '1BAR', '2BARS', '3BARS', 'Cherries', 'Bell', 'Plum', '7', and '$'. If you are unsure, make your best guess among these eight. Return a JSON object mapping the grid coordinates to the symbol. The columns are A, B, C (left to right) and rows are 1, 2, 3 (top to bottom). So the top-left is A1, top-middle is B1, top-right is C1, middle-left is A2, etc."
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              A1: { type: Type.STRING },
              B1: { type: Type.STRING },
              C1: { type: Type.STRING },
              A2: { type: Type.STRING },
              B2: { type: Type.STRING },
              C2: { type: Type.STRING },
              A3: { type: Type.STRING },
              B3: { type: Type.STRING },
              C3: { type: Type.STRING },
            },
            required: ["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      const newGridData: any = {};
      
      Object.keys(result).forEach(key => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        newGridData[key] = {
          symbol: result[key] as SymbolType,
          color: randomColor
        };
      });

      setGridData(newGridData);
      setCameraSetupComplete(true);
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
      setStep('prompt');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="retro-container max-w-lg w-full p-8 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30"></div>
        
        {step === 'prompt' && (
          <div className="relative z-10 flex flex-col items-center">
            <Camera className="w-16 h-16 text-amber-400 mb-6" />
            <h2 className="retro-title text-3xl mb-4">Initialize Visual Grid?</h2>
            <p className="text-slate-400 mb-8 font-mono">
              Take a picture of the kiosk to map the symbols to your grid, or skip to use standard coordinates.
            </p>
            
            {error && <p className="text-red-400 mb-4 font-mono">{error}</p>}
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={startCamera}
                className="retro-btn flex-1 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
              <button 
                onClick={handleSkip}
                className="retro-btn flex-1 flex items-center justify-center gap-2 !bg-slate-800 !border-slate-600 !text-slate-300 hover:!bg-slate-700"
              >
                <SkipForward className="w-5 h-5" />
                Skip
              </button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="relative z-10 flex flex-col items-center w-full">
            <h2 className="retro-title text-2xl mb-4">Align Kiosk Grid</h2>
            <div className="w-full aspect-square bg-black border-4 border-amber-500/50 rounded-lg overflow-hidden relative mb-6">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              {/* Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-amber-500/30"></div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={captureAndAnalyze}
                className="retro-btn flex-1"
              >
                Capture
              </button>
              <button 
                onClick={() => { stopCamera(); setStep('prompt'); }}
                className="retro-btn !bg-slate-800 !border-slate-600 !text-slate-300 hover:!bg-slate-700 px-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="relative z-10 flex flex-col items-center py-12">
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-6" />
            <h2 className="retro-title text-2xl text-amber-400 animate-pulse">Analyzing Grid...</h2>
            <p className="text-slate-400 mt-4 font-mono">Mapping 32-bit sprites...</p>
          </div>
        )}
      </div>
    </div>
  );
};
