import React, { memo } from 'react';
import { SymbolType } from '../types';

interface SymbolProps {
  type: SymbolType;
  size: number;
}

export const SymbolGenerator: React.FC<SymbolProps> = memo(({ type, size }) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 100 100',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (type) {
    case '1bar':
      return (
        <svg {...svgProps}>
          <rect x="10" y="35" width="80" height="30" rx="5" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="40" width="70" height="5" fill="#FFDF6C" />
          <text x="50" y="58" fontFamily="monospace" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
        </svg>
      );
    case '2bar':
      return (
        <svg {...svgProps}>
          <rect x="10" y="20" width="80" height="25" rx="5" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="23" width="70" height="4" fill="#FFDF6C" />
          <text x="50" y="38" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
          
          <rect x="10" y="55" width="80" height="25" rx="5" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="58" width="70" height="4" fill="#FFDF6C" />
          <text x="50" y="73" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
        </svg>
      );
    case '2bar2':
      return (
        <svg {...svgProps}>
          <rect x="10" y="20" width="80" height="25" rx="5" fill="#C49010" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="23" width="70" height="4" fill="#FFD050" />
          <text x="50" y="38" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
          
          <rect x="10" y="55" width="80" height="25" rx="5" fill="#C49010" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="58" width="70" height="4" fill="#FFD050" />
          <text x="50" y="73" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
        </svg>
      );
    case '3bar':
      return (
        <svg {...svgProps}>
          <rect x="10" y="10" width="80" height="20" rx="4" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="13" width="70" height="3" fill="#FFDF6C" />
          <text x="50" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
          
          <rect x="10" y="40" width="80" height="20" rx="4" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="43" width="70" height="3" fill="#FFDF6C" />
          <text x="50" y="55" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
          
          <rect x="10" y="70" width="80" height="20" rx="4" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <rect x="15" y="73" width="70" height="3" fill="#FFDF6C" />
          <text x="50" y="85" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#000">BAR</text>
        </svg>
      );
    case 'cherries':
      return (
        <svg {...svgProps}>
          <path d="M50 20 Q 40 40 30 60 M50 20 Q 60 40 70 60" stroke="#228B22" strokeWidth="4" fill="none"/>
          <path d="M50 20 Q 60 10 70 20 Q 60 30 50 20" fill="#228B22" stroke="#000" strokeWidth="2"/>
          <circle cx="30" cy="65" r="18" fill="#CC1111" stroke="#000" strokeWidth="3"/>
          <circle cx="70" cy="65" r="18" fill="#CC1111" stroke="#000" strokeWidth="3"/>
          <circle cx="24" cy="59" r="5" fill="#FF6666"/>
          <circle cx="64" cy="59" r="5" fill="#FF6666"/>
        </svg>
      );
    case 'plumb':
      return (
        <svg {...svgProps}>
          <path d="M50 35 Q 65 20 75 35 Q 60 45 50 35" fill="#228B22" stroke="#000" strokeWidth="2"/>
          <circle cx="50" cy="60" r="28" fill="#6A0DAD" stroke="#000" strokeWidth="3"/>
          <path d="M 32 50 A 18 18 0 0 1 50 32" stroke="#B060FF" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'bell':
      return (
        <svg {...svgProps}>
          <circle cx="50" cy="75" r="10" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <path d="M 50 20 C 75 20 75 65 85 75 L 15 75 C 25 65 25 20 50 20 Z" fill="#D4A017" stroke="#000" strokeWidth="3"/>
          <circle cx="50" cy="15" r="6" fill="none" stroke="#000" strokeWidth="3"/>
          <path d="M 35 35 C 35 25 45 25 50 25" stroke="#FFDF6C" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'melon':
      return (
        <svg {...svgProps}>
          <circle cx="50" cy="50" r="35" fill="#228B22" stroke="#000" strokeWidth="3"/>
          <path d="M 30 20 Q 40 50 30 80 M 50 15 L 50 85 M 70 20 Q 60 50 70 80" stroke="#145214" strokeWidth="5" fill="none"/>
          <ellipse cx="35" cy="35" rx="4" ry="8" fill="#55CC55" transform="rotate(-45 35 35)" />
        </svg>
      );
    case '7':
      return (
        <svg {...svgProps}>
          <text x="50" y="80" fontFamily="monospace" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#CC1111" stroke="#000" strokeWidth="4">7</text>
          <text x="48" y="78" fontFamily="monospace" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#FF6666">7</text>
        </svg>
      );
    case '$':
      return (
        <svg {...svgProps}>
          <text x="50" y="80" fontFamily="monospace" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#D4A017" stroke="#000" strokeWidth="4">$</text>
          <text x="48" y="78" fontFamily="monospace" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#FFDF6C">$</text>
        </svg>
      );
    default:
      return null;
  }
});

SymbolGenerator.displayName = 'SymbolGenerator';
