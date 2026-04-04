import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

export const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setSnapshot(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const retake = () => {
    setSnapshot(null);
    startCamera();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="retro-container p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between relative z-10">
        <h2 className="retro-title flex items-center gap-2">
          <Camera className="w-6 h-6" /> Reel Scanner
        </h2>
      </div>
      
      <div className="flex-1 relative border-4 border-slate-700 bg-black overflow-hidden z-10 flex flex-col justify-center items-center min-h-[300px]">
        {error ? (
          <div className="text-red-500 retro-text text-center p-4">{error}</div>
        ) : snapshot ? (
          <>
            <img 
              src={snapshot} 
              alt="Reels Snapshot" 
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
            <button onClick={retake} className="retro-btn absolute bottom-4 right-4 text-lg">
              <RefreshCw className="w-5 h-5" /> Retake
            </button>
          </>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 scanlines pointer-events-none opacity-50"></div>
            <button onClick={takeSnapshot} className="retro-btn absolute bottom-4 right-4 text-lg">
              <Camera className="w-5 h-5" /> Snap
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
      <p className="retro-text text-slate-400 text-center relative z-10 text-lg">
        Snap the reels before the round starts to memorize positions!
      </p>
    </div>
  );
};
