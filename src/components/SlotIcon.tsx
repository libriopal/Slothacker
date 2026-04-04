import React, { useEffect, useState } from 'react';

export type SlotIconType =
  | 'Single Bar'
  | 'Double Bar'
  | 'Triple Bar'
  | 'Cherries'
  | 'Bell'
  | 'Plum'
  | '7'
  | 'Dollar'
  | 'Scales';

export interface SlotIconProps {
  /** The specific icon to display from the spritesheet */
  iconType: SlotIconType;
  /** The size of the icon in pixels (width and height will be equal) */
  size?: number;
  /** Optional CSS classes for additional styling */
  className?: string;
  /** Path to the spritesheet image */
  spriteUrl?: string;
  /** 
   * If true, uses a canvas to process the image and completely remove the pink background.
   */
  treatPinkAsTransparent?: boolean;
}

/**
 * Maps each icon to its exact X and Y percentage on the spritesheet.
 * The spritesheet is treated as a 5-column, 2-row grid.
 */
const SPRITE_MAP: Record<SlotIconType, { x: string; y: string }> = {
  // Row 1 (Top)
  'Single Bar': { x: '0%', y: '0%' },
  'Double Bar': { x: 'calc(25% - 28px)', y: '0%' },
  'Cherries':   { x: 'calc(62.5% - 16px)', y: '0%' }, // Visually centered between col 2 and 3
  'Triple Bar': { x: '100%', y: '0%' },
  
  // Row 2 (Bottom)
  'Bell':       { x: '0%', y: '100%' },
  'Plum':       { x: '25%', y: '100%' },
  '7':          { x: '50%', y: '100%' },
  'Dollar':     { x: '75%', y: '100%' },
  'Scales':     { x: '100%', y: '100%' },
};

// Global cache to ensure we only process the image once
let cachedTransparentSprite: string | null = null;
let isProcessing = false;
const listeners: ((url: string) => void)[] = [];

function getTransparentSprite(url: string, callback: (url: string) => void) {
  if (cachedTransparentSprite) {
    callback(cachedTransparentSprite);
    return;
  }
  listeners.push(callback);
  if (isProcessing) return;
  isProcessing = true;

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      listeners.forEach(cb => cb(url));
      return;
    }
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Pink background #ff66aa is roughly 255, 102, 170
      // We use a tolerance window to catch anti-aliased edges
      if (r > 200 && g < 150 && b > 120 && b < 220) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    cachedTransparentSprite = canvas.toDataURL('image/png');
    listeners.forEach(cb => cb(cachedTransparentSprite!));
  };
  
  img.onerror = () => {
    // Fallback to original URL on error
    listeners.forEach(cb => cb(url));
  };
  
  img.src = url;
}

export const SlotIcon: React.FC<SlotIconProps> = ({
  iconType,
  size = 64,
  className = '',
  spriteUrl = '/spritesheet.png', // Default path, assuming it's in the public folder
  treatPinkAsTransparent = false,
}) => {
  const position = SPRITE_MAP[iconType];
  const [currentUrl, setCurrentUrl] = useState(spriteUrl);

  useEffect(() => {
    if (treatPinkAsTransparent) {
      getTransparentSprite(spriteUrl, setCurrentUrl);
    } else {
      setCurrentUrl(spriteUrl);
    }
  }, [spriteUrl, treatPinkAsTransparent]);

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${currentUrl})`,
        // 5 columns = 500% width, 2 rows = 200% height
        backgroundSize: '500% 200%',
        backgroundPosition: `${position.x} ${position.y}`,
        backgroundRepeat: 'no-repeat',
        // Critical for pixel art: prevents blurry scaling
        imageRendering: 'pixelated',
      }}
      role="img"
      aria-label={`${iconType} slot icon`}
    />
  );
};
